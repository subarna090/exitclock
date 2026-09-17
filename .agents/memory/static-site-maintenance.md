---
name: Static site maintenance
description: Keep static pages easy to review and patch after the initial build.
---

Prefer multiline HTML for standalone pages instead of compressing the whole document onto one line. This keeps later accessibility, content, and interaction fixes precise and low-risk.

**Why:** A one-line standalone page made a small post-build behavior fix unnecessarily brittle and required a CSS/JavaScript workaround.

**How to apply:** Keep shared styling and scripts centralized, but format each page's semantic markup across readable lines so targeted patches can match stable context.