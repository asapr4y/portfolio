(() => {
  const root = document.documentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sessionKey = 'ray-portfolio-intro-seen-v2';
  const navigation = window.performance?.getEntriesByType?.('navigation')[0];
  let seen = false;
  try { seen = window.sessionStorage.getItem(sessionKey) === 'true'; } catch { /* Storage is optional. */ }
  if (motion.matches || seen || window.location.hash || navigation?.type === 'back_forward') return;

  // Cover the page before parsing the body; start the timing once the markup exists.
  root.classList.add('intro-active');
  try { window.sessionStorage.setItem(sessionKey, 'true'); } catch { /* Keep working without storage. */ }
  const interactions = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  let finished = false;
  let timeout;

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    root.classList.remove('intro-active', 'intro-ready');
    document.getElementById('site-intro')?.remove();
    interactions.forEach(type => document.removeEventListener(type, finish, true));
    document.removeEventListener('animationend', onAnimationEnd);
    motion.removeEventListener('change', onMotionChange);
    window.removeEventListener('pagehide', finish);
  }
  function onAnimationEnd(event) {
    if (event.target.id === 'site-intro' && event.animationName === 'intro-curtain') finish();
  }
  function onMotionChange() { if (motion.matches) finish(); }
  function start() {
    if (finished) {
      document.getElementById('site-intro')?.remove();
      return;
    }
    root.classList.add('intro-ready');
    // The CSS sequence lasts 3.7 seconds. Allow a little extra time for cleanup.
    timeout = setTimeout(finish, 4400);
  }

  document.addEventListener('animationend', onAnimationEnd);
  interactions.forEach(type => document.addEventListener(type, finish, { capture: true, passive: true }));
  motion.addEventListener('change', onMotionChange);
  window.addEventListener('pagehide', finish);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
