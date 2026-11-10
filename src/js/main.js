/**
 * GearBuddy — main.js
 * Vanilla JS, no frameworks, zero dependencies.
 * Features:
 *   1. Mobile-first nav drawer with focus trap, outside-tap & Escape key handling
 *   2. Accessible FAQ accordion animations
 *   3. Active nav link highlighting
 *   4. Mobile-friendly Back-to-Top button
 */

'use strict';

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/* ==========================================================================
   1. MOBILE NAV DRAWER (WITH FOCUS TRAP & ACCESSIBILITY)
   ========================================================================== */

const initMobileNav = () => {
  const header = $('.site-header');
  if (!header) return;

  const nav = $('#primary-nav', header) || $('nav', header);
  if (!nav) return;

  let toggle = $('.nav-toggle', header);
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'primary-nav');
    toggle.setAttribute('aria-label', 'Toggle navigation menu');
    toggle.textContent = 'Menu';
    const container = header.querySelector('.container') || header;
    container.appendChild(toggle);
  }

  nav.id = 'primary-nav';
  nav.classList.add('primary-nav');

  const getFocusableElements = () => {
    return [toggle, ...$$('a[href], button:not([disabled])', nav)];
  };

  const setNavOpen = (open) => {
    nav.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    toggle.textContent = open ? 'Close' : 'Menu';

    if (open) {
      const firstLink = $('a', nav);
      if (firstLink) firstLink.focus();
    } else {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.contains('nav-open');
    setNavOpen(!isOpen);
  });

  // Close on outside tap/click
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav-open') && !nav.contains(e.target) && e.target !== toggle) {
      setNavOpen(false);
    }
  });

  // Close on Escape key & Focus trap
  document.addEventListener('keydown', (e) => {
    if (!nav.classList.contains('nav-open')) return;

    if (e.key === 'Escape') {
      setNavOpen(false);
      return;
    }

    if (e.key === 'Tab') {
      const focusables = getFocusableElements();
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Close nav when a nav link is tapped
  $$('a', nav).forEach((link) => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('nav-open')) {
        setNavOpen(false);
      }
    });
  });
};

/* ==========================================================================
   2. ACCESSIBLE FAQ ACCORDIONS
   ========================================================================== */

const initFaqAccordions = () => {
  const faqDetails = $$('.faq-item details, details.faq-item');

  faqDetails.forEach((details) => {
    const summary = $('summary', details);
    if (!summary) return;

    let answer = details.querySelector('.faq-answer');
    if (!answer) {
      const wrapper = document.createElement('div');
      wrapper.className = 'faq-answer';
      Array.from(details.childNodes).forEach((node) => {
        if (node !== summary) wrapper.appendChild(node);
      });
      details.appendChild(wrapper);
      answer = wrapper;
    }

    const animateHeight = (from, to, onComplete) => {
      if (!answer.animate) {
        onComplete?.();
        return;
      }

      answer.style.overflow = 'hidden';
      const anim = answer.animate(
        [
          { height: `${from}px`, opacity: from === 0 ? 0 : 1 },
          { height: `${to}px`, opacity: to === 0 ? 0 : 1 }
        ],
        { duration: 160, easing: 'ease-out' }
      );

      anim.onfinish = () => {
        answer.style.overflow = '';
        onComplete?.();
      };
    };

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      if (details.open) {
        const startHeight = answer.scrollHeight;
        animateHeight(startHeight, 0, () => {
          details.open = false;
        });
      } else {
        details.open = true;
        const endHeight = answer.scrollHeight;
        animateHeight(0, endHeight);
      }
    });
  });
};

/* ==========================================================================
   3. ACTIVE NAV LINK
   ========================================================================== */

const initActiveNavLink = () => {
  const path = window.location.pathname;
  const navLinks = $$('.nav-list a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    let isActive = false;
    if (href === path) {
      isActive = true;
    } else if (href === '/' && (path === '' || path === '/' || path === '/index.html')) {
      isActive = true;
    } else if (href.startsWith('/guides/') && path.startsWith('/guides/')) {
      isActive = true;
    } else if (href.startsWith('/deals/') && path.startsWith('/deals/')) {
      isActive = true;
    } else if (href.startsWith('/about') && path.startsWith('/about')) {
      isActive = true;
    }

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

/* ==========================================================================
   4. BACK TO TOP (TOUCH-OPTIMIZED)
   ========================================================================== */

const initBackToTop = () => {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = 'Back to top';
  document.body.appendChild(btn);

  const SCROLL_THRESHOLD = 450;

  const handleScroll = () => {
    const shouldShow = window.scrollY > SCROLL_THRESHOLD;
    btn.classList.toggle('visible', shouldShow);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

/* ==========================================================================
   5. CONTACT FORM SUCCESS BANNER
   ========================================================================== */

const initContactSuccessBanner = () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true') {
    const msg = document.getElementById('success-message');
    if (msg) {
      msg.classList.add('visible');
      msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (window.history && window.history.replaceState) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }
};

/* ==========================================================================
   INIT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqAccordions();
  initActiveNavLink();
  initBackToTop();
  initContactSuccessBanner();
});
