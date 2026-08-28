---
name: verify-portfolio
description: Drive the Steve Defendre portfolio web UI (/, /about, /projects, /contact) the way a visitor does. Use when proving a local UI change, checking launch health, or capturing evidence that filters, case studies, navigation, or the contact draft still work.
---

# Verify portfolio

This is the control skill for the Steve Defendre portfolio, a public Next.js 16 site. A visitor uses four pages and a pair of navs. There is no login, no database, and no server-side form submit. Read `features/README.md` before you drive anything, then follow the matching feature file.

Live production is `https://steve-defendre-portfolio.vercel.app`. That URL is not a local proof of unpublished changes. Drive the instance this run launched.

## Launch

Use the production server Playwright already expects. README `npm run dev` on port 3000 is the human quickstart. Do not attach to it unless this run started it.

```bash
RUN_ID=your-run-id
.cursor/skills/verify-portfolio/helpers/launch.sh "$RUN_ID"
```

Optional second argument sets the port. Default is `3100` on `127.0.0.1`, which matches `playwright.config.ts` (`PLAYWRIGHT_TEST_BASE_URL` defaults to `http://127.0.0.1:3100`).

What launch does:

1. Creates `/tmp/portfolio-verify-$RUN_ID/` and `evidence/` under it.
2. Refuses if this `RUN_ID` already has a live pid, or if the chosen port is listening for anyone else.
3. Runs `npm install` when `node_modules` is missing.
4. Runs `npm run build` when `.next` is missing. Set `PORTFOLIO_VERIFY_REBUILD=1` after product-file changes so `next start` is not serving a stale bundle.
5. Starts `npm run start -- --hostname 127.0.0.1 --port $PORT` and waits until `GET /` returns HTTP 200, up to 60s.

Ready means launch printed `BASE_URL=` and `GET $BASE_URL/` is 200. The homepage title is `Steve Defendre | Full-stack developer`. Server stdout is `$RUN_DIR/server.log`.

Two instances can share a machine. Give each its own `RUN_ID` and port. There is no shared writable data. The catalog is `src/data/projects.ts`. Contact does not persist.

Do not start a second copy on a port you did not check. If `3100` is busy, use `3101` and set `PLAYWRIGHT_TEST_BASE_URL` to that origin before any Playwright command.

Teardown is Cleanup below. Launch does not kill strangers on the port.

## Doctor

Run this first whenever the instance looks wrong, before you blame the feature.

```bash
.cursor/skills/verify-portfolio/helpers/doctor.sh "$RUN_ID"
```

Pass means:

- `instance.env` exists for this `RUN_ID`
- `START_PID` is alive
- `LISTEN_PID` still owns `$PORT`
- `GET` `/`, `/about`, `/projects`, `/contact` each return 200
- those four documents have the titles in `e2e/metadata.spec.ts`
- home HTML includes `I build software you can keep.`

Fail means stop driving. Relaunch this `RUN_ID` after Cleanup, or pick a new `RUN_ID` and port. Do not point the browser at a listener doctor did not accept.

`/projects` count text (`Showing 8 of 8 projects`) is rendered after hydration. Doctor uses curl, so it does not assert that string. Assert it in Drive after the page is interactive.

## Drive

Harness is Playwright in `e2e/`, plus any browser that can click the same roles. Prefer the existing specs when they cover the path. Prefer roles, accessible names, and routes over CSS, coordinates, or tab counts.

Stable handles from this repo:

| What | Handle |
| --- | --- |
| Primary nav (desktop dock and mobile dock) | `nav[aria-label="Primary navigation"]`. Two nodes are always in the DOM. Exactly one is visible. |
| Home / About / Projects / Contact | Role `link`, name `Home`, `About`, `Projects`, `Contact`. Desktop site-layout links also set `aria-label` to those names. |
| Skip link | Role `link`, name `Skip to content`. First Tab (Alt+Tab on WebKit). Lands on `#main-content`. |
| Home H1 | Role `heading` level 1, name `I build software you can keep.` |
| Home CTAs | Role `link`, name `Start a project` → `/contact`. Name `View projects` → `/projects`. Name `View the full project list` → `/projects`. |
| About H1 | Role `heading` level 1, name `About me` |
| Projects H1 | Role `heading` level 1, name `Projects` |
| Project filters | Role `group`, name `Project category filters`. Buttons `All`, `Studio`, `Client`, `Product` with `aria-pressed`. |
| Filter status | `aria-live="polite"` text. All: `Showing 8 of 8 projects`. Client: `Showing 3 Client projects`. |
| Filter URL | All: `/projects`. Client: `/projects?category=Client`. Studio and Product follow the same `?category=` shape. Unknown values parse as All. |
| Project cards | Role `article`. Card links use `aria-label` `{ctaLabel} for {title} (opens in new tab)`. |
| Case study | First `details` on the visible list. Summary accessible name includes `Challenge, approach, and impact for {title}`. Open state has `open`. Then exact text `Challenge`, `Approach`, `Impact`. |
| Contact H1 | Role `heading` level 1, name `Tell me what you need built.` |
| Contact fields | Labels `Your name`, `Email address`, `Project type`, `Budget range`, `Message` |
| Prepare draft | Role `button`, name `Prepare email draft`. Busy name is `Preparing draft`. |
| Copy email | Role `button`, name `Copy email`, then `Copied`. Status text `steve@defendresolutions.com copied to clipboard.` |
| Email Steve | Role `link`, name `Email Steve`. `mailto:steve@defendresolutions.com` |

