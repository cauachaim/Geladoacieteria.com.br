// ===== Utilidades =====
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// função leve para remover tudo que não for dígito
const stripNumbers = s => (s || '').split('').filter(c => '0123456789'.includes(c)).join('');

// Ano no rodapé
$('#year').textContent = new Date().getFullYear();

// ===== Menu no logo =====
const logoBtn = $('#logoBtn');
const logoMenu = $('#logoMenu');
const toggleMenu = (show) => { 
  logoMenu.style.display = show ? 'block' : 'none'; 
  logoBtn.setAttribute('aria-expanded', show); 
};
logoBtn.addEventListener('click', (e) => { 
  e.stopPropagation(); 
  toggleMenu(logoMenu.style.display !== 'block'); 
});
document.addEventListener('click', () => toggleMenu(false));

// ===== Mascote: animação =====
const masc = document.getElementById('mascote');
masc.classList.add('flyIn');
masc.addEventListener('animationend', (ev) => {
  if (ev.animationName === 'flyIn') masc.classList.add('float');
});

// ===== Foto-carousel =====
const slides = $('#slides');
const slideEls = $$('.slide', slides);
const dotsWrap = $('#dots');
let idx = 0;
const total = slideEls.length;

function renderDots() {
  dotsWrap.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div'); 
    d.className = 'dot' + (i === idx ? ' active' : ''); 
    d.dataset.i = i;
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  }
}
function update() {
  slides.style.transform = `translateX(-${idx * 100}%)`;
  $$('.dot').forEach(d => d.classList.remove('active'));
  const active = $$('.dot')[idx]; 
  if (active) active.classList.add('active');
}
function next() { idx = (idx + 1) % total; update(); }
function prev() { idx = (idx - 1 + total) % total; update(); }
function goTo(i) { idx = i % total; update(); }

$('#next').addEventListener('click', next);
$('#prev').addEventListener('click', prev);

// autoplay
let autoplay = setInterval(next, 4000);
// pause on hover
document.querySelector('.photo-carousel').addEventListener('mouseenter', () => clearInterval(autoplay));
document.querySelector('.photo-carousel').addEventListener('mouseleave', () => autoplay = setInterval(next, 4000));

renderDots(); 
update();

// ===== Busca simples =====
$('#searchOpen').addEventListener('click', () => {
  const q = prompt('Pesquisar (ex: milk shake):');
  if (!q) return;
  const ql = q.trim().toLowerCase();
  const tagged = $$('[data-tags]');
  const hit = tagged.find(el => (el.dataset.tags || '').toLowerCase().includes(ql));
  if (hit) { 
    hit.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
    hit.style.outline = '2px solid var(--accent-2)'; 
    setTimeout(() => hit.style.outline = 'none', 1200); 
  }
  else alert('Nada encontrado para: ' + q);
});

// ===== Modal generics =====
const modal = $('#loginModal');
const openModal = () => modal.style.display = 'flex';
const closeModal = () => modal.style.display = 'none';
$('#loginBtn').addEventListener('click', openModal);
$('#openLogin').addEventListener('click', (e) => { 
  e.preventDefault(); 
  openModal(); 
  toggleMenu(false); 
});
$$('[data-close]').forEach(b => b.addEventListener('click', closeModal));

// ===== Login + verificação (DEMO) =====
let otpCode = null;
const validarCampos = () => {
  const nome = $('#nome').value.trim();
  const fone = stripNumbers($('#fone').value);
  const ok = nome.length >= 2 && fone.length >= 10 && ($('#otp').value ? $('#otp').value.length === 6 : false);
  $('#confirmLogin').disabled = !ok;
};
['input', 'keyup'].forEach(evt => {
  $('#nome').addEventListener(evt, validarCampos);
  $('#fone').addEventListener(evt, validarCampos);
  $('#otp').addEventListener(evt, validarCampos);
});

$('#enviarOtp').addEventListener('click', () => {
  const fone = stripNumbers($('#fone').value);
  if (fone.length < 10) { alert('Informe um telefone válido.'); return; }
  otpCode = String(Math.floor(100000 + Math.random() * 900000));
  $('#otpBox').style.display = 'block';
  const msg = encodeURIComponent('Seu código de verificação Gelado Açaíteria: ' + otpCode);
  const url = 'https://wa.me/' + fone + '?text=' + msg;
  window.open(url, '_blank');
});

$('#confirmLogin').addEventListener('click', () => {
  const nome = $('#nome').value.trim();
  if (!otpCode) { alert('Clique em "Verificar celular" para receber o código.'); return; }
  if ($('#otp').value !== otpCode) { alert('Código incorreto.'); return; }
  closeModal();
  $('#loginBtn').textContent = 'Olá, ' + nome.split(' ')[0];
  alert('Login confirmado! Bem-vindo(a), ' + nome + '!');
});

// fechar modal com ESC
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Notas de integração real (API WhatsApp / backend) estão nos comentários do código do index.
