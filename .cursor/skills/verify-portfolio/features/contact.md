# Contact

Contact is the inquiry page at `/contact`. A visitor copies the studio email, sees required-field errors, and prepares a `mailto:` draft that does not send a message.

## Sub-features

- `contact-load` shows the inquiry heading and the studio address.
- `contact-validate` marks every required field invalid when Prepare email draft is used on an empty form.
- `contact-copy` copies `steve@defendresolutions.com` and announces Copied.
- `contact-draft` fills the form, prepares a draft, and builds a mailto URL without sending.
- `contact-secondary` exposes GitHub, LinkedIn, and Defendre Solutions as new-tab links.

## How to get to it (user POV)

- Open `/contact` directly.
- Choose `Contact` in the desktop dock or the mobile dock.
- From home or the desktop dock, choose `Start a project`.
- Choose `Email Steve` to open a bare mailto. That path skips the form.

## Driving it with Playwright

Preconditions:

- Doctor reports `doctor: OK` for this `RUN_ID`.
- `PLAYWRIGHT_TEST_BASE_URL` equals this run's `BASE_URL`.
- Viewport `390×844` for the scripted form specs. Desktop is fine for reading the page.
- Clipboard read/write granted when proving copy. The contact spec does `context.grantPermissions(["clipboard-read", "clipboard-write"])`.
- Mailto clicks are intercepted. Do not let a mail app send mail. Reuse the `HTMLAnchorElement.prototype.click` stub in `e2e/contact.spec.ts`.

- **Open contact.** Go to `/contact`. Run `await page.goto("/contact")`. Title is `Contact Steve Defendre | Project inquiries`. Heading level 1 is `Tell me what you need built.` The address `steve@defendresolutions.com` is visible.
- **Empty submit.** Choose `Prepare email draft` with empty fields. Run `page.getByRole("button", { name: "Prepare email draft" }).click()`. Alert text is `Check the highlighted fields and try again.` Labels `Your name`, `Email address`, `Project type`, `Budget range`, and `Message` each have `aria-invalid=true`.
- **Copy email.** Choose `Copy email`. Run `page.getByRole("button", { name: "Copy email" }).click()`. The button name becomes `Copied`. Status text is `steve@defendresolutions.com copied to clipboard.` `navigator.clipboard.readText()` returns that address.
- **Fill draft.** Use the same fixture as `e2e/contact.spec.ts`. Run `page.getByLabel("Your name").fill("Ada Lovelace")`, `page.getByLabel("Email address").fill("ada@example.com")`, `page.getByLabel("Project type").selectOption("new-website")`, `page.getByLabel("Budget range").selectOption("5k-10k")`, `page.getByLabel("Message").fill("A proof-led site & launch plan? Yes.")`.
- **Prepare draft.** Choose `Prepare email draft` again. The button name becomes `Preparing draft` and status text is `Preparing your email draft.` After that, status contains `Email draft requested.`, `Nothing was sent.`, and `If no mail app opened, use Email Steve or copy the address above.`
- **Mailto body.** The intercepted href protocol is `mailto:`, pathname is `steve@defendresolutions.com`, `subject` is `Project inquiry: New website`, and `body` contains `Name: Ada Lovelace` plus `A proof-led site & launch plan? Yes.`
- **Scripted path.** Run `npx playwright test e2e/contact.spec.ts --project=chromium`. That file covers validation, copy, metadata, and the intercepted draft.
- **Secondary links.** Role `link` names include `GitHub (opens in a new tab)`, `LinkedIn (opens in a new tab)`, and `Defendre Solutions (opens in a new tab)`. Visible host text includes `github.com/Sdefendre` and `defendresolutions.com`.
- **Proof.** Save the Playwright log for `e2e/contact.spec.ts` into `evidence/contact/`. If you drive by hand, keep a screenshot of the validation alert and a text file with the intercepted mailto URL. Never keep a sent message, because nothing should have been sent.

## Gotchas

- The form is `noValidate`. Browser native bubbles are not the proof. Wait for the on-page alert and `aria-invalid`.
- Message must be at least 10 characters after trim. A shorter string stays on the validation path with `Add a bit more detail so I can prepare the draft.`
- `Preparing draft` lasts about 300ms. Assert that name immediately after click, then wait for the ready status. A fixed sleep is the wrong signal.
- `Email Steve` is a bare mailto with no subject. Proving it without an intercept can open a real mail composer. Prefer the form path and the spec stub.
- Copy needs a clipboard. Headless or permission-denied runs show `Try copy again` and an alert that starts with `Copy attempt`. That is a failed copy, not proof.
- Support in the studio footer is named `Support Defendre Solutions`. It is optional and not required for a contact proof.
- `open-contact` WebMCP only opens `/contact` and returns the email. It does not fill or send the form. Do not treat a tool payload as a prepared draft.
