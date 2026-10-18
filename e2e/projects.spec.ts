import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

test("filters projects and reveals an inline case study", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/projects");

  await expect(page.getByText("Showing 8 of 8 projects")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(8);

  await page.getByRole("button", { name: "Client", exact: true }).click();
  await page.waitForURL("**/projects?category=Client");

  await expect(page.getByText("Showing 2 Client projects")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Client", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("button", { name: "Product", exact: true }).click();
  await page.waitForURL("**/projects?category=Product");
  await expect(page.getByText("Showing 5 Product projects")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(5);

  await page.goBack();
  await page.waitForURL("**/projects?category=Client");
  await expect(page.getByText("Showing 2 Client projects")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(2);
  await expect(page.getByRole("button", { name: "Client", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.goForward();
  await page.waitForURL("**/projects?category=Product");
  await expect(page.getByText("Showing 5 Product projects")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(5);
  await expect(page.getByRole("button", { name: "Product", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await page.getByRole("button", { name: "Client", exact: true }).click();
  await page.waitForURL("**/projects?category=Client");
  await expect(page.getByText("Showing 2 Client projects")).toBeVisible();

  const firstCaseStudy = page.locator("details").first();
  await firstCaseStudy.locator("summary").click();

  await expect(firstCaseStudy).toHaveAttribute("open", "");
  await expect(firstCaseStudy.getByText("Challenge", { exact: true })).toBeVisible();
  await expect(firstCaseStudy.getByText("Approach", { exact: true })).toBeVisible();
  await expect(firstCaseStudy.getByText("Impact", { exact: true })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
