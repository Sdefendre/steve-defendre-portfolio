# Steve Defendre Portfolio

Personal portfolio site built with Next.js App Router. It presents Steve Defendre's profile, project showcase, and contact links with a responsive desktop/mobile navigation layout.

## Stack
- Next.js `16.1.3` (App Router) + React `19.2.3` + TypeScript
- Tailwind CSS `v4` (via `@import "tailwindcss"` in `src/app/globals.css`)
- Heroicons (`@heroicons/react`) for UI icons
- Three.js for desktop animated background (`src/components/ThreeScene.tsx`)
- Vitest + Testing Library + jsdom for tests
- ESLint 9 + `eslint-config-next`

## Getting Started
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts
- `npm run dev` - start local dev server
- `npm run build` - build production bundle
- `npm run start` - run built app
- `npm run lint` - run ESLint
- `npm run test` - run Vitest once (`vitest run`)

## Environment Variables
`src/app/layout.tsx` computes `siteUrl` in this order:
1. `NEXT_PUBLIC_SITE_URL` (if set)
2. `https://${VERCEL_URL}` (if `NEXT_PUBLIC_SITE_URL` is unset and `VERCEL_URL` exists)
3. `http://localhost:3000` fallback

This value is used for `metadataBase` and social metadata URL fields.

## Routes
- `/` - home intro + project cards
- `/about` - bio, core values, and skills
- `/projects` - full project list
- `/contact` - contact links and business info

## Project Content Model
Project content lives in [`src/data/projects.ts`](src/data/projects.ts).

`Project` fields:
- Required: `initials`, `title`, `description`, `tags`, `gradient`, `url`
- Optional: `image`, `useIframe`

Preview behavior in `ProjectCard`:
- `image` present: render `<Image />`
- Else `url` + `useIframe !== false`: render lazy `iframe`
- Else: render gradient + initials fallback

Note: current unstaged content changes include a new "Nayka's Portfolio" entry in `src/data/projects.ts` and the related asset `public/nayka-portfolio.png`.

## Testing
Run all tests:

```bash
npm test
```

Current tests cover:
- Route pages: `src/app/about/page.test.tsx`, `src/app/projects/page.test.tsx`, `src/app/contact/page.test.tsx`
- Components: `src/components/__tests__/ProjectCard.test.tsx`, `src/components/__tests__/Sidebar.test.tsx`

Vitest setup: `vitest.config.ts` with `jsdom` environment and `src/test/setup.ts`.

## Remote Images
`next.config.ts` allows remote images only from:
- `https://api.microlink.io`

If you add other remote image hosts, update `images.remotePatterns`.

## Structure

```text
portfolio/
  public/                 # Static assets (headshot, project images, icons)
  src/
    app/                  # App Router pages + layout + global styles
    components/           # Reusable UI + background/preview components
    data/projects.ts      # Portfolio project source data
    test/setup.ts         # Test setup (jest-dom)
  next.config.ts          # Next.js config (image remote patterns)
  vitest.config.ts        # Vitest config
```
