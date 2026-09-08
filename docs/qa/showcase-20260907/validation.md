# Showcase readiness validation — 2026-09-07

- Worktree: `/Users/stevedefendre/showcase-readiness-20260907/portfolio`
- Focus: `src/app/(home)/page.tsx`, including catalog scope, live/prototype context, and category links.
- Local lint completed successfully before the shared machine became overloaded.
- GitHub Actions initially failed because the homepage unit-test mock omitted the newly used `projectCategories` and `projectsFilterHref` exports. Commit `9355da1` supplies those mock exports; the replacement CI run is the authoritative result.
- Focused check passed: `npx vitest run 'src/app/(home)/page.test.tsx' --maxWorkers=1` (3 tests).
- Browser review completed 2026-09-08 against Vercel preview for a39aa58: desktop and 390px mobile layout; no horizontal overflow (382px document / 390px viewport). Client category navigation renders exactly three client projects. Before screenshot uses https://steve-defendre-portfolio.vercel.app. Before/after desktop and mobile screenshots are attached in this directory.
- GitHub Validate, Browser regression, and Vercel checks pass for a39aa58.

## Cloud Agent follow-up — 2026-09-08

- Environment: Cursor Cloud Agent VM (not the shared 16GB box). Node 22, Playwright Chromium 151, `next start` of PR head `5a47554` via `.cursor/skills/verify-portfolio/helpers/launch.sh pr114-after` on `127.0.0.1:3100`; `doctor.sh` passed.
- CI-equivalent run on `5a47554`: `npx vitest run` (32 files, 156 tests), `npm run lint`, `npx tsc --noEmit`, `npm run build` all passed.
- Commit `5a47554` adds assertions the mock fix did not have: Studio/Client/Product links resolve to `/projects?category=…`, the full-list link stays on `/projects`, and the telemetry separates public build count from live link count.
- Vercel preview (`steve-defendre-portfolio-git-chore-s-0b1ba3-sdefendres-projects.vercel.app`) redirects to Vercel SSO (Deployment Protection), so **After** is the local production build of the PR head at the same viewports, matching the PR #109 evidence approach. **Before** is live production `https://steve-defendre-portfolio.vercel.app/`.
- Captures (dark scheme, reduced motion, DPR 1): `before-*` / `after-*` in this folder. `*-selected-work-*` crops the Selected work header; `*-telemetry-*` crops the header `dl`; `*-home-*-full.jpg` is the full page for context.
- DOM readout (`capture-report.json`): Before has no category links and telemetry `Studio / Work / Background`. After has links `Studio`, `Client`, `Product` → `/projects?category=<name>`, telemetry `Studio / Showcase: 8 public builds / Live now: 6 active links`, and the intro sentence that says the full catalog marks prototypes separately.
