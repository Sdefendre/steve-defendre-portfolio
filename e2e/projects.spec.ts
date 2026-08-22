import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

test("filters projects and reveals an inline case study", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/projects");

  await expect(page.getByText("Showing 7 of 7 projects")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(7);

  await page.getByRole("button", { name: "Client", exact: true }).click();

  await expect(page.getByText("Showing 3 Client projects")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(3);

  const firstCaseStudy = page.locator("details").first();
  await firstCaseStudy.locator("summary").click();

  await expect(firstCaseStudy).toHaveAttribute("open", "");
  await expect(firstCaseStudy.getByText("Challenge", { exact: true })).toBeVisible();
  await expect(firstCaseStudy.getByText("Approach", { exact: true })).toBeVisible();
  await expect(firstCaseStudy.getByText("Impact", { exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
