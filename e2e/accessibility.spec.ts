import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, interceptMailtoDrafts } from "./helpers";

test("new-tab links disclose the context change without changing visible copy", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto("/about");

  const githubLink = page.getByRole("link", {
    name: "GitHub (opens in a new tab)",
  });
  await expect(githubLink).toBeVisible();
  await expect(githubLink).toHaveAttribute("target", "_blank");
  await expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

  const studioLinks = page.getByRole("link", {
    name: "Defendre Solutions (opens in a new tab)",
  });
  await expect(studioLinks).toHaveCount(3);
  await expect(studioLinks.nth(1)).toHaveText("Defendre Solutions");
});

test("prototype preview text does not claim a live deployment", async ({ page }) => {
  await page.goto("/projects");

  const tracesCard = page.getByRole("article").filter({ hasText: "Traces" });
  await expect(tracesCard.getByTestId("project-status")).toHaveText("Prototype");
  await expect(
    tracesCard.getByAltText("Preview of the Traces project"),
  ).toBeVisible();
  await expect(tracesCard.locator("img")).not.toHaveAttribute("alt", /live/i);

  const wealthwiseCard = page.getByRole("article").filter({ hasText: "WealthWise" });
  await expect(wealthwiseCard.getByTestId("project-status")).toHaveText("Prototype");
  await expect(
    wealthwiseCard.getByAltText("Preview of the WealthWise project"),
  ).toBeVisible();
  await expect(wealthwiseCard.locator("img")).not.toHaveAttribute("alt", /live/i);
});

test("keyboard users can reveal and activate the skip link", async ({ page }, testInfo) => {
  await page.goto("/about");

  await page.keyboard.press(testInfo.project.name === "webkit" ? "Alt+Tab" : "Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator("#main-content")).toBeFocused();
});

test("noncritical navigation and project images stay lazy and low priority", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const hiddenNavigationAvatar = page.locator('img[alt="Steve Defendre"]');
  await expect(hiddenNavigationAvatar).toHaveAttribute("loading", "lazy");
  await expect(hiddenNavigationAvatar).toHaveAttribute("fetchpriority", "low");

  await page.goto("/projects");
  const tracesPreview = page.getByAltText("Preview of the Traces project");
  await expect(tracesPreview).toHaveAttribute("loading", "lazy");
  await expect(tracesPreview).not.toHaveAttribute("fetchpriority", "high");

  await page.goto("/about");
  const sidebarAvatar = page.locator('img[alt="Steve Defendre"]');
  await expect(sidebarAvatar).toHaveAttribute("loading", "lazy");
  await expect(sidebarAvatar).not.toHaveAttribute("fetchpriority", "high");
});

test("keeps an oversized draft invalid until a contributing field makes it fit", async ({ page }, testInfo) => {
  await interceptMailtoDrafts(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Ada");
  await page.getByLabel("Email address").fill("ada@example.com");
  await page.getByLabel("Project type").selectOption("portfolio-refresh");
  await page.getByLabel("Budget range").selectOption("under-5k");
  const message = page.getByRole("textbox", { name: "Message", exact: true });
  await message.fill("🙂".repeat(200));
  await page.getByRole("button", { name: "Prepare email draft" }).click();
  await expect(message).toBeFocused();
  await expect(message).toHaveAttribute("aria-invalid", "true");
  await message.press("Tab");
  await testInfo.attach("overflow-after-unchanged-blur", {
    body: await page.screenshot({ fullPage: true }),
    contentType: "image/png",
  });
  await expect(message).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("alert")).toHaveText("Check the highlighted fields and try again.");
  await message.fill("🙂".repeat(138));
  await expect(message).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Your name").fill("Amy");
  await expect(message).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("alert")).toBeVisible();
  expect(await page.evaluate(() =>
    (window as Window & { __interceptedMailtoHrefs?: string[] }).__interceptedMailtoHrefs,
  )).toEqual([]);

  await page.getByLabel("Project type").selectOption("new-website");
  await expect(message).toHaveAttribute("aria-invalid", "false");
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByLabel("Your name")).toHaveAccessibleDescription(/draft body/i);
  await page.getByRole("button", { name: "Prepare email draft" }).click();
  await expect(page.locator("form").getByRole("status")).toContainText("Nothing was sent.");
  const drafts = await page.evaluate(() =>
    (window as Window & { __interceptedMailtoHrefs?: string[] }).__interceptedMailtoHrefs,
  );
  expect(drafts).toHaveLength(1);
  expect(drafts![0].length).toBeLessThanOrEqual(2000);
  expect(new URL(drafts![0]).searchParams.get("body")).toContain("Name: Amy");
  await expectNoHorizontalOverflow(page);
});
