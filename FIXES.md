# Fix pass — 17 Sep 2026

Audited every page in headless Chromium at 1280 / 390 / 360px, in light and dark,
with a contrast checker and an image/overflow probe. Findings and fixes below.

## Critical

**1. Every image was stretched to its `height` attribute.**
`img { max-width: 100%; display: block; }` was missing `height: auto`, so the CSS `width`
applied but the HTML `height="800"` won. The five product covers rendered as 800px-tall
slabs and the author image at 1024px tall. Added `height: auto`. Covers now render at their
true 3:4 ratio (~200×250 desktop, ~85×110 mobile).

**2. That bug also broke mobile.** The oversized rotated covers pushed the page to 483px wide
in a 390px viewport — a horizontal scroll on every phone. Now 390/390 and 360/360, zero
overflow. `.product-mock` also got `overflow: hidden` as a permanent guard, plus smaller
transforms below 500px.

**3. Dark mode was unusable — 32 contrast failures.** The dark block overrode surface tokens
but not `--navy`, which was being used as a *text* colour everywhere. Result: every `h2`/`h3`
rendered near-black on near-black (1.02:1), including the ₹999 price. The header kept a
hardcoded white background with light-grey nav links (1.71:1). Introduced semantic tokens
(`--heading`, `--rule-strong`, `--accent-ink`, `--header-bg`, `--wash`) that flip in dark mode
while the brand tokens `--navy` / `--yellow` stay fixed for surfaces. **0 contrast failures
across 17 page/theme combinations.**

**4. The header CTA label was the wrong colour in both themes.** `.main-nav a` (0,1,1) beat
`.btn-primary` (0,1,0), so the button text inherited `--ink-soft` — grey on yellow in light,
invisible in dark. Added `.main-nav a.btn-primary`.

## Content and copy

- **Five visible `SOURCE_PLACEHOLDER` strings** were rendering on the page as
  "Verified: Sept 2026 · source: SOURCE_PLACEHOLDER". Replaced with real sources
  (labour.gov.in, incometax.gov.in, irdai.gov.in) dated 16 Sep 2026.
- **The final CTA sold a different product at a different price** — "Get the Complete kit —
  ₹1,499", contradicting the one-bundle ₹999 decision. Fixed. The price now comes from one
  place (`config.price`) on every page.
- **The locked panel leaked builder instructions** into customer-facing copy: "A person who
  refuses the email still keeps the two free deadlines above." Rewritten.
- **`CHANGELOG_URL_PLACEHOLDER` was the visible link text** on /about. Now reads
  "the public changelog"; the anchor degrades to plain text while the URL is unset.
- **Dead checkout links.** Four CTAs pointed at `CHECKOUT_URL_PLACEHOLDER`. They now stay on
  the page but route to #pricing, render dimmed, and the pricing card shows a setup note —
  until `checkoutUrl` is set in `assets/js/site.js`, at which point everything switches to the
  real URL with `target="_blank"`.
- **Labour Codes date** made precise: "21 November 2025".
- **ABVKY** restored to the verified wording in the tool: in force 1 Jul 2026 – 30 Jun 2027,
  198th ESIC meeting, PIB 30 Jun 2026.
- **404** had no link back to the homepage.

## Images

- **The hero image was a marketing banner with baked-in text**, cropped into a tall slot with
  `mix-blend-mode: screen`. It showed fragments — "ared / ssionals / Brighter / orrows" and a
  cut-off "exit clo". Replaced with `hero-clocks.svg`, a clean clock face with four marked
  intervals.
- **The author photo was the square brand tile**, with invented alt text describing a
  photograph that does not exist ("Subarna Das holding a mug that says Know Your Clock").
  Replaced with `author-placeholder.svg`, an on-brand monogram, and honest alt text.
  **Swap in a real headshot when you have one.**
- **The fifth cover was in the repo but never shown.** `cover-role-packs.png` added to the fan.
- **New `og-cover.jpg` at the correct 1200×630.** The old OG image was a 1600×595 banner.

## Housekeeping

- Fonts moved from a render-blocking CSS `@import` to a `<link>` in each `<head>`.
- `.rule-line` had no CSS at all — the tool printed the legal rule as unstyled body text.
  Now an indented italic note.
- Tool form fields had mismatched heights (date inputs render taller); rows now align.
- `theme-color`, `og:site_name`, `og:image:width/height`, `viewport-fit=cover` added site-wide.
- The print button had an inline style fighting its own class.

## Verified working

Tool end to end: 2 free deadlines → locked panel → email → 8 more deadlines + print button.
No JavaScript errors. All 17 page/theme combinations pass contrast at WCAG 2.2 AA.

## Still yours to do

1. `checkoutUrl` — the SuperProfile Digital Product URL.
2. `formEndpoint` — MailerLite or Brevo, for the email gate.
3. `changelogUrl`.
4. A real headshot to replace `author-placeholder.svg`.
5. Your LinkedIn URL on /about.
