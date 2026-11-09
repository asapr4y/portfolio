(() => {
  const root = document.documentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sessionKey = 'ray-portfolio-intro-seen';
  const navigation = window.performance?.getEntriesByType?.('navigation')[0];
  let seen = false;
  try { seen = window.sessionStorage.getItem(sessionKey) === 'true'; } catch { /* Storage is optional. */ }
  if (motion.matches || seen || window.location.hash || navigation?.type === 'back_forward') return;

  // Runs before the body is parsed, so the page never flashes behind the intro.
  root.classList.add('intro-active');
  try { window.sessionStorage.setItem(sessionKey, 'true'); } catch { /* Keep working without storage. */ }
  const interactions = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
  let finished = false;
  let timeout;

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timeout);
    root.classList.remove('intro-active');
    document.getElementById('site-intro')?.remove();
    interactions.forEach(type => document.removeEventListener(type, finish, true));
    document.removeEventListener('animationend', onAnimationEnd);
    motion.removeEventListener('change', onMotionChange);
    window.removeEventListener('pagehide', finish);
  }
  function onAnimationEnd(event) {
    if (event.animationName === 'intro-curtain') finish();
  }
  function onMotionChange() { if (motion.matches) finish(); }

  document.addEventListener('animationend', onAnimationEnd);
  interactions.forEach(type => document.addEventListener(type, finish, { capture: true, passive: true }));
  motion.addEventListener('change', onMotionChange);
  window.addEventListener('pagehide', finish);
  // CSS also hides the curtain on completion; this is a final cleanup fallback.
  timeout = setTimeout(finish, 2200);
  document.addEventListener('DOMContentLoaded', () => {
    if (finished) document.getElementById('site-intro')?.remove();
  }, { once: true });
})();
