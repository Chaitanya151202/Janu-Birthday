// ── Auth guard ──
if (!sessionStorage.getItem('pinky_auth')) {
  window.location.href = 'index.html';
}

// ══════════════════════════════
// PARTICLE CANVAS
// ══════════════════════════════
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.r = Math.random() * 2.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.5 + 0.15);
    this.a = Math.random() * 0.5 + 0.15;
    this.hue = 310 + Math.random() * 50;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.a -= 0.0015;
    if (this.a <= 0 || this.y < -5) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.a;
    ctx.shadowBlur = 8; ctx.shadowColor = `hsl(${this.hue},100%,70%)`;
    ctx.fillStyle = `hsl(${this.hue},100%,72%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const particles = Array.from({ length: 90 }, () => new Particle());
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ══════════════════════════════
// FLOATING EMOJIS
// ══════════════════════════════
const floatContainer = document.getElementById('floatContainer');
const floatEmojis = ['🎂', '🎉', '🎈', '💕', '🌸', '✨', '💖', '🎁', '🎊', '💗', '⭐', '🌺', '🎀'];

function spawnFloat() {
  const el = document.createElement('div');
  el.className = 'float-em';
  el.textContent = floatEmojis[Math.floor(Math.random() * floatEmojis.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (13 + Math.random() * 18) + 'px';
  const dur = 9 + Math.random() * 11;
  el.style.animationDuration = dur + 's';
  el.style.opacity = 0.1 + Math.random() * 0.25;
  floatContainer.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000 + 500);
}
spawnFloat();
setInterval(spawnFloat, 700);

// ══════════════════════════════
// DAYS COUNTER
// ══════════════════════════════
function getDaysTogether() {
  const start = new Date();
  start.setFullYear(start.getFullYear() - 5);
  start.setMonth(start.getMonth() - 6);
  return Math.floor((new Date() - start) / 86400000);
}

function animCount(el, target, dur = 2000) {
  const t0 = performance.now();
  function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const days = getDaysTogether();
const daysEl = document.getElementById('daysCount');
if (daysEl) {
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animCount(daysEl, days, 2200);
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  obs.observe(daysEl.closest('.bday-stats-col') || document.body);
}

// ══════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════
document.querySelectorAll('.section-header, .bday-spotlight, .bday-msg-card, .thennow-grid, .gallery-grid, .candle-stage, .letter-card, .reasons-grid')
  .forEach(el => el.classList.add('reveal'));

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ══════════════════════════════
// GALLERY LIGHTBOX
// ══════════════════════════════
document.querySelectorAll('.gal-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const cap = item.dataset.caption || '';
    document.getElementById('lbImg').src = img.src;
    document.getElementById('lbCap').textContent = cap;
    document.getElementById('lightbox').classList.add('open');
  });
});

function closeLB() {
  document.getElementById('lightbox').classList.remove('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

// ══════════════════════════════
// CANDLES
// ══════════════════════════════
const candlesLine = document.getElementById('candlesLine');
const N_CANDLES = 7;
let blown = false;

for (let i = 0; i < N_CANDLES; i++) {
  const wrap = document.createElement('div');
  wrap.className = 'candle-wrap';
  wrap.innerHTML = `<div class="c-flame" id="fl${i}"></div><div class="c-body"></div>`;
  candlesLine.appendChild(wrap);
}

function blowAll() {
  if (blown) return;
  blown = true;
  const btn = document.getElementById('blowBtn');
  btn.disabled = true;
  btn.textContent = '🎉 Wish Sent to the Stars!';

  for (let i = 0; i < N_CANDLES; i++) {
    setTimeout(() => {
      document.getElementById('fl' + i)?.classList.add('out');
    }, i * 160);
  }

  setTimeout(() => {
    document.getElementById('wishReveal').classList.add('show');
    launchConfetti();
  }, N_CANDLES * 160 + 500);
}

function launchConfetti() {
  const cols = ['#ff1493','#ff69b4','#ffb6c1','#ffd700','#c71585','#fff0f5','#ff85b0'];
  for (let i = 0; i < 160; i++) {
    const p = document.createElement('div');
    const size = 5 + Math.random() * 9;
    p.style.cssText = `
      position:fixed; top:-20px;
      left:${Math.random()*100}vw;
      width:${size}px; height:${size}px;
      background:${cols[Math.floor(Math.random()*cols.length)]};
      border-radius:${Math.random()>0.5?'50%':'3px'};
      animation: confettiFall ${2+Math.random()*2}s ease-in forwards;
      animation-delay:${Math.random()*1.5}s;
      z-index:9998; pointer-events:none;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 5000);
  }
}

// ══════════════════════════════
// CURSOR TRAIL
// ══════════════════════════════
const trailEmojis = ['💕', '🌸', '✨', '💗'];
document.addEventListener('mousemove', e => {
  if (Math.random() < 0.12) {
    const t = document.createElement('div');
    t.textContent = trailEmojis[Math.floor(Math.random() * trailEmojis.length)];
    t.style.cssText = `
      position:fixed; left:${e.clientX}px; top:${e.clientY}px;
      font-size:${10+Math.random()*12}px;
      pointer-events:none; z-index:9997;
      animation: trailFade 0.8s ease forwards;
      transform:translate(-50%,-50%);
    `;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 800);
  }
});

// ══════════════════════════════
// DYNAMIC NAME CYCLE
// ══════════════════════════════
const nameEl = document.getElementById('dynamicName');
const names = ['My Pinky 🌸', 'Birthday Queen 👑', 'My Everything ✨', 'My Forever 💗', 'My Love 💕'];
let nameIdx = 0;
if (nameEl) {
  nameEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  setInterval(() => {
    nameIdx = (nameIdx + 1) % names.length;
    nameEl.style.opacity = '0';
    nameEl.style.transform = 'translateY(16px)';
    setTimeout(() => {
      nameEl.textContent = names[nameIdx];
      nameEl.style.opacity = '1';
      nameEl.style.transform = 'translateY(0)';
    }, 500);
  }, 3500);
}

// ══════════════════════════════
// INJECT KEYFRAME STYLES
// ══════════════════════════════
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes trailFade {
    0%   { opacity:1; transform:translate(-50%,-50%) scale(1); }
    100% { opacity:0; transform:translate(-50%,-160%) scale(0.3); }
  }
  @keyframes confettiFall {
    0%   { transform:translateY(0) rotate(0deg); opacity:1; }
    100% { transform:translateY(110vh) rotate(720deg); opacity:0; }
  }
`;
document.head.appendChild(styleEl);

// ══════════════════════════════
// PAGE FADE IN
// ══════════════════════════════
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.8s ease';
setTimeout(() => document.body.style.opacity = '1', 100);
