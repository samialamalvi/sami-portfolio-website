// ---------- Theme toggle (light / dark, remembered per browser) ----------
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'theme-preference';

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function storeTheme(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* storage unavailable — theme just won't persist */
    }
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // Resolve the theme to actually show on load.
  let current = getStoredTheme() || (systemPrefersDark() ? 'dark' : 'light');
  root.setAttribute('data-theme', current);

  if (toggle) {
    toggle.addEventListener('click', function () {
      current = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', current);
      storeTheme(current);
    });
  }
})();

// ---------- Scroll reveal for sections ----------
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    // No IO support — just show everything.
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) { observer.observe(el); });
})();

// ---------- Active nav link while scrolling ----------
(function () {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const linkFor = {};
  navLinks.forEach(function (link) {
    const id = link.getAttribute('href').replace('#', '');
    linkFor[id] = link;
  });

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        const id = entry.target.getAttribute('id');
        const link = linkFor[id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    },
    { threshold: 0, rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach(function (s) { observer.observe(s); });
})();
