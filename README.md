# Steve Defendre Portfolio

Personal portfolio site built with Next.js App Router. It presents Steve Defendre's profile, project showcase, and contact links with a visionOS-inspired spatial layout (desktop sidebar + mobile dock).

**Live:** [steve-defendre-portfolio.vercel.app](https://steve-defendre-portfolio.vercel.app)

## Stack
- Next.js `16.2.9` (App Router) + React `19.2.7` + TypeScript
- Tailwind CSS `v4` (via `@import "tailwindcss"` in `src/app/globals.css`)
- Heroicons (`@heroicons/react`) for UI icons
- Three.js for desktop animated background
- Vitest + Testing Library + jsdom for tests
- ESLint 9 + `eslint-config-next`

## Getting Started
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts
- `npm run dev` — start local dev server
- `npm run build` — build production bundle
- `npm run start` — run built app
- `npm run lint` — run ESLint
- `npm run test` — run Vitest once (`vitest run`)

## Environment Variables
`src/app/layout.tsx` computes `siteUrl` in this order:
1. `NEXT_PUBLIC_SITE_URL` (if set)
2. `https://${VERCEL_URL}` (if `NEXT_PUBLIC_SITE_URL` is unset and `VERCEL_URL` exists)
3. `http://localhost:3000` fallback

This value is used for `metadataBase`, social metadata, robots, and sitemap.

## Routes
- `/` — home intro + selected project cards
- `/about` — bio, mission path, and capabilities
- `/projects` — featured build + project archive
- `/contact` — primary email inquiry + secondary links
- `/robots.txt` — crawl rules
- `/sitemap.xml` — sitemap

## Content
- Projects: [`src/data/projects.ts`](src/data/projects.ts)
- Contact / socials: [`src/data/socials.ts`](src/data/socials.ts)

Public contact email is **`steve@defendresolutions.com`** (studio address only — not personal Gmail).

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

Coverage includes route pages, layout/proxy/robots/sitemap, ProjectCard, Sidebar, MobileNav, CopyEmailButton, and Three.js lifecycle hooks.

## Structure

```text
portfolio/
  CHANGELOG.md
  public/                 # Static assets (headshot, project images)
  src/
    app/                  # App Router pages + layout + global styles
    components/           # UI, nav, project cards, background
    data/                 # projects + socials source data
    hooks/three/          # Three.js lifecycle/animation hooks
    test/setup.ts         # Test setup (jest-dom)
  next.config.ts
  vitest.config.ts
```
