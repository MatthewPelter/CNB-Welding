(() => {
  'use strict';

  // Image fallbacks keep the site usable when optional customer photos are not present.
  document.querySelectorAll('img[data-fallback]').forEach((image) => {
    const useFallback = () => {
      const fallback = image.dataset.fallback;
      if (fallback && !image.src.endsWith(fallback)) image.src = fallback;
    };
    image.addEventListener('error', useFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) useFallback();
  });

  const menuButton = document.getElementById('menu-toggle');
  const nav = document.getElementById('primary-navigation');
  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Open navigation menu');
    nav?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
      nav.classList.toggle('is-open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
    window.matchMedia('(min-width: 861px)').addEventListener('change', closeMenu);
    document.addEventListener('click', (event) => {
      if (!menuButton.contains(event.target) && !nav.contains(event.target)) closeMenu();
    });
  }

  const siteHeader = document.getElementById('site-header');
  const updateHeader = () => siteHeader?.classList.toggle('is-scrolled', window.scrollY > 30);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Reveal effects: content remains visible when JS is disabled or reduced motion is preferred.
  const motionAllowed = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  const revealItems = document.querySelectorAll('[data-reveal]');
  if (motionAllowed && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -45px 0px', threshold: 0.06 });
    revealItems.forEach((item) => revealObserver.observe(item));
    document.documentElement.classList.add('motion-enabled');
  }

  const galleryButtons = [...document.querySelectorAll('[data-gallery-index]')];
  const galleryDialog = document.getElementById('gallery-dialog');
  const dialogImage = document.getElementById('dialog-image');
  const dialogCaption = document.getElementById('dialog-caption');
  const closeDialogButton = document.getElementById('dialog-close');
  let currentIndex = 0;
  let lastTrigger = null;

  function displayPhoto(index) {
    if (!dialogImage || !dialogCaption || galleryButtons.length === 0) return;
    currentIndex = (index + galleryButtons.length) % galleryButtons.length;
    const sourceImage = galleryButtons[currentIndex].querySelector('img');
    dialogImage.src = sourceImage.currentSrc || sourceImage.src;
    dialogImage.alt = sourceImage.alt;
    dialogCaption.textContent = `PROJECT ${String(currentIndex + 1).padStart(2, '0')} / ${String(galleryButtons.length).padStart(2, '0')}`;
  }

  if (galleryDialog && typeof galleryDialog.showModal === 'function') {
    galleryButtons.forEach((button, index) => button.addEventListener('click', () => {
      lastTrigger = button;
      displayPhoto(index);
      galleryDialog.showModal();
    }));
    document.getElementById('dialog-prev')?.addEventListener('click', () => displayPhoto(currentIndex - 1));
    document.getElementById('dialog-next')?.addEventListener('click', () => displayPhoto(currentIndex + 1));
    closeDialogButton?.addEventListener('click', () => galleryDialog.close());
    galleryDialog.addEventListener('click', (event) => {
      if (event.target === galleryDialog) galleryDialog.close();
    });
    galleryDialog.addEventListener('close', () => lastTrigger?.focus());
    galleryDialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); displayPhoto(currentIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); displayPhoto(currentIndex + 1); }
    });
  }

  const copyrightYear = document.getElementById('copyright-year');
  if (copyrightYear) copyrightYear.textContent = String(new Date().getFullYear());
})();