Scripted entry. From the repo root, against the instance you launched:

```bash
export PLAYWRIGHT_TEST_BASE_URL="$BASE_URL"
npx playwright test e2e/projects.spec.ts --project=chromium
```

Install Chromium once if the runner says the browser is missing: `npx playwright install chromium`.

`npm run test:e2e` runs the whole folder. Chromium runs every spec. Firefox and WebKit only run `e2e/accessibility.spec.ts`. Config sets `workers: 1` and `reuseExistingServer: true` when `CI` is unset. Leave `CI` unset so Playwright reuses `$BASE_URL` instead of spawning another `next start`.

Interactive entry. Open `$BASE_URL` at 1440×1000 unless the feature file names another viewport. Click the roles above. Do not call `document.modelContext` tools (`list-projects`, `filter-projects`, `navigate`, `open-contact`, `get-about`) as a substitute for the visitor path. Those tools exist only when the browser implements WebMCP. They are not in `e2e/`. A tool result is not UI proof.

Home `/` is a hashed static HTML rewrite (`/` → `/static-home-internal`). Nav and WebMCP send a full document load for `/`. Do not expect a client transition onto home.

Project cards and studio links open other origins in a new tab. Stay on this origin for proof, except when a feature file says to read an attribute.

Never submit a real email. The contact form only opens a `mailto:` draft. Intercept that click the way `e2e/contact.spec.ts` does, or stop after the on-page status `Email draft requested. Nothing was sent.`

## Evidence

Put proof in `/tmp/portfolio-verify-$RUN_ID/evidence/`. Launch creates that directory. Cleanup must not delete it.

Minimum for a feature proof:

1. Record `RUN_ID`, `BASE_URL`, feature file, and the entry point you used (`e2e/projects.spec.ts`, the `Client` chip, and so on).
2. Capture the action and the state after it. A final screenshot alone is not enough.
3. Exercise the visitor path. Do not set React state from the console. Do not treat WebMCP output as the user journey.
4. Keep side effects honest. Contact does not write a server row. Proof is the validation text, the clipboard value, or the intercepted `mailto:` URL. Copy the Playwright spec log or a screenshot named for the step into `evidence/`.
5. After a filter, keep the live region text, the `article` count, and the URL.
6. After a case study open, keep the `open` attribute and the Challenge / Approach / Impact text.
7. Do not mock the portfolio. The only production boundary you may stub is the mail-app handoff, matching `e2e/contact.spec.ts`.

Useful capture commands once `$BASE_URL` is healthy:

```bash
EVIDENCE="/tmp/portfolio-verify-$RUN_ID/evidence"
curl -fsS "$BASE_URL/projects" -o "$EVIDENCE/projects.initial.html"
npx playwright test e2e/projects.spec.ts --project=chromium --output "$EVIDENCE/playwright-output"
```

Playwright also writes `playwright-report/` and `test-results/` in the repo. Those paths are gitignored and get overwritten. Copy anything you need into `evidence/` before you leave the run.

Proof standards:

- Real path, not an internal setter
- Action plus result
- Visible UI plus URL / clipboard / mailto when that is the effect
- Record skips with the command you ran and the precondition that failed. Do not mark a skipped entry point verified by a different path.

## Cleanup

```bash
.cursor/skills/verify-portfolio/helpers/cleanup.sh "$RUN_ID"
```

This kills only `START_PID` and `LISTEN_PID` from that run's `instance.env`, then deletes `instance.env`. It does not `pkill next`, does not free other ports, and does not remove `/tmp/portfolio-verify-$RUN_ID/evidence/`.

After cleanup, `ls /tmp/portfolio-verify-$RUN_ID/evidence` must still list the artifacts. A cleanup that ate the proof failed.

If a launch or drive fails halfway, run this same cleanup for that `RUN_ID` before the next attempt so you do not strand a listener on `3100`.

## Helpers

All three scripts are executable. Invoke them from the repo root with a literal `RUN_ID`.

```bash
.cursor/skills/verify-portfolio/helpers/launch.sh skill-proof-1
.cursor/skills/verify-portfolio/helpers/doctor.sh skill-proof-1
.cursor/skills/verify-portfolio/helpers/cleanup.sh skill-proof-1
```

| Script | What it does |
| --- | --- |
| `helpers/launch.sh RUN_ID [PORT]` | Isolated `next start`, writes `/tmp/portfolio-verify-$RUN_ID/instance.env` |
| `helpers/doctor.sh RUN_ID` | Read-only pid, port, and title check |
| `helpers/cleanup.sh RUN_ID` | Stops those pids. Keeps evidence. |
| `helpers/lib.sh` | Shared functions. Source only. |

`launch.sh` prints `BASE_URL` and `EVIDENCE_DIR`. Export `PLAYWRIGHT_TEST_BASE_URL` from that `BASE_URL` before Playwright. Feature recipes live under `features/`.
