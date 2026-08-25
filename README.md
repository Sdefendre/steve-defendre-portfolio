# Steve Defendre portfolio

Personal site for Steve Defendre. Next.js App Router, with a desktop sidebar and a mobile dock.

**Live:** [steve-defendre-portfolio.vercel.app](https://steve-defendre-portfolio.vercel.app)

## Stack
- Next.js `16.2.9` (App Router) + React `19.2.7` + TypeScript
- Tailwind CSS `v4` (via `@import "tailwindcss"` in `src/app/globals.css`)
- Heroicons (`@heroicons/react`) for UI icons
- Three.js for desktop animated background
- Vitest + Testing Library + jsdom for tests
- ESLint 9 + `eslint-config-next`

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
`src/app/layout.tsx` computes `siteUrl` in this order:
1. `NEXT_PUBLIC_SITE_URL` (if set)
2. `https://${VERCEL_URL}` (if `NEXT_PUBLIC_SITE_URL` is unset and `VERCEL_URL` exists)
3. `http://localhost:3000` fallback

This value is used for `metadataBase`, social metadata, robots, and sitemap.

## Routes
- `/`. Home intro and selected project cards
- `/about`. Bio, how I work, and skills
- `/projects`. Featured build and project list
- `/contact`. Primary email inquiry and secondary links
- `/robots.txt`. Crawl rules
- `/sitemap.xml`. Sitemap

## Content
- Projects: [`src/data/projects.ts`](src/data/projects.ts)
- Contact / socials: [`src/data/socials.ts`](src/data/socials.ts)

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
