import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

const EMAIL = "steve@defendresolutions.com";

test.describe("contact form", () => {
  test.beforeEach(async ({ context, page }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.addInitScript(() => {
      const nativeClick = HTMLAnchorElement.prototype.click;
      const interceptedMailtoHrefs: string[] = [];

      Object.defineProperty(window, "__interceptedMailtoHrefs", {
        configurable: true,
        value: interceptedMailtoHrefs,
      });

      HTMLAnchorElement.prototype.click = function click() {
        if (this.href.startsWith("mailto:")) {
          interceptedMailtoHrefs.push(this.href);
          return;
        }

        nativeClick.call(this);
      };
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contact");
  });

  test("shows required-field validation and copies the contact email", async ({ page }) => {
    await expect(page.getByText("Opens a draft in your email app. You review and send it.")).toBeVisible();
    await expect(page.getByText(/mailto:/i)).toHaveCount(0);
    await expect(page.getByLabel("Your name")).toHaveClass(/text-base/);

    await page.getByRole("button", { name: "Prepare email draft" }).click();

    await expect(page.getByText("Check the highlighted fields and try again.", { exact: true })).toBeVisible();
    for (const label of ["Your name", "Email address", "Project type", "Budget range", "Message"]) {
      await expect(page.getByLabel(label)).toHaveAttribute("aria-invalid", "true");
    }

    await page.getByRole("button", { name: "Copy email" }).click();
    await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
    await expect(page.getByText(`${EMAIL} copied to clipboard.`, { exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(EMAIL);
    await expectNoHorizontalOverflow(page);
  });

  test("renders complete route-specific and shared social metadata", async ({ page }) => {
    await expect(page).toHaveTitle("Contact Steve Defendre | Project inquiries");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Email Steve Defendre about a software project, or find him on GitHub and LinkedIn.",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/contact$/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Contact Steve Defendre | Project inquiries",
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      "content",
      "Email Steve Defendre about a software project, or find him on GitHub and LinkedIn.",
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", /\/contact$/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_US");
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      "Steve Defendre Portfolio",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/project-previews\/defendre-solutions\.jpg$/,
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      /\/project-previews\/defendre-solutions\.jpg$/,
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      "Contact Steve Defendre | Project inquiries",
    );
  });

  test("opens an encoded mailto draft without sending email", async ({ page }) => {
    await page.getByLabel("Your name").fill("Ada Lovelace");
    await page.getByLabel("Email address").fill("ada@example.com");
    await page.getByLabel("Project type").selectOption("new-website");
    await page.getByLabel("Budget range").selectOption("5k-10k");
    await page.getByLabel("Message").fill("A proof-led site & launch plan? Yes.");
    const draftStatus = page
      .locator("form")
      .filter({ has: page.getByLabel("Your name") })
      .getByRole("status");

    await page.getByRole("button", { name: "Prepare email draft" }).click();

    await expect(page.getByRole("button", { name: "Preparing draft" })).toBeVisible();
    await expect(draftStatus).toHaveText("Preparing your email draft.");

    await expect(draftStatus).toContainText("Email draft requested.");
    await expect(draftStatus).toContainText("Nothing was sent.");
    await expect(draftStatus).toContainText(
      "If no mail app opened, use Email Steve or copy the address above.",
    );

    const draftHref = await page.evaluate(() => {
      const values = (window as Window & { __interceptedMailtoHrefs?: string[] }).__interceptedMailtoHrefs;
      return values?.at(-1);
    });

    expect(draftHref).toBeDefined();
    const draft = new URL(draftHref as string);
    expect(draft.protocol).toBe("mailto:");
    expect(draft.pathname).toBe(EMAIL);
    expect(draft.searchParams.get("subject")).toBe("Project inquiry: New website");
    expect(draft.searchParams.get("body")).toContain("Name: Ada Lovelace");
    expect(draft.searchParams.get("body")).toContain("A proof-led site & launch plan? Yes.");
  });
});
