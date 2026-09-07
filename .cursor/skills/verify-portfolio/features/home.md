# Home

Home is the static intro at `/`. A visitor reads the offer, sees four selected project cards, and can go to contact or the full project list.

## Sub-features

- `home-load` serves the static homepage with the H1, plus the availability chip from `lg` up.
- `home-cta-contact` sends Start a project to `/contact`.
- `home-cta-projects` sends View projects and View the full project list to `/projects`.
- `home-selected-work` shows the first four catalog titles as cards under A few I shipped.
- `home-nav` reaches About, Projects, and Contact from the visible primary nav.

## How to get to it (user POV)

- Open `/` directly, including a full reload.
- Choose the `Home` item in the desktop dock or the mobile dock.
- Follow the Home recovery link on a missing-page screen.

## Driving it with Playwright

Preconditions:

- Doctor reports `doctor: OK` for this `RUN_ID`.
- `PLAYWRIGHT_TEST_BASE_URL` equals this run's `BASE_URL`.
- Viewport `1440×1000` unless you are proving the mobile dock (`390×844`).

- **Open home.** Go to `/`. Run `await page.goto("/")` or open `$BASE_URL/`. Title is `Steve Defendre | Full-stack developer`. Heading level 1 is `I build software you can keep.`
- **Availability.** At `1440×1000` the chip text `Open to new work` is visible. Below `lg` (1024px) the chip is hidden, so at `390×844` assert the H1 only. The portrait alt text is `Steve Defendre, veteran founder and full-stack engineer`.
- **Contact CTA.** Choose `Start a project` in the hero. Run `page.getByRole("main").getByRole("link", { name: "Start a project" }).click()`. From `md` up the desktop dock carries a second link with that name, so an unscoped `getByRole` fails strict mode. The URL ends with `/contact` and the heading is `Tell me what you need built.`
- **Projects CTA.** Return to `/` with a full load (`page.goto("/")` or the Home nav item). Choose `View projects`. Run `page.getByRole("link", { name: "View projects" }).click()`. The URL is `/projects` and the heading is `Projects`.
- **Selected work.** On `/`, the heading `A few I shipped.` is visible. The region `page.getByRole("region", { name: "A few I shipped." })` contains links whose accessible names include `Defendre Solutions`, `FreeVoiceTranscribe`, `BraidsbyRose`, and `Traces`. Those are the first four rows in `src/data/projects.ts`. There is no fifth selected card.
- **Full list link.** Choose `View the full project list`. Run `page.getByRole("link", { name: "View the full project list" }).click()`. Same `/projects` result as View projects.
- **Primary nav.** From `/` at `1440×1000`, choose the visible `About` link. Run `page.getByRole("navigation", { name: "Primary navigation" }).locator("visible=true").getByRole("link", { name: "About" }).click()`. The URL is `/about`.
- **Scripted metadata.** Run `npx playwright test e2e/metadata.spec.ts --project=chromium -g "/ emits"`. Exactly one test runs. The home title and description match the `/` row in that spec.
- **Proof.** Save `$BASE_URL/` HTML and a screenshot that shows the H1 plus both CTAs into `evidence/home/`. The artifacts identify Steve Defendre and the two buttons.

## Gotchas

- `/` is rewritten to static HTML. Choosing Home from another page does a full document load. `page.goto("/")` is the reliable return, not a client back-transition.
- Desktop Home nav labels are `aria-label` values. The visible word Home in the desktop dock is `aria-hidden` at every width the dock shows. Use the role name `Home`, not a CSS query on the span.
- The studio name on home is an external link. Its accessible name is `Defendre Solutions (opens in a new tab)`. The footer carries a second link with that name, and the dock adds a third from `2xl`, so use `.first()` or scope to `main` before reading the `href`. Following it leaves this origin. Reading the `href` `https://defendresolutions.com` is enough.
- Selected work stacks vertically below the `lg` breakpoint. There is no horizontal snap row. Assert titles, not position.
- The missing-page screen has two links named `Home`, one in its recovery nav and one in the dock. Scope to `page.getByRole("main")` for the recovery link.
- Do not treat `npm run dev` on port 3000 as this instance unless launch started it.
