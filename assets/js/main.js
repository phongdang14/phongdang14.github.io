/* ---------- Year ---------- */
document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

/* ---------- Google Scholar metrics ---------- */
const scholarMetrics = document.querySelector('[data-scholar-stat]');
if (scholarMetrics) {
  fetch(`assets/data/scholar-stats.json?v=${new Date().toISOString().slice(0, 10)}`)
    .then(response => {
      if (!response.ok) throw new Error('Metrics unavailable');
      return response.json();
    })
    .then(stats => {
      document.querySelectorAll('[data-scholar-stat]').forEach(el => {
        const value = stats[el.dataset.scholarStat];
        if (Number.isFinite(value)) el.textContent = value.toLocaleString('en-US');
      });
      const updated = document.querySelector('[data-scholar-updated]');
      if (updated && stats.updated_at) {
        updated.textContent = new Date(`${stats.updated_at}T12:00:00`).toLocaleDateString('en-US', {
          day: 'numeric', month: 'short', year: 'numeric'
        });
      }
    })
    .catch(() => {});
}

/* ---------- Theme toggle ---------- */
const root = document.documentElement;
const stored = localStorage.getItem('theme');
if (stored) root.setAttribute('data-theme', stored);
document.getElementById('themeToggle').addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const links = document.querySelector('.nav__links');
burger.addEventListener('click', () => links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

/* ---------- Orbital particle field ---------- */
(function orbits() {
  const canvas = document.getElementById('orbits');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, nodes, raf;

  const COUNT = 46;
  const LINK_DIST = 130;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function seed() {
    nodes = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.8 + 1
    }));
  }

  function accent() {
    // pull the cyan accent from CSS so it tracks the theme
    return getComputedStyle(root).getPropertyValue('--accent-2').trim() || '#22d3ee';
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const col = accent();
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const dx = n.x - m.x, dy = n.y - m.y;
        const d = Math.hypot(dx, dy);
        if (d < LINK_DIST) {
          ctx.globalAlpha = (1 - d / LINK_DIST) * .27;
          ctx.strokeStyle = col; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
        }
      }
      ctx.globalAlpha = .55;
      ctx.fillStyle = col;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  }

  function start() { resize(); seed(); cancelAnimationFrame(raf); draw(); }
  window.addEventListener('resize', () => { resize(); seed(); });
  start();
})();
