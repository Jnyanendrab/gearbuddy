const fs = require('fs');
const path = require('path');

const escapeHTML = (str) =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

module.exports = function (eleventyConfig) {
  // Load products data synchronously for shortcodes
  const productsPath = path.join(__dirname, 'src/_data/products.json');
  let products = [];
  try {
    products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  } catch (e) {
    console.warn('Could not load products.json:', e);
  }

  function getProduct(id) {
    return products.find((p) => p.id === id.trim());
  }

  function renderCard(product) {
    if (!product) return '';
    const prosHTML = (product.pros || []).map((p) => `<li>${escapeHTML(p)}</li>`).join('');
    const consHTML = (product.cons || []).map((c) => `<li>${escapeHTML(c)}</li>`).join('');

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
  }

  // Shortcode: single product card
  eleventyConfig.addShortcode('productCard', function (productId) {
    const product = getProduct(productId);
    return renderCard(product);
  });

  // Shortcode: product grid of multiple IDs
  eleventyConfig.addShortcode('productGrid', function (productIds, label = 'Featured product picks') {
    const ids = (typeof productIds === 'string' ? productIds.split(',') : productIds)
      .map((id) => id.trim())
      .filter(Boolean);

    const cards = ids.map(getProduct).filter(Boolean).map(renderCard).join('\n');

    return `
      <div
        id="product-grid"
        class="product-grid"
        data-product-ids="${escapeHTML(ids.join(','))}"
        aria-label="${escapeHTML(label)}"
      >
        ${cards}
      </div>
    `.trim();
  });

  // Shortcode: Amazon CTA button for a product ID
  eleventyConfig.addShortcode('amazonButton', function (productId, customText) {
    const product = getProduct(productId);
    const text = customText || 'Check current price on Amazon';
    const url = product ? product.affiliateUrl : `https://www.amazon.com/s?k=${encodeURIComponent(productId)}`;

    return `<a href="${escapeHTML(url)}" class="cta-button" rel="sponsored nofollow noopener" target="_blank">${escapeHTML(text)}</a>`;
  });

  // Filter: lookup product by ID
  eleventyConfig.addFilter('getProduct', function (id) {
    return getProduct(id);
  });

  // Filter: format date
  eleventyConfig.addFilter('dateIso', function (dateVal) {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? String(dateVal) : d.toISOString().split('T')[0];
  });

  // Passthrough file copies
  eleventyConfig.addPassthroughCopy({ 'src/css': 'css' });
  eleventyConfig.addPassthroughCopy({ 'src/js': 'js' });
  eleventyConfig.addPassthroughCopy({ 'src/fonts': 'fonts' });
  eleventyConfig.addPassthroughCopy({ 'src/images': 'images' });
  eleventyConfig.addPassthroughCopy({ 'src/_headers': '_headers' });

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site'
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', 'html']
  };
};
