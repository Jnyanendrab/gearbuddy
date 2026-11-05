/**
 * GearBuddy — main.js
 * Vanilla JS, no frameworks, zero dependencies.
 * Features:
 *   1. Product card renderer (from /data/products.json)
 *   2. Mobile-first nav drawer with focus trap, outside-tap & Escape key handling
 *   3. Accessible FAQ accordion animations
 *   4. Active nav link highlighting
 *   5. Mobile-friendly Back-to-Top button
 */

'use strict';

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const escapeHTML = (str) =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/* ==========================================================================
   1. PRODUCT CARD RENDERER
   ========================================================================== */

/**
 * Build an HTML string for a single product card.
 * Responsive: stacked on mobile, 2-column from 640px up.
 */
const buildProductCard = (product) => {
  const prosHTML = (product.pros || [])
    .map((pro) => `<li>${escapeHTML(pro)}</li>`)
    .join('');

  const consHTML = (product.cons || [])
    .map((con) => `<li>${escapeHTML(con)}</li>`)
    .join('');

  return `
    <article class="product-card" data-product-id="${escapeHTML(product.id)}">
      <div class="product-card-media">
        <img
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          decoding="async"
          width="200"
          height="140"
        />
      </div>
      <div class="product-card-body">
        <h3>${escapeHTML(product.name)}</h3>
        <p class="best-for">Best for: ${escapeHTML(product.bestFor)}</p>
        <div class="pros-cons">
          <div>
            <h4>Pros</h4>
            <ul class="pros-list">${prosHTML}</ul>
          </div>
          <div>
            <h4>Cons</h4>
            <ul class="cons-list">${consHTML}</ul>
          </div>
        </div>
        <div class="product-card-actions">
          <a
            href="${escapeHTML(product.affiliateUrl)}"
            class="cta-button"
            rel="sponsored nofollow noopener"
            target="_blank"
          >
            Check current price on Amazon
          </a>
        </div>
      </div>
    </article>
  `.trim();
};

/**
 * Fallback message if fetch fails.
 */
const PRODUCT_FALLBACK_HTML = `
  <p class="product-load-error">
    Product information is temporarily unavailable.
    Please <a href="https://www.amazon.com" rel="noopener noreferrer" target="_blank">check Amazon directly</a>.
  </p>
`.trim();

let _productDataPromise = null;

const fetchProducts = () => {
  if (!_productDataPromise) {
    _productDataPromise = fetch('/data/products.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .catch((err) => {
        console.warn('[GearBuddy] Could not load products.json:', err);
        _productDataPromise = null;
        return null;
      });
  }
  return _productDataPromise;
};

const renderProductGrids = (allProducts) => {
  const gridHosts = $$('[data-product-ids]');

  gridHosts.forEach((host) => {
    const ids = host.dataset.productIds
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);

    const matched = ids
      .map((id) => allProducts.find((p) => p.id === id))
      .filter(Boolean);

    const grid = $('#product-grid', host) || host;

    if (matched.length === 0) {
      grid.innerHTML = PRODUCT_FALLBACK_HTML;
      return;
    }

    grid.innerHTML = matched.map(buildProductCard).join('');
  });
};

const renderSingleProductCards = (allProducts) => {
  const cards = $$('.single-product-card[data-product-id]');

  cards.forEach((card) => {
    const id = card.dataset.productId?.trim();
    const product = allProducts.find((p) => p.id === id);

    if (!product) {
      card.innerHTML = PRODUCT_FALLBACK_HTML;
      return;
    }

    card.innerHTML = buildProductCard(product);
  });
};

const initProductRenderer = async () => {
  const hasGrids = $$('[data-product-ids]').length > 0;
  const hasSingleCards = $$('.single-product-card[data-product-id]').length > 0;

  if (!hasGrids && !hasSingleCards) return;

  const products = await fetchProducts();

  if (!products) {
    $$('[data-product-ids]').forEach((host) => {
      const grid = $('#product-grid', host) || host;
      grid.innerHTML = PRODUCT_FALLBACK_HTML;
    });
    $$('.single-product-card[data-product-id]').forEach((card) => {
      card.innerHTML = PRODUCT_FALLBACK_HTML;
    });
    return;
  }

  if (hasGrids) renderProductGrids(products);
  if (hasSingleCards) renderSingleProductCards(products);
};

/* ==========================================================================
   2. MOBILE NAV DRAWER (WITH FOCUS TRAP & ACCESSIBILITY)
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
      // Focus first link in drawer
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
   3. ACCESSIBLE FAQ ACCORDIONS
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
   4. ACTIVE NAV LINK
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
   5. BACK TO TOP (TOUCH-OPTIMIZED)
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
   INIT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initProductRenderer();
  initMobileNav();
  initFaqAccordions();
  initActiveNavLink();
  initBackToTop();
});
