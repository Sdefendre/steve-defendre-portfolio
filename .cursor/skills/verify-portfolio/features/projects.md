# Projects

Projects is the catalog at `/projects`. A visitor filters by Studio, Client, or Product, reads the live count, and opens an inline case study for challenge, approach, and impact.

## Sub-features

- `projects-load` shows all eight project articles and `Showing 8 of 8 projects`.
- `projects-filter-client` presses Client, shows three articles, and writes `/projects?category=Client`.
- `projects-filter-studio` presses Studio and shows one article, Defendre Solutions.
- `projects-filter-product` presses Product and shows four articles.
- `projects-filter-all` returns to `/projects` and eight articles.
- `projects-url-entry` opens `/projects?category=Client` and lands on the Client chip already pressed.
- `projects-case-study` opens the first visible case study and reveals Challenge, Approach, and Impact.
- `projects-prototype-label` keeps Traces and WealthWise marked Prototype without live-deployment alt text.

## How to get to it (user POV)

- Open `/projects` directly.
- Choose `Projects` in the desktop dock or the mobile dock.
- From home, choose `View projects` or `View the full project list`.
- Open a filtered URL `/projects?category=Studio`, `/projects?category=Client`, or `/projects?category=Product`.
- Choose a category button in the group named `Project category filters`.

## Driving it with Playwright

Preconditions:

- Doctor reports `doctor: OK` for this `RUN_ID`.
- `PLAYWRIGHT_TEST_BASE_URL` equals this run's `BASE_URL`.
- Viewport `1440×1000`.
- Catalog still has eight titles listed in `features/README.md`. If `src/data/projects.ts` changed, update the counts in this file before asserting them.

- **Open projects.** Go to `/projects`. Run `await page.setViewportSize({ width: 1440, height: 1000 })` then `await page.goto("/projects")`. Heading level 1 is `Projects`. Title is `Projects | Steve Defendre`.
- **All state.** Text `Showing 8 of 8 projects` is visible. Role `article` count is `8`. Button `All` has `aria-pressed=true`. The other three filter buttons are `false`. URL has no `category` query.
- **Client filter.** Choose `Client`. Run `page.getByRole("button", { name: "Client", exact: true }).click()`. Text `Showing 3 Client projects` is visible. Role `article` count is `3`. Visible titles are BraidsbyRose, Krystin Sylvia, and Velocity Care LLC. Wait for `page.waitForURL("**/projects?category=Client")` before reading the address bar. Button `Client` is `aria-pressed=true`.
- **URL entry.** Run `page.goto("/projects?category=Client")` on a fresh load. The Client chip is pressed and the same three articles render without another click.
- **Studio filter.** Choose `Studio`. Run `page.getByRole("button", { name: "Studio", exact: true }).click()`. Text `Showing 1 Studio project` is visible. One article remains, titled Defendre Solutions. URL is `/projects?category=Studio`.
- **Product filter.** Choose `Product`. Run `page.getByRole("button", { name: "Product", exact: true }).click()`. Text `Showing 4 Product projects` is visible. Titles are FreeVoiceTranscribe, Traces, WealthWise, and Command.AI. URL is `/projects?category=Product`.
- **Reset.** Choose `All`. Run `page.getByRole("button", { name: "All", exact: true }).click()`. Count text, article count, and URL return to the All state.
- **Case study.** With Client pressed, open the first `details`. Run `page.locator("details").first().locator("summary").click()`. That `details` has attribute `open`. Text `Challenge`, `Approach`, and `Impact` is visible inside it. The first Client case study belongs to BraidsbyRose.
- **Scripted path.** Run `npx playwright test e2e/projects.spec.ts --project=chromium`. That spec clicks Client, asserts the three-article count, and opens the first case study. It does not assert the `?category=` URL. If you use only this spec, also read `page.url()` after the click and record `/projects?category=Client`.
- **Prototype honesty.** Run `npx playwright test e2e/accessibility.spec.ts --project=chromium -g "prototype preview"`. Traces and WealthWise show `project-status` text `Prototype`. Image alts are `Preview of the Traces project` and `Preview of the WealthWise project`. Those alts do not contain `live`.
- **Proof.** Capture the Client filtered view. Save `evidence/projects/client.aria.txt` or the Playwright output, plus a screenshot that shows `Showing 3 Client projects`, three articles, and an open case study. Record the URL in the same folder.

## Gotchas

- The live region and article count update before `router.replace` writes `?category=`. Wait for the URL. Reading `page.url()` on the next line still sees `/projects`.
- Filter buttons share names with category chips on each card. Use `getByRole("button", { name: "Client", exact: true })`, not `getByText("Client")`.
- Count copy is singular for one match: `Showing 1 Studio project`. Do not assert `projects` on Studio.
- `?category=` is case-sensitive. `client` or `CLIENT` parses as All.
- `/projects` HTML from curl can miss the count string. The explorer sits behind `Suspense` for `useSearchParams`. Assert counts in a hydrated browser.
- Case study summary visible text is `Challenge, approach, and impact`. The title is in an `.sr-only` span. The accessible name includes `for {title}`.
- Project cards are whole-card links to other origins. Opening `Visit studio for Defendre Solutions (opens in new tab)` leaves this app. Stay on `/projects` for filter and case-study proof.
- WebMCP `filter-projects` navigates to the same `?category=` URLs. Using the tool is not clicking the chip. Prove the chip or the typed URL.
- Empty-state copy `Nothing in {category} right now` only appears if a category has zero rows. The current catalog has at least one in each chip. Do not invent a fourth category.
