(() => {
  const dialog = document.getElementById('tyrant-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const title = document.getElementById('tyrant-modal-title');
  const body = dialog.querySelector('.project-modal-body');
  const closeButton = dialog.querySelector('.project-modal-close');
  let opener = null;
  let pressedBackdrop = false;

  document.querySelectorAll('[data-project-open]').forEach(button => {
    button.addEventListener('click', () => {
      if (dialog.open) return;
      opener = button;
      dialog.showModal(); // Native focus containment and inert background.
      document.body.classList.add('project-modal-open');
      body.scrollTop = 0;
      title.focus({ preventScroll: true });
    });
  });

  closeButton.addEventListener('click', () => dialog.close());
  // Escape uses the dialog's native cancel behavior.
  dialog.addEventListener('close', () => {
    document.body.classList.remove('project-modal-open');
    pressedBackdrop = false;
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
  });

  function outside(event) {
    if (event.target !== dialog) return false;
    const bounds = dialog.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
  }
  dialog.addEventListener('pointerdown', event => { pressedBackdrop = outside(event); });
  dialog.addEventListener('pointercancel', () => { pressedBackdrop = false; });
  dialog.addEventListener('click', event => {
    // A drag that starts inside the dialog must not dismiss it.
    if (pressedBackdrop && outside(event)) dialog.close();
    pressedBackdrop = false;
  });

  const preview = document.getElementById('tyrant-preview');
  const previewLink = document.getElementById('tyrant-preview-link');
  const thumbs = dialog.querySelectorAll('.project-thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      preview.src = thumb.getAttribute('href');
      preview.alt = thumb.dataset.alt;
      preview.width = Number(thumb.dataset.width);
      preview.height = Number(thumb.dataset.height);
      previewLink.href = thumb.getAttribute('href');
      previewLink.setAttribute('aria-label', 'Open the Tyrant AIM ' + thumb.dataset.title + ' screenshot at full size (opens in a new tab)');
      thumbs.forEach(item => item.removeAttribute('aria-current'));
      thumb.setAttribute('aria-current', 'true');
    });
  });
})();
