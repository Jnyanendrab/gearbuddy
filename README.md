# GearBuddy — Desk Setup Affiliate Review Site

## Overview

GearBuddy is a fast, lightweight affiliate review site focused on desk setup gear: ergonomic mice, monitor light bars, low-profile mechanical keyboards, GaN chargers, power banks, dual monitor arms, USB hubs, and cable management accessories.

**Tech stack:** [Eleventy (11ty)](https://www.11ty.dev/) static site generator with Nunjucks templates and Markdown source files. Content is manageable directly via [Pages CMS](https://pagescms.org) or standard Git workflows. Build produces zero-dependency static HTML/CSS/JS.

**Deployment target:** [Cloudflare Pages](https://pages.cloudflare.com/) — global CDN, automated Git-based builds, automatic HTTPS, and asset caching.

**Domain:** `gearbuddy.shop`

---

## Local Development

Prerequisites: Node.js 22+ and npm.

### 1. Install dependencies
```bash
npm install
```

### 2. Build for production
```bash
npm run build
```
This compiles Markdown and Nunjucks templates from `src/` into the `_site/` output folder with all static assets (CSS, JS, fonts, images, `_headers`).

### 3. Local development server
```bash
npm start
# or: npx @11ty/eleventy --serve
```
Spins up a local server with live-reloading at `http://localhost:8080`.

---

## Content Management with Pages CMS

The site is configured for [Pages CMS](https://pagescms.org) via `.pages.yml` at the repository root.

When connected to your GitHub repository, Pages CMS provides dedicated visual editors for:

1. **Products (`src/_data/products.json`):**
   - Manage all 10 products centrally.
   - Fields: `id`, `name`, `category`, `tagline`, `image`, `bestFor`, `pros`, `cons`, `specs`, and `affiliateUrl`.
   - Updating any product link, name, or spec updates all guides, grids, and CTA buttons sitewide at build time.

2. **Site Settings (`src/_data/site.json`):**
   - Global site title, description, tagline, canonical URL, contact email, and affiliate disclosure.

3. **Guides Collection (`src/guides/*.md`):**
   - Edit markdown content, headlines, titles, meta descriptions, permalinks, lastReviewed dates, and table of contents.
   - Embed dynamic product cards using `{% productGrid "product-id-1,product-id-2" %}` or direct CTA buttons using `{% amazonButton "product-id" %}`.

4. **Deals Hub (`src/deals/black-friday-desk.md`):**
   - Manage Black Friday deals, shopping tips, and the real-time deal updates list (date, text, optional product links).

5. **Standard Pages Collection (`src/about.md`, `src/contact.md`, `src/legal.md`):**
   - Edit about page credentials/methodology, contact page copy, and legal/privacy/disclosure terms.

6. **Media Management (`src/images`):**
   - Upload and manage product photography and SVG diagrams.

---

## Cloudflare Pages Configuration

Configure your Cloudflare Pages project with these settings:

| Setting | Value |
|---|---|
| **Framework preset** | `None` (or `Eleventy`) |
| **Build command** | `npm run build` |
| **Build output directory** | `_site` |
| **Root directory** | `/` |

### Node.js Version
The repository includes `.nvmrc` specifying Node `22`. You can also configure the environment variable in Cloudflare Pages dashboard:
- Variable name: `NODE_VERSION`
- Value: `22`

---

## Placeholders to Replace

> **Important Note on Amazon Links:**
> All "Check current price on Amazon" buttons across `src/_data/products.json`, rendered cards, and shortcodes point to direct Amazon search URLs (e.g. `https://www.amazon.com/s?k=Logitech+Lift+Vertical+Ergonomic+Mouse`). These links are compliant temporary placeholders without affiliate tracking tags so the site is fully functional. Before launching promotional campaigns, replace each search URL in `src/_data/products.json` with your tagged Amazon Associates link (e.g., `https://www.amazon.com/dp/B09VPHM9V8?tag=YOUR_TAG-20`).

Before publishing, search the codebase for each placeholder below and replace it with your real value:

| Placeholder | File(s) | What to put there |
|---|---|---|
| `REPLACE_WITH_GSC_CODE` | `src/_data/site.json` or `src/index.md` | Your Google Search Console verification meta tag content |
| `REPLACE_WITH_MY_EMAIL` | `src/_data/site.json` | Your actual contact email address |
| `REPLACE_WITH_WEB3FORMS_KEY` | `src/contact.md` | Your Web3Forms access key (get a free key at [web3forms.com](https://web3forms.com)) |
| Cloudflare Web Analytics snippet | `src/_includes/base.njk` | Add your Cloudflare Analytics beacon snippet before `</body>` |

---

## Verification Checklist (Specs to Verify on Amazon)

The following specifications were compiled from manufacturer documentation and should be confirmed on Amazon.com before publishing, as manufacturer SKUs and bundled accessories vary:

| Product | Specification to Double-Check |
|---|---|
| **Logitech Lift Vertical** | Confirm weight (125 g) and hand sizing bracket (Small/Medium vs. Large) |
| **Logitech MX Master 3S** | Confirm weight (141 g) and sensor DPI range (8,000 DPI) |
| **Baseus Monitor Light Bar** | Confirm color temperature range (2700K–6500K) and touch dimming steps |
| **BenQ ScreenBar Halo** | Confirm in-box wireless puck remote controller inclusion and model SKU |
| **Anker 737 Power Bank** | Confirm 24,000 mAh rating, 140W max single-port PD 3.1 output, and whether 140W charging brick is bundled |
| **Ugreen Nexode 100W** | Confirm exact 4-port distribution (3x USB-C + 1x USB-A) and per-port wattages |
| **Keychron K3** | Confirm version-specific hot-swap switch availability and 1000 Hz wired polling rate |
| **HUANUO Dual Monitor Arm** | Confirm maximum monitor size (up to 32") and weight rating (17.6 lbs per arm) |
| **Anker 8-in-1 Hub** | Confirm 4K HDMI refresh rate (4K@30Hz vs 4K@60Hz) and exact port configuration |
| **SOLEJAZZ Cable Tray** | Confirm desk clamp thickness compatibility (up to 2 inches) and rated load capacity |

---

## Directory Structure

```
gearbuddy/
├── .eleventy.js                  # Eleventy build configuration and shortcodes
├── .pages.yml                    # Pages CMS schema definition
├── .nvmrc                        # Node.js 22 runtime specification
├── .gitignore                    # Ignores node_modules/ and _site/
├── package.json                  # Scripts and @11ty/eleventy dependency
├── README.md                     # Documentation
├── src/                          # Site source directory
│   ├── _data/
│   │   ├── products.json         # Master product database & affiliate links
│   │   └── site.json             # Global site metadata & config
│   ├── _includes/
│   │   ├── base.njk              # Master HTML shell, head, header, disclosure, footer
│   │   ├── guide.njk             # Guide template with breadcrumbs & TOC
│   │   ├── deals.njk             # Deals hub layout
│   │   └── page.njk              # Standard page layout
│   ├── css/
│   │   └── style.css             # Mobile-first responsive stylesheet
│   ├── js/
│   │   └── main.js               # Mobile drawer, FAQ accordions, active nav
│   ├── fonts/                    # Self-hosted WOFF2 fonts
│   ├── images/                   # Product and setup imagery (WebP, JPG, SVG)
│   ├── _headers                  # Cloudflare Pages caching rules
│   ├── robots.txt.njk            # Generated robots.txt
│   ├── sitemap.xml.njk           # Generated sitemap.xml
│   ├── index.md                  # Homepage
│   ├── about.md                  # About GearBuddy
│   ├── contact.md                # Contact form (Web3Forms)
│   ├── legal.md                  # Privacy policy, affiliate disclosure, terms
│   ├── 404.md                    # Custom 404 page
│   ├── deals/
│   │   └── black-friday-desk.md  # Master deals hub
│   └── guides/
│       ├── best-ergonomic-mouse.md
│       ├── best-monitor-light-bar.md
│       ├── best-gan-power-banks.md
│       ├── budget-mechanical-kb.md
│       └── cable-management-tray.md
└── _site/                        # Generated output for Cloudflare Pages (ignored in git)
```

---

## Legal & Compliance Notes

- **Amazon Associates:** Register at [affiliate-program.amazon.com](https://affiliate-program.amazon.com). Your Associate tag must appear in every affiliate link.
- **FTC Disclosure:** You are legally required to disclose affiliate relationships clearly on every page containing affiliate links. The site template includes an above-the-fold disclosure notice on every page with commercial links — do not remove it.
- **Pricing & Claims Rules:** To comply with Amazon Associates Operating Agreement, the site never hardcodes dynamic prices, never quotes percentage discounts, and never claims personal "hands-on testing" or "lab testing". All guides are compiled from manufacturer specs and publicly available user reviews.
- **Privacy Policy:** Ensure `src/legal.md` accurately describes data practices, analytics, and contact form processing via Web3Forms.
