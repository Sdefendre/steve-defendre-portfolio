# About

About is the bio at `/about`. A visitor reads who Steve is, how a project is taken, and which skills are listed, then can skip to the main landmark from the keyboard.

## Sub-features

- `about-load` shows the About me heading, studio link, and three proof points.
- `about-phases` lists the three how-I-build phases in order.
- `about-skills` lists Interface, Systems, Delivery, and Infrastructure with their skill names.
- `about-skip` reveals Skip to content on first Tab and moves focus to `#main-content`.
- `about-external` discloses new-tab GitHub and Defendre Solutions links without changing the visible words.

## How to get to it (user POV)

- Open `/about` directly.
- Choose `About` in the desktop dock or the mobile dock.
- From home, choose `About` in the visible primary nav.

## Driving it with Playwright

Preconditions:

- Doctor reports `doctor: OK` for this `RUN_ID`.
- `PLAYWRIGHT_TEST_BASE_URL` equals this run's `BASE_URL`.
- Viewport `1440×1000` for reading. Use the default Playwright viewport for the skip-link spec. Use `1600×1000` for `about-external`; the GitHub link and the first studio link sit in the dock social nav, which only renders from `2xl` (1536px).

- **Open about.** Go to `/about`. Run `await page.goto("/about")`. Title is `About Steve Defendre | Veteran software builder`. Heading level 1 is `About me`.
- **Bio.** The page contains `I'm Steve Defendre, a military veteran, CS graduate, and founder of`. The bio studio link, `page.getByRole("main").getByRole("link", { name: "Defendre Solutions (opens in a new tab)" }).first()`, has `href` `https://defendresolutions.com`. The footer and, from `2xl`, the dock carry links with the same name, so a bare `getByRole` fails strict mode.
- **Proof points.** Visible pairs are Studio / `Founder of Defendre Solutions`, What I ship / `Client sites, local AI tools, desktop apps, and agent workflows`, Stack / `Next.js, React, TypeScript, Python, Electron, PostgreSQL, AWS`.
- **Phases.** Heading `How I take a project.` is visible. Headings `Start with the outcome`, `Ship the next usable version`, and `Own it after launch` appear in that order, with `Phase 01` through `Phase 03`.
- **Skills.** Heading `What I use` is visible. Lists named `Interface skills`, `Systems skills`, `Delivery skills`, and `Infrastructure skills` contain `React`, `TypeScript`, `Git`, and `PostgreSQL` respectively.
- **Skip link.** Run `npx playwright test e2e/accessibility.spec.ts --project=chromium -g "skip link"`. First Tab focuses `Skip to content`. Enter updates the URL to `#main-content` and focuses `#main-content`.
- **New-tab disclosure.** Run `npx playwright test e2e/accessibility.spec.ts --project=chromium -g "new-tab links"`. The spec sets `1600×1000`. At that width the GitHub link name is `GitHub (opens in a new tab)` and three links named `Defendre Solutions (opens in a new tab)` exist. The second of those still displays the visible text `Defendre Solutions`. At `1440×1000` the GitHub link is not found by role and only two studio links exist.
- **Proof.** Save a screenshot of the About me header and the three phases into `evidence/about/`. Keep the skip-link Playwright output if you ran that spec.

## Gotchas

- About lives in the site layout, not the static home shell. Sidebar (from `md` up) and MobileNav (below `md`) both mount. Query the visible `Primary navigation` only.
- The about portrait alt text is `Steve Defendre, founder of Defendre Solutions`. Home uses a different alt string. Do not reuse the home alt here. `getByAltText("Steve Defendre")` also matches the dock avatar from `md` up, so pass the full string with `exact: true`.
- WebMCP `get-about` returns the same facts from `src/data/about.ts`. That return value is not a visit to `/about`. Drive the page.
- Skip-link visibility is focus-driven (`sr-only` until focus). Looking at a screenshot without sending Tab will miss it.
- WebKit uses `Alt+Tab` for the first focus move in `e2e/accessibility.spec.ts`. Chromium uses `Tab`.
