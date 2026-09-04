# PR #109 visual evidence: homepage desktop background

Before/After proof that removing the retired Three.js background subsystem
left the active CSS background unchanged.

| File | Source | Commit |
| --- | --- | --- |
| `before-production-home-desktop-1280x800.png` | Production, `https://steve-defendre-portfolio.vercel.app/` | `e69bbd1` (main at capture time) |
| `after-pr109-home-desktop-1280x800.png` | Local `next start` of the PR head, `http://127.0.0.1:3100/` | `bb938a9` |

Capture: Playwright Chromium (headless shell 151), viewport 1280x800,
`deviceScaleFactor: 1`, light color scheme, `reducedMotion: reduce`,
`waitUntil: networkidle` plus `document.fonts.ready`, viewport-only screenshot.

Why After is a local build rather than the Vercel preview: the preview URL
(`steve-defendre-portfolio-git-codex-s-096ef3-sdefendres-projects.vercel.app`)
is behind Vercel Authentication and redirects to `vercel.com/login`. No Vercel
credential was available to the capturing agent. The homepage is a committed
static document (`/` rewrites to `public/static-home.<hash>.html`), so the
bytes a local `next start` serves are the bytes Vercel serves. Checks run:

- Production `/` HTML is identical to `public/static-home.212c946e2690e58b.html`
  on this branch except for the CSS filename hash.
- Production CSS equals `main`'s `public/static-home.10631a1d523f3f39.css`.
  This branch's `public/static-home.29e50ab1aa22244c.css` differs only by
  dropping three rules (`.resize`, `.from-[#fafafa]`, `.to-[#f0f0f5]`) that
  the homepage HTML never references.
- Local `next start` served HTML and CSS byte-identical to the committed files.
- The Before and After PNGs are byte-identical (`cmp` reports no difference).
