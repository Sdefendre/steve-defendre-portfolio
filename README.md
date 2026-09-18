# Steve Defendre portfolio

Personal site for Steve Defendre. Next.js App Router, with a desktop sidebar and a mobile dock.

**Live:** [steve-defendre-portfolio.vercel.app](https://steve-defendre-portfolio.vercel.app)

## Stack
- Next.js (App Router) + React + TypeScript (versions in `package.json` and `package-lock.json`)
- Tailwind CSS (via `@import "tailwindcss"` in `src/app/globals.css`)
- Heroicons (`@heroicons/react`) for UI icons
- CSS for the animated background
- Vitest + Testing Library + jsdom for tests
- ESLint + `eslint-config-next`

## Getting started
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts
- `npm run dev`. Start local dev server
- `npm run build`. Build production bundle
- `npm run start`. Run built app
- `npm run lint`. Run ESLint
- `npm run test`. Run Vitest once (`vitest run`)

## Environment variables
[`src/lib/site-url.mjs`](src/lib/site-url.mjs) resolves the canonical origin in this order:
1. `NEXT_PUBLIC_SITE_URL`
2. `VERCEL_PROJECT_PRODUCTION_URL` (preferred over preview deployments)
3. `VERCEL_URL`
4. `https://steve-defendre-portfolio.vercel.app/` fallback

Static asset scripts load production `.env` files using the same loader as Next; existing process variables take precedence. Blank or malformed values, non-HTTP(S) schemes, and credentials are rejected; the next valid candidate is used. Surrounding whitespace is trimmed, scheme-less hosts use HTTPS, and paths, queries, and fragments are removed.

The shared policy supplies the static homepage, dynamic route metadata, robots, and sitemap. The resolved canonical URL is also part of the static homepage input hash, so changing it triggers regeneration during `npm run build`. All application source under `src/` (except generated outputs) is hashed to cover transitive renderer dependencies. Run `npm run sync:static-home` to regenerate explicitly, `npm run check:static-home` to verify outputs, and `npm run test:static-home` for freshness/regeneration regressions. Commit generated assets with source changes.

## Routes
- `/`. Home intro and selected project cards
- `/about`. Bio, how I work, and skills
- `/projects`. Featured build and project list
- `/contact`. Primary email inquiry and secondary links
- `/robots.txt`. Crawl rules
- `/sitemap.xml`. Sitemap

## Content
- Projects: [`src/data/projects.ts`](src/data/projects.ts)
- About facts: [`src/data/about.ts`](src/data/about.ts)
- Contact / socials: [`src/data/socials.ts`](src/data/socials.ts)

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

Public contact email is **`steve@defendresolutions.com`** (studio address only, not personal Gmail).

`Project` fields:
- Required: `initials`, `title`, `description`, `role`, `outcome`, `tags`, `gradient`, `url`
- Optional: `image`, `priority`, `ctaLabel`

`ProjectCard` variants: `compact` | `detailed` | `featured`.

## Changelog
User-visible changes are tracked in [`CHANGELOG.md`](CHANGELOG.md).

## Testing
```bash
npm test
```

Coverage includes route pages, layout/proxy/robots/sitemap, ProjectCard, Sidebar, MobileNav, CopyEmailButton, and the CSS background.

## Structure

```text
portfolio/
  CHANGELOG.md
  public/                 # Static assets (headshot, project images)
  src/
    app/                  # App Router pages + layout + global styles
    components/           # UI, nav, project cards, background
    data/                 # projects + socials source data
    test/setup.ts         # Test setup (jest-dom)
  next.config.ts
  vitest.config.ts
```
