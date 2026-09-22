# Steve Defendre portfolio

Personal site for Steve Defendre. Next.js App Router, with a desktop sidebar and a mobile dock.

**Live:** [steve-defendre-portfolio.vercel.app](https://steve-defendre-portfolio.vercel.app)

## Stack

- Next.js (App Router) + React + TypeScript (versions in `package.json` and `package-lock.json`)
- Tailwind CSS (via `@import "tailwindcss"` in `src/app/globals.css`)
- Heroicons (`@heroicons/react`) for UI icons
- CSS for the animated background
- Vitest + Testing Library + jsdom for tests
- Playwright for browser regression tests
- ESLint + `eslint-config-next`

## Getting started

Use Node.js 22, matching CI. Run these commands from the `portfolio/` directory:

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server on port 3000 |
| `npm run build` | Refresh stale homepage assets, build Next.js, and check the static homepage runtime |
| `npm run start` | Serve the production build; run `npm run build` first |
| `npm run sync:static-home` | Explicitly regenerate the static homepage assets and manifest |
| `npm run check:static-home` | Check homepage input freshness, output integrity, and runtime invariants without regenerating |
| `npm run test:static-home` | Run Node-based freshness and regeneration regressions |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest once |
| `npm run test:e2e` | Run Playwright against a production build |

## Environment variables

No environment variables are required for local development. Set `NEXT_PUBLIC_SITE_URL` when you need to override the canonical origin.

[`src/lib/site-url.mjs`](src/lib/site-url.mjs) resolves the canonical origin in this order:

1. `NEXT_PUBLIC_SITE_URL`
2. `VERCEL_PROJECT_PRODUCTION_URL` (preferred over preview deployments)
3. `VERCEL_URL`
4. `https://steve-defendre-portfolio.vercel.app/` fallback

Static asset scripts load production `.env` files using the same loader as Next; existing process variables take precedence. Blank or malformed values, non-HTTP(S) schemes, and credentials are rejected; the next valid candidate is used. Surrounding whitespace is trimmed, scheme-less hosts use HTTPS, and paths, queries, and fragments are removed.

The shared policy supplies the static homepage, dynamic route metadata, robots, and sitemap. The resolved canonical URL is also part of the static homepage input hash, so changing it triggers regeneration during `npm run build`.

## Static homepage workflow

Requests to `/` are rewritten to [`src/app/static-home-internal/route.ts`](src/app/static-home-internal/route.ts), which serves generated HTML. The homepage has Vercel Insights but no Next.js framework scripts or WebMCP registrar. The other pages use the App Router.

All application source under `src/` (except generated outputs) is hashed to cover transitive renderer dependencies. The hash also covers build inputs, the lockfile, and relevant public assets. After source or content edits, regenerate before previewing the homepage, including when using `npm run dev`:

```bash
npm run sync:static-home
npm run check:static-home
```

`npm run build` runs the freshness check and regenerates stale outputs automatically through `prebuild`. Regeneration stages and validates the replacement before publishing it; failed compilation or rendering preserves the previous manifest and its assets.

Commit the generated `src/generated/static-home-assets.ts` manifest and changed `public/static-home.*.html` / `public/static-home.*.css` assets with source changes. Do not edit generated files by hand.

## Routes

- `/`. Home intro and selected project cards
- `/about`. Bio, how I work, and skills
- `/projects`. Project catalog, category filters, and expandable case studies; supports `?category=Studio`, `Client`, or `Product`
- `/contact`. Email draft composer, copy-email action, and secondary links
- `/robots.txt`. Crawl rules
- `/sitemap.xml`. Sitemap

## Content

- Projects: [`src/data/projects.ts`](src/data/projects.ts)
- About facts: [`src/data/about.ts`](src/data/about.ts)
- Contact / socials: [`src/data/socials.ts`](src/data/socials.ts)
- Navigation: [`src/data/navigation.ts`](src/data/navigation.ts)

`Project` fields in [`src/data/projects.ts`](src/data/projects.ts):

- Required: `initials`, `title`, `description`, `role`, `outcome`, `category`, `year`, `status`, `caseStudy`, `tags`, `gradient`, `url`
- `category`: `Studio` | `Client` | `Product`
- `status`: `Live` | `Prototype`
- `caseStudy`: `challenge`, `approach`, and `impact` strings
- Optional: `image`, `priority`, `ctaLabel`

Project previews live in `public/project-previews/`. `ProjectCard` supports `compact`, `detailed`, and `featured` variants. After changing catalog entries or previews, regenerate the static homepage and review the matching [verification feature map](.cursor/skills/verify-portfolio/features/README.md).

## Contact behavior

The public contact email is **`steve@defendresolutions.com`**, defined in `src/data/socials.ts`. The contact form validates name, email, project type, budget range, and message, then opens a `mailto:` draft for the visitor to review and send. It does not submit an inquiry to a server.

The composer limits names to 80 characters, email addresses to 254, and messages to 1,000. It also checks the complete encoded draft URL against a 2,000-character limit, so special characters can require a shorter message. Draft overflow is first shown on submit and revalidated as fields change. Email and copy-address links remain available if the mail app cannot open.

## WebMCP

Browsers that implement [WebMCP](https://webmachinelearning.github.io/webmcp/)
can call page-level tools registered on `/about`, `/projects`, and `/contact`. There is no extra UI. The tools wrap the same catalog, filters, routes, and contact page the site already uses.

The homepage intentionally serves static HTML with only Vercel Insights and no Next framework scripts or WebMCP registrar. Navigating home unloads the tools; navigate to a supported route to register them again.

| Tool | What it does |
| --- | --- |
| `list-projects` | Public catalog: title, category, status, URL, short description |
| `filter-projects` | Same catalog filtered by Studio / Client / Product, then opens `/projects` |
| `navigate` | Allowlisted paths only: `/`, `/about`, `/projects`, `/contact` |
| `open-contact` | Opens `/contact` and returns `steve@defendresolutions.com`. A person still sends the message. |
| `get-about` | Facts already published on `/about` |

## Changelog

User-visible changes are tracked in [`CHANGELOG.md`](CHANGELOG.md).

## Testing

Run the validation checks used by [CI](.github/workflows/ci.yml):

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npm run test:static-home
```

Vitest covers routes, metadata, navigation, project filtering, contact validation, WebMCP, and shared UI. The static-home tests cover input freshness, canonical URLs, and safe regeneration.

For browser regressions, build first, then install the browser engines and run Playwright:

```bash
npm run build
npx playwright install chromium firefox webkit
npm run test:e2e
```

On Linux, use `npx playwright install --with-deps chromium firefox webkit` to install system dependencies too. Chromium runs the full browser suite; Firefox and WebKit run the focused accessibility suite. Playwright starts the production server at `http://127.0.0.1:3100` and can reuse an existing local server outside CI. Ensure any reused server is serving the build you intend to test.

Set `PLAYWRIGHT_TEST_BASE_URL` to test another target. External targets must already be running; local targets use the configured host and port. Failure artifacts are saved under `test-results/`, and the HTML report is under `playwright-report/`.

CI also checks verification-helper lifecycle and signal safety on Linux and macOS. To run those checks locally, install Python 3 and `lsof`, then run:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 scripts/verify-portfolio-helpers.test.py
```

## Structure

```text
portfolio/
  CHANGELOG.md
  .cursor/skills/verify-portfolio/ # Manual feature maps and server helpers
  .github/workflows/ci.yml # Validation, browser tests, helper lifecycle tests
  e2e/                    # Playwright browser regressions
  public/                 # Images, fonts, generated homepage HTML/CSS
  scripts/                # Static homepage generation/checks and helper tests
  src/
    app/                  # Route groups, static homepage handler, metadata
    components/           # UI, nav, project cards, background
    data/                 # Projects, about, socials, navigation
    generated/            # Static homepage asset manifest
    lib/                  # Canonical URLs, metadata, fonts, WebMCP
    test/setup.ts         # Test setup (jest-dom)
    proxy.ts              # Route security headers and internal URL redirects
  next.config.ts
  playwright.config.ts
  vitest.config.ts
```
