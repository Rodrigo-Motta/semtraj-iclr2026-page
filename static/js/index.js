window.HELP_IMPROVE_VIDEOJS = false;

// Copy BibTeX to clipboard
function copyBibTeX() {
  const bibtexElement = document.getElementById('bibtex-code');
  const button = document.querySelector('.copy-bibtex-btn');
  const copyText = button.querySelector('.copy-text');
  if (bibtexElement) {
    navigator.clipboard.writeText(bibtexElement.textContent).then(function () {
      button.classList.add('copied');
      copyText.textContent = 'Copied!';
      setTimeout(function () {
        button.classList.remove('copied');
        copyText.textContent = 'Copy';
      }, 2000);
    }).catch(function () {
      const textArea = document.createElement('textarea');
      textArea.value = bibtexElement.textContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      button.classList.add('copied');
      copyText.textContent = 'Copied!';
      setTimeout(function () {
        button.classList.remove('copied');
        copyText.textContent = 'Copy';
      }, 2000);
    });
  }
}

// Scroll to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', function () {
  const scrollButton = document.querySelector('.scroll-to-top');
  if (scrollButton) {
    scrollButton.classList.toggle('visible', window.pageYOffset > 300);
  }
});

// ── Intersection Observer for fade-in animations ──
document.addEventListener('DOMContentLoaded', function () {
  // Animate sections on scroll
  const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Trigger SVG animations inside
        entry.target.querySelectorAll('.anim-trigger').forEach(el => {
          el.classList.add('animate');
        });
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-section').forEach(el => fadeObserver.observe(el));

  // Staggered card reveals
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.stagger-card');
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('is-visible'), i * 150);
        });
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stagger-container').forEach(el => cardObserver.observe(el));

  // ── Floating particle canvas on hero ──
  initHeroCanvas();

  // ── Carousel ──
  if (typeof bulmaCarousel !== 'undefined') {
    bulmaCarousel.attach('.carousel', {
      slidesToScroll: 1, slidesToShow: 1,
      loop: true, infinite: true, autoplay: true, autoplaySpeed: 5000
    });
  }
  if (typeof bulmaSlider !== 'undefined') bulmaSlider.attach();

  // ── Counter animation ──
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.counter-group').forEach(el => counterObserver.observe(el));
});

function animateCounters(container) {
  container.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const isFloat = target % 1 !== 0;
    const duration = 1500;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      el.textContent = isFloat ? current.toFixed(2) : Math.round(current);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

// ── Hero floating trajectory canvas ──
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth * 2;
    canvas.height = canvas.parentElement.offsetHeight * 2;
  }
  resize();
  window.addEventListener('resize', resize);

  const palette = ['#58a6ff', '#e8c547', '#5ae682', '#e07aff', '#ff6b7a'];
  const N = 60;
  const pts = [];
  for (let i = 0; i < N; i++) {
    pts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 2 + 1,
      color: palette[Math.floor(Math.random() * palette.length)]
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(88,166,255,${0.06 * (1 - dist / 180)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.35;
      ctx.fill();
      ctx.globalAlpha = 1;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }
    requestAnimationFrame(draw);
  }
  draw();
}
