/* ═══════════════════════════════════════════════════════
   NEOBIOME RESEARCH — script.js
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     1. STICKY NAV — add .scrolled on scroll
  ────────────────────────────────────────── */
  const nav = document.getElementById('site-nav');

  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // run immediately on load


  /* ──────────────────────────────────────────
     2. MOBILE HAMBURGER TOGGLE
  ────────────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    // Close menu when any nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        navToggle.focus();
      }
    });
  }


  /* ──────────────────────────────────────────
     3. SMOOTH SCROLL for anchor links
        (supplements CSS scroll-behavior for
         browsers that need JS handling)
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      // Account for fixed nav height
      const navHeight = nav ? nav.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ──────────────────────────────────────────
     4. CONSENT GATE — enable booking button
        when participant confirms checkbox
  ────────────────────────────────────────── */
  const checkbox  = document.getElementById('consent-checkbox');
  const bookingBtn = document.getElementById('booking-btn');

  if (checkbox && bookingBtn) {

    // Guard: prevent navigation when disabled
    bookingBtn.addEventListener('click', function (e) {
      if (bookingBtn.getAttribute('aria-disabled') === 'true') {
        e.preventDefault();
      }
    });

    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        bookingBtn.setAttribute('aria-disabled', 'false');
        bookingBtn.removeAttribute('tabindex');
        bookingBtn.focus({ preventScroll: true });
      } else {
        bookingBtn.setAttribute('aria-disabled', 'true');
        bookingBtn.setAttribute('tabindex', '-1');
      }
    });
  }


  /* ──────────────────────────────────────────
     5. FAQ ACCORDION
  ────────────────────────────────────────── */
  const faqButtons = document.querySelectorAll('.faq-q');

  faqButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      // Close all other items first
      faqButtons.forEach(function (other) {
        if (other === btn) return;
        other.setAttribute('aria-expanded', 'false');
        var otherAnswer = other.nextElementSibling;
        if (otherAnswer) otherAnswer.hidden = true;
      });

      // Toggle this item
      btn.setAttribute('aria-expanded', String(!isOpen));
      if (answer) answer.hidden = isOpen;
    });

    // Keyboard: Space and Enter both trigger click (native for <button>)
  });


  /* ──────────────────────────────────────────
     6. INTEREST — show/hide "Other" text input
  ────────────────────────────────────────── */
  const otherCheck = document.getElementById('interest-other-check');
  const otherText  = document.getElementById('interest-other-text');

  if (otherCheck && otherText) {
    otherCheck.addEventListener('change', function () {
      otherText.hidden = !otherCheck.checked;
      if (otherCheck.checked) otherText.focus();
    });
  }


  /* ──────────────────────────────────────────
     7. STAY INFORMED — toggle + Formspree submit
  ────────────────────────────────────────── */
  const eoiToggle   = document.getElementById('eoi-toggle');
  const eoiCollapse = document.getElementById('eoi-collapse');
  const eoiForm     = document.getElementById('eoi-form');
  const eoiStatus   = document.getElementById('eoi-status');
  const eoiSubmit   = document.getElementById('eoi-submit');

  // Toggle open/close
  if (eoiToggle && eoiCollapse) {
    eoiToggle.addEventListener('click', function () {
      const isOpen = eoiCollapse.classList.toggle('open');
      eoiToggle.setAttribute('aria-expanded', String(isOpen));
      eoiCollapse.setAttribute('aria-hidden', String(!isOpen));
      if (isOpen) {
        // Focus first field when opening
        const first = eoiCollapse.querySelector('input, textarea');
        if (first) setTimeout(function () { first.focus(); }, 420);
      }
    });
  }

  // AJAX submit
  if (eoiForm && eoiStatus) {
    eoiForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      eoiSubmit.disabled = true;
      eoiSubmit.textContent = 'Sending…';

      try {
        const response = await fetch(eoiForm.action, {
          method: 'POST',
          body: new FormData(eoiForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          eoiForm.reset();
          eoiStatus.textContent = 'Thank you — we\'ll be in touch when there\'s something worth sharing.';
          eoiStatus.className = 'eoi-status success';
          eoiStatus.hidden = false;
          eoiSubmit.hidden = true;
        } else {
          throw new Error('server error');
        }
      } catch {
        eoiStatus.textContent = 'Something went wrong. Please try again or email research@neobio.me directly.';
        eoiStatus.className = 'eoi-status error';
        eoiStatus.hidden = false;
        eoiSubmit.disabled = false;
        eoiSubmit.textContent = 'Send my details';
      }
    });
  }


})();
