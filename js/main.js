/**
 * GearBuddy — main.js
 * Vanilla JS, no frameworks, no external dependencies.
 * Features:
 *   1. Product card renderer (from /data/products.json)
 *   2. Mobile nav toggle
 *   3. FAQ accordion animation
 *   4. Active nav link highlighting
 *   5. Back-to-top button
 */

'use strict';

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */

/**
 * Shorthand for document.querySelector
 * @param {string} selector
 * @param {Element} [scope=document]
 * @returns {Element|null}
 */
const $ = (selector, scope = document) => scope.querySelector(selector);

/**
 * Shorthand for document.querySelectorAll → Array
 * @param {string} selector
 * @param {Element} [scope=document]
 * @returns {Element[]}
 */
const $$ = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

/**
 * Escape HTML to prevent XSS when inserting untrusted data into the DOM.
 * @param {string} str
 * @returns {string}
 */
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
 * @param {Object} product - Product data from products.json
 * @returns {string} HTML string
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
      <img
        src="${escapeHTML(product.image)}"
        alt="${escapeHTML(product.name)}"
        loading="lazy"
        width="280"
        height="180"
      />
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
      <a
        href="${escapeHTML(product.affiliateUrl)}"
        class="cta-button"
        rel="sponsored nofollow noopener"
        target="_blank"
      >
        Check current price on Amazon
      </a>
    </article>
  `.trim();
};

/**
 * Build an HTML string for a single-product detail card (larger layout).
 * @param {Object} product
 * @returns {string}
 */
const buildSingleProductCard = (product) => {
  const prosHTML = (product.pros || [])
    .map((pro) => `<li>${escapeHTML(pro)}</li>`)
    .join('');

  const consHTML = (product.cons || [])
    .map((con) => `<li>${escapeHTML(con)}</li>`)
    .join('');

  return `
    <img
      src="${escapeHTML(product.image)}"
      alt="${escapeHTML(product.name)}"
      loading="lazy"
      width="400"
      height="220"
    />
    <h2>${escapeHTML(product.name)}</h2>
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
    <a
      href="${escapeHTML(product.affiliateUrl)}"
      class="cta-button"
      rel="sponsored nofollow noopener"
      target="_blank"
    >
      Check current price on Amazon
    </a>
  `.trim();
};

/**
 * Fallback message shown if fetch or JSON parsing fails.
 * @returns {string}
 */
const PRODUCT_FALLBACK_HTML = `
  <p class="product-load-error">
    Product information is temporarily unavailable.
    Please <a href="https://www.amazon.com" rel="noopener noreferrer" target="_blank">check Amazon directly</a>.
  </p>
