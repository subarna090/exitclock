# Exit Clock static site

Plain HTML, CSS and vanilla JavaScript for Exit Clock's Layoff Kit landing page.

## Placeholders

All publishing placeholders live in `window.EXIT_CLOCK_CONFIG` at the top of `assets/js/site.js`.

- `CHECKOUT_URL_PLACEHOLDER` — `checkoutUrl`; used by every paid CTA.
- `FORM_ENDPOINT_PLACEHOLDER` — `formEndpoint`; the tool posts `{ email, lastWorkingDay }` here.
- `CHANGELOG_URL_PLACEHOLDER` — `changelogUrl`; used by the FAQ, About page and footer.
- `SOURCE_PLACEHOLDER` — `sources`; five source labels are shown in the Problem section.
- `ANALYTICS_PLACEHOLDER` — the commented analytics hook in `site.js`.
- `LINKEDIN_URL` was not supplied, so no LinkedIn link has been invented.

The form intentionally shows the complete schedule locally while the form endpoint is still a placeholder. Set a real endpoint before publishing if email delivery is required.

## Price

Change `price` and `listPrice` once in `assets/js/site.js`. The displayed pricing and JSON-LD currently use the founding price of ₹999 and list price of ₹1,499.

## Palette

- `--navy: #0B1B30`
- `--navy-soft: #14304A`
- `--yellow: #FFCF33`
- `--ink: #142029`
- `--ink-soft: #4A5865`
- `--ground: #F4F6F8`
- `--panel: #FFFFFF`
- `--line: #D7DFE6`
- `--amber: #A25A15`

## Run locally

Serve the repository root with any static server. No build step or npm dependency is required. The site is structured for Replit Static Deployment.

Agent-written connective copy that needs review: page metadata, short supporting-page introductions, and the concise privacy/terms explanations around the supplied source copy.