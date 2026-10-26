# Consent

Consent is the first-visit analytics bar on every page. A visitor reads the optional PostHog notice, then Accept or Decline. The choice stays on later loads. Nothing is required to use the site.

## Sub-features

- `consent-load` shows the Analytics consent bar on a first visit to `/`, `/about`, `/projects`, `/contact`, or a missing-page screen.
- `consent-decline` hides the bar and stores Decline.
- `consent-accept` hides the bar and stores Accept.
- `consent-persist` keeps the bar hidden after a reload in the same profile.

## How to get to it (user POV)

- Open `/`, `/about`, `/projects`, `/contact`, or a missing-page URL in a browser that has no stored choice.
- Reload after clearing the stored choice. The bar is not its own route.

## Driving it with Playwright

Preconditions:

- Doctor reports `doctor: OK` for this `RUN_ID`.
- `PLAYWRIGHT_TEST_BASE_URL` equals this run's `BASE_URL`.
- Use a fresh browser context. A leftover `portfolio-analytics-consent` value hides the bar before you can prove it.
- Viewport `1440×1000` for reading. `390×844` still shows the bar above the mobile dock.

- **First visit.** Go to `/` with a new context. Run `await page.goto("/")`. Role `complementary`, name `Analytics consent`, becomes visible. The copy includes `Optional analytics (PostHog) help me see how this site is used.` Buttons `Accept` and `Decline` are visible.
- **Decline.** Choose `Decline`. Run `page.getByRole("button", { name: "Decline" }).click()`. The complementary landmark is hidden. `localStorage` key `portfolio-analytics-consent` is `declined`.
- **Accept.** In a fresh context on `/about`, choose `Accept`. The bar hides and the stored value is `accepted`.
- **Persist.** Reload the same context. The bar stays hidden. A second complementary landmark named `Analytics consent` is not visible.
- **Same bar, other routes.** Repeat the first-visit check on `/projects`, `/contact`, and `/this-page-does-not-exist`. There is no `e2e/` spec for this path. Drive the roles above.
- **Production host.** On `https://steve-defendre-portfolio.vercel.app/` the same first-visit bar is visible. Prefer Decline there. Local proof of unpublished work still uses this run's `BASE_URL`.
- **Proof.** Save a first-visit screenshot and the stored value into `evidence/consent/`. Record which origin you drove.

## Gotchas

- Server HTML starts with the bar `hidden`. A curl of `/` will not show it. Wait for the complementary landmark after load.
- The bar is not a dialog. Query `getByRole("complementary", { name: "Analytics consent" })`, then the `Accept` and `Decline` buttons.
- A stored choice from an earlier run hides the bar. Use a new context, or clear `portfolio-analytics-consent`, before calling the path unreachable.
- Local launch without `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` still shows the bar. Accept hides it and does not load a tracker. Do not treat a missing PostHog network call as a failed click.
- Production home injects a configured host into the static document. Site routes still show the same bar. Visitor proof is the hide and the stored value, not a PostHog request.
- On `390×844` the bar sits above the mobile dock. Do not click Accept or Decline as a stand-in for Home, About, Projects, or Contact.