`.trim();

/**
 * Fetch product data once and cache it in a module-level promise.
 * This prevents duplicate network requests if multiple grids are on the page.
 */
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
        // Reset so a future call can retry
        _productDataPromise = null;
        return null; // signal failure without throwing
      });
  }
  return _productDataPromise;
};

/**
 * Render product grid(s) for elements with [data-product-ids].
 * Looks for an #product-grid child or uses the element itself.
 * @param {Object[]} allProducts
 */
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

    // Find or create the grid container
    const grid = $('#product-grid', host) || host;

    if (matched.length === 0) {
      grid.innerHTML = PRODUCT_FALLBACK_HTML;
      return;
    }

    grid.innerHTML = matched.map(buildProductCard).join('');
  });
};

/**
 * Render single-product detail cards for elements with .single-product-card
 * and [data-product-id].
 * @param {Object[]} allProducts
 */
const renderSingleProductCards = (allProducts) => {
  const cards = $$('.single-product-card[data-product-id]');

  cards.forEach((card) => {
    const id = card.dataset.productId?.trim();
    const product = allProducts.find((p) => p.id === id);

    if (!product) {
      card.innerHTML = PRODUCT_FALLBACK_HTML;
      return;
    }

    card.innerHTML = buildSingleProductCard(product);
  });
};

/**
 * Main entry point for the product renderer.
 * Runs only when there are product containers on the current page.
 */
const initProductRenderer = async () => {
  const hasGrids = $$('[data-product-ids]').length > 0;
  const hasSingleCards = $$('.single-product-card[data-product-id]').length > 0;

  if (!hasGrids && !hasSingleCards) return; // nothing to render

  const products = await fetchProducts();

  if (!products) {
    // Fetch failed — show fallback in every container
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
   2. MOBILE NAV TOGGLE
   ========================================================================== */

const initMobileNav = () => {
  const header = $('.site-header');
  if (!header) return;

  const nav = $('#primary-nav', header) || $('nav', header);
  if (!nav) return;

  // Use existing toggle button in HTML or create one if missing
  let toggle = $('.nav-toggle', header);
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'primary-nav');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    toggle.innerHTML = '<span class="hamburger">&#9776;</span>';
    const container = header.querySelector('.container') || header;
    container.appendChild(toggle);
  }

  nav.id = 'primary-nav';
  nav.classList.add('primary-nav');

  /**
   * Open or close the mobile nav.
   * @param {boolean} open
   */
  const setNavOpen = (open) => {
    nav.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  };

  // Toggle on button click
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.contains('nav-open');
    setNavOpen(!isOpen);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('nav-open') && !nav.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
      setNavOpen(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
      setNavOpen(false);
      toggle.focus();
    }
  });

  // Close nav when a nav link is clicked
  $('a', nav).forEach((link) => {
    link.addEventListener('click', () => setNavOpen(false));
  });
};


/* ==========================================================================
   3. FAQ ACCORDION ANIMATION
   ========================================================================== */

const initFaqAccordions = () => {
  const faqDetails = $$('.faq-item details');

  faqDetails.forEach((details) => {
    const summary = $('summary', details);
    const answer = details.querySelector('.faq-answer') || (() => {
      // Wrap content that isn't the summary into .faq-answer if not already wrapped
      const wrapper = document.createElement('div');
      wrapper.className = 'faq-answer';
      Array.from(details.childNodes).forEach((node) => {
        if (node !== summary) wrapper.appendChild(node);
      });
      details.appendChild(wrapper);
      return wrapper;
    })();

    // Smooth height animation via Web Animations API (if supported)
    const animateHeight = (from, to, onComplete) => {
      if (!answer.animate) {
        // Fallback: no animation
        onComplete?.();
        return;
      }
      answer.animate(
        [{ height: `${from}px`, overflow: 'hidden' }, { height: `${to}px`, overflow: 'hidden' }],
        { duration: 220, easing: 'ease', fill: 'both' }
      ).onfinish = () => {
        answer.style.height = '';
        answer.style.overflow = '';
        onComplete?.();
      };
    };

    summary.addEventListener('click', (e) => {
      e.preventDefault();

      if (details.open) {
        // Closing
        const startHeight = answer.scrollHeight;
        animateHeight(startHeight, 0, () => {
          details.open = false;
        });
      } else {
        // Opening
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
  const navLinks = $('.nav-list a');

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
   5. BACK TO TOP
   ========================================================================== */

const initBackToTop = () => {
  // Create the button
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&#8679;'; // ↑ arrow
  document.body.appendChild(btn);

  // Show/hide based on scroll position
  const SCROLL_THRESHOLD = 400;

  const handleScroll = () => {
    const shouldShow = window.scrollY > SCROLL_THRESHOLD;
    btn.classList.toggle('visible', shouldShow);
  };

  // Use passive listener for performance
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Smooth scroll to top on click
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};


/* ==========================================================================
   INIT — DOMContentLoaded
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Product cards (async, non-blocking)
  initProductRenderer();

  // 2. Mobile nav
  initMobileNav();

  // 3. FAQ accordions
  initFaqAccordions();

  // 4. Active nav link
  initActiveNavLink();

  // 5. Back to top button
  initBackToTop();
});
