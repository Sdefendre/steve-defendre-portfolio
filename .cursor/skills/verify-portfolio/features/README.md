# Portfolio verification map

This directory is the maintained source for verifying visitor-facing behavior of the Steve Defendre portfolio. Read this index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `.cursor/skills/verify-portfolio/helpers/launch.sh $RUN_ID`.
- Default origin is `http://127.0.0.1:3100`. A different port is fine when launch chose it.
- Run `.cursor/skills/verify-portfolio/helpers/doctor.sh $RUN_ID` and require `doctor: OK` plus the four route titles.
- Catalog source is `src/data/projects.ts`. Current titles in order: Defendre Solutions, FreeVoiceTranscribe, BraidsbyRose, Traces, WealthWise, Krystin Sylvia, Velocity Care LLC, Command.AI.
- Counts: All 8, Studio 1, Client 3, Product 4.
- Public email is `steve@defendresolutions.com`.
- Never drive an instance this run did not start.
- Never use the live Vercel host as proof of unpublished local work.

## Driving conventions

- Start every recipe from the baseline unless the feature file says otherwise.
- Prefer ARIA roles, accessible names, and routes. The home path `/` is static HTML. Other routes are App Router pages.
- Treat every command as literal. Keep quoted names and flags unchanged.
- Scripted proof goes through Playwright (`npx playwright test … --project=chromium`) with `PLAYWRIGHT_TEST_BASE_URL` set to this run's `BASE_URL`.
- Interactive proof uses the same roles in a browser at the viewport the feature names.
- Two nodes named `Primary navigation` exist on every page. Drive the visible one.
- Restore nothing after contact or filter work. There is no server state. Reload `/projects` if you need All again.
- Do not remove proof artifacts during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes the heading or live region, a screenshot or Playwright result, and the URL when the URL changes.
- Mutation on this site means clipboard text or an intercepted `mailto:` URL. There are no inserted rows.
- Record the feature ID and entry point used with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with Playwright` starts with `Preconditions:` and uses labeled bullets that pair each user action with an exact command and observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

Keep implementation details out of the map. Name only user paths, stable handles, required state, commands, and observable proof.

## Features

- [Home](./home.md) covers the static intro, selected work, and the two home CTAs.
- [About](./about.md) covers bio, how-I-build phases, skills, and skip-link focus.
- [Projects](./projects.md) covers category filters, the filtered URL, and an inline case study.
- [Contact](./contact.md) covers validation, copy-email, and the mailto draft that does not send.
