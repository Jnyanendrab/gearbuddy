# GearBuddy — Desk Setup Affiliate Review Site

## Overview

GearBuddy is a lightweight, static affiliate review site focused on desk setup gear: ergonomic mice, monitor lights, mechanical keyboards, GaN chargers, power banks, monitor arms, USB hubs, and cable management accessories.

**Tech stack:** Plain HTML/CSS/JS — no build step, no framework, no bundler. Everything is vanilla and deploys as-is.

**Deployment target:** [Cloudflare Pages](https://pages.cloudflare.com/) — free tier, global CDN, automatic HTTPS, and Git-based deploys.

**Domain:** `gearbuddy.shop`

---

## Placeholders to Replace

Before publishing, search the codebase for each placeholder below and replace it with the real value.

| Placeholder | File(s) | What to put there |
|---|---|---|
| `REPLACE_WITH_MY_AFFILIATE_LINK` | `/data/products.json` (all 10 entries) | Your Amazon Associates affiliate link for each product |
| `REPLACE_WITH_GSC_CODE` | `/index.html` `<head>` | Your Google Search Console verification meta tag content value |
| `REPLACE_WITH_MY_EMAIL` | `/contact.html` | Your actual contact email address |
| `REPLACE_WITH_WEB3FORMS_KEY` | `/contact.html` | Your Web3Forms access key (get a free key at [web3forms.com](https://web3forms.com)) |
| Cloudflare Web Analytics snippet | Every `.html` file, before `</body>` | Add your Cloudflare Analytics beacon `<script>` tag |

---

## [VERIFY] Items

The following product details are marked `[VERIFY]` in the site copy and **must be confirmed on Amazon.com before publishing**. Product lines, specs, and packaging change frequently.

| Product | What to verify |
|---|---|
| **BenQ ScreenBar Halo** | Wireless remote controller: confirm it is included in-box and check model name |
| **Anker 737 Power Bank** | Exact mAh capacity (listed as 24,000 mAh) and whether a 140W charging adapter is included or sold separately |
| **Ugreen Nexode 100W** | Exact port configuration — confirm 3× USB-C + 1× USB-A and each port's maximum wattage |
| **Keychron K3** | Hot-swap availability: confirm which version/SKU offers hot-swap; verify exact polling rate (listed as 1000 Hz for USB mode) |
| **HUANUO Dual Monitor Arm** | Maximum monitor size (listed as up to 32″) and maximum weight per arm (listed as 17.6 lb / 8 kg) |
| **Anker 8-in-1 Hub** | Exact port list and confirm 4K/30Hz HDMI spec vs. 4K/60Hz |
| **SOLEJAZZ Cable Tray** | Adjustable width range and stated weight limit |

> **Note:** Always verify every product model name and spec on Amazon.com before publishing. Product lines change frequently and listings may be updated or replaced.

---

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
