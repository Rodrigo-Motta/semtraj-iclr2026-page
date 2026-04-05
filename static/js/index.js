/* ═══════════════════════════════════════════
   Semantic Trajectories — Page Scripts
   ═══════════════════════════════════════════ */

// ── Copy BibTeX ──
function copyBibTeX() {
  const el = document.getElementById('bibtex-code');
  const btn = document.querySelector('.copy-btn');
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    btn.classList.add('copied');
    btn.innerHTML = '✓ Copied';
    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = '⎘ Copy'; }, 2000);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = el.textContent;
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.classList.add('copied');
    btn.innerHTML = '✓ Copied';
    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = '⎘ Copy'; }, 2000);
  });
}

// ── Scroll to top ──
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
window.addEventListener('scroll', () => {
  const btn = document.querySelector('.scroll-to-top');
  if (btn) btn.classList.toggle('visible', window.pageYOffset > 400);
});

// ── Intersection observers ──
document.addEventListener('DOMContentLoaded', () => {
  // Fade sections
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.fade-section').forEach(el => fadeObs.observe(el));

  // Stagger cards
  const cardObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.stagger-card').forEach((c, i) => {
          setTimeout(() => c.classList.add('is-visible'), i * 140);
        });
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.stagger-container').forEach(el => cardObs.observe(el));

  // Init canvas
  initHeroCanvas();
});

// ── Floating particle canvas ──
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;

  // Cancel previous animation
  if (canvas._animId) cancelAnimationFrame(canvas._animId);

  canvas.width = parent.offsetWidth * 2;
  canvas.height = parent.offsetHeight * 2;

  const palette = ['#2563eb', '#b8941f', '#16a34a', '#9333ea', '#dc2626'];
  const lineColor = [40,60,120];
  const lineAlpha = 0.05;
  const dotAlpha = 0.3;

  const N = 65;
  const pts = [];
  for (let i = 0; i < N; i++) {
    pts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      r: Math.random() * 2 + 1,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 190) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${lineColor[0]},${lineColor[1]},${lineColor[2]},${lineAlpha * (1 - dist/190)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = dotAlpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }
    canvas._animId = requestAnimationFrame(draw);
  }
  draw();
}

window.addEventListener('resize', () => {
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    canvas.width = canvas.parentElement.offsetWidth * 2;
    canvas.height = canvas.parentElement.offsetHeight * 2;
  }
});
