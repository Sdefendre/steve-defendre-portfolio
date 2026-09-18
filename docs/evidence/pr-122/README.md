# PR #122 visual evidence: contact draft overflow validation

Before/After proof that an oversized encoded contact draft keeps its Message
error and validation alert after an unchanged blur, and that the name hint
describes the email draft body.

| File | Source | Commit |
| --- | --- | --- |
| `before-production-contact-overflow-1280.png` | Production, `https://steve-defendre-portfolio.vercel.app/contact` | `fad1ab8` (main at capture time) |
| `after-pr122-contact-overflow-1280.png` | Local `next start` of the PR head, `http://127.0.0.1:3100/contact` | `c72ba0f` |

Capture: Playwright driving Google Chrome (headless), viewport 1280x1400,
`deviceScaleFactor: 1`, clipped to the contact form column. Same steps on both
origins: Your name `Ada`, Email `ada@example.com`, Project type `New website`,
Budget `Under $5k`, Message = U+1F642 repeated 200 times (400 UTF-16 code units;
the encoded mailto URL exceeds `MAILTO_URL_MAX_LENGTH`), click
`Prepare email draft`, then Tab out of Message without changing it.
`HTMLAnchorElement.prototype.click` was stubbed for `mailto:` as in
`e2e/contact.spec.ts`; zero handoffs were recorded on either origin.

State after the unchanged blur:

| | Before (production) | After (PR head) |
| --- | --- | --- |
| Message `aria-invalid` | `false` | `true` |
| "Shorten your message..." error | absent | present |
| "Check the highlighted fields and try again." alert | absent | present |
| Name hint | "...in the subject line." | "...in the email draft body." |

Why After is a local build rather than the Vercel preview: the preview URL
(`steve-defendre-portfolio-git-codex-b-b16171-sdefendres-projects.vercel.app`)
is behind Vercel Authentication and redirects to `vercel.com/sso-api`. No
Vercel credential was available to the capturing agent and Deployment
Protection was left unchanged. The served bundle was checked to contain the
new hint copy and the `toWellFormed` feature-detect before capture.
