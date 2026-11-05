# GearBuddy — Desk Setup Affiliate Review Site

## Overview

GearBuddy is a lightweight, static affiliate review site focused on desk setup gear: ergonomic mice, monitor lights, mechanical keyboards, GaN chargers, power banks, monitor arms, USB hubs, and cable management accessories.

**Tech stack:** Plain HTML/CSS/JS — no build step, no framework, no bundler. Everything is vanilla and deploys as-is.

**Deployment target:** [Cloudflare Pages](https://pages.cloudflare.com/) — free tier, global CDN, automatic HTTPS, and Git-based deploys.

**Domain:** `gearbuddy.shop`

---

## Placeholders to Replace

> **Important Note on Amazon Links:**
> All "Check current price on Amazon" buttons across `data/products.json`, JS-rendered cards, and static fallback cards currently point to direct Amazon search URLs (e.g. `https://www.amazon.com/s?k=Logitech+Lift+Vertical+Ergonomic+Mouse`). These links are temporary placeholders without affiliate tracking tags so the site is fully functional and compliant. Before launching promotional campaigns, replace each search URL in `data/products.json` with your tagged Amazon Associates link (e.g., `https://www.amazon.com/dp/B09VPHM9V8?tag=YOUR_TAG-20`).


Before publishing, search the codebase for each placeholder below and replace it with the real value.

| Placeholder | File(s) | What to put there |
|---|---|---|
| `REPLACE_WITH_MY_AFFILIATE_LINK` | `/data/products.json` (all 10 entries) | Your Amazon Associates affiliate link for each product |
| `REPLACE_WITH_GSC_CODE` | `/index.html` `<head>` | Your Google Search Console verification meta tag content value |
| `REPLACE_WITH_MY_EMAIL` | `/contact.html` | Your actual contact email address |
| `REPLACE_WITH_WEB3FORMS_KEY` | `/contact.html` | Your Web3Forms access key (get a free key at [web3forms.com](https://web3forms.com)) |
| Cloudflare Web Analytics snippet | Every `.html` file, before `</body>` | Add your Cloudflare Analytics beacon `<script>` tag |

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

## Running Locally

No build step required — just serve the directory with any static file server.

**macOS / Linux:**
```bash
cd gearbuddy
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

**Windows (PowerShell):**
```powershell
cd gearbuddy
python -m http.server 8080
# Open http://localhost:8080 in your browser
```

Alternatively, use the [VS Code Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for auto-reload on save.

---

## Deploying to GitHub

```bash
git init   # already done if cloned
git add .
git commit -m "Initial GearBuddy site"
git remote add origin https://github.com/YOUR_USERNAME/gearbuddy.git
git push -u origin main
```

> Replace `YOUR_USERNAME` with your GitHub username and ensure the repository `gearbuddy` has been created on GitHub first (Settings → New repository).

---

## Cloudflare Pages Setup

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create Application** → **Pages**
2. Click **Connect to Git** and authorize Cloudflare to access your GitHub account
3. Select the `gearbuddy` repository
4. Configure build settings:
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
5. Click **Save and Deploy**
6. Cloudflare will assign a `*.pages.dev` URL — test it before connecting your custom domain

---

## Connecting the Custom Domain (gearbuddy.shop)

1. In Cloudflare Pages, open your project → **Custom Domains** → **Add a Custom Domain**
2. Enter `gearbuddy.shop` and click **Continue**
3. **If your domain is already on Cloudflare DNS:** The CNAME record is added automatically — just confirm and wait for propagation (usually under 1 minute)
4. **If your domain is on another registrar:** Add a CNAME record at your registrar pointing `gearbuddy.shop` → `<your-pages-project>.pages.dev`
5. Repeat for `www.gearbuddy.shop` → same Pages URL
6. Cloudflare Pages provisions a free TLS certificate automatically

---

## File Structure

```
gearbuddy/
├── index.html                    # Homepage — featured products & hero
├── about.html                    # About GearBuddy
├── contact.html                  # Contact form (Web3Forms)
├── legal.html                    # Privacy policy, affiliate disclosure, terms
├── 404.html                      # Custom 404 page
├── sitemap.xml                   # XML sitemap for search engines
├── robots.txt                    # Crawler directives
├── README.md                     # This file
├── css/
│   └── style.css                 # All site styles
├── js/
│   └── main.js                   # Product card rendering & interactivity
├── data/
│   └── products.json             # Product data, specs, and affiliate links
├── images/
│   ├── logitech-lift.svg
│   ├── logitech-mx-master-3s.svg
│   ├── baseus-screenbar.svg
│   ├── benq-screenbar-halo.svg
│   ├── anker-737-power-bank.svg
│   ├── ugreen-nexode-100w.svg
│   ├── keychron-k3.svg
│   ├── huanuo-dual-monitor-arm.svg
│   ├── anker-8in1-hub.svg
│   └── solejazz-cable-tray.svg
├── guides/
│   ├── best-ergonomic-mouse.html
│   ├── best-monitor-light-bar.html
│   ├── best-gan-power-banks.html
│   ├── budget-mechanical-kb.html
│   └── cable-management-tray.html
└── deals/
    └── black-friday-desk.html
```

---

## Legal Notes

- **Amazon Associates:** Register at [affiliate-program.amazon.com](https://affiliate-program.amazon.com). Your Associate tag must appear in every affiliate link.
- **FTC Disclosure:** You are legally required to disclose affiliate relationships clearly on every page containing affiliate links. The site template includes a disclosure notice — do not remove it.
- **Above-the-fold disclosure:** Keep the affiliate disclosure visible without scrolling on pages with affiliate links. This is already done in the template.
- **Privacy Policy:** Ensure your `legal.html` accurately describes your data practices, especially if you use analytics (Cloudflare Web Analytics, Google Analytics) or a contact form processor (Web3Forms).

---

## Quick Checklist Before Going Live

- [ ] All 10 `REPLACE_WITH_MY_AFFILIATE_LINK` placeholders replaced in `products.json`
- [ ] `REPLACE_WITH_GSC_CODE` replaced in `index.html` (and submitted to Google Search Console)
- [ ] `REPLACE_WITH_MY_EMAIL` replaced in `contact.html`
- [ ] `REPLACE_WITH_WEB3FORMS_KEY` replaced in `contact.html`
- [ ] Cloudflare Web Analytics snippet added to every HTML file
- [ ] All `[VERIFY]` product specs confirmed on Amazon.com
- [ ] `sitemap.xml` submitted to Google Search Console
- [ ] Custom domain connected and TLS certificate active
- [ ] 404 page working correctly on Cloudflare Pages
- [ ] Affiliate disclosure visible on all pages with product links
