import { expect, test } from "@playwright/test";

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
