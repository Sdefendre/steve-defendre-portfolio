import { test } from "@playwright/test";
import {
  expectHeadingClearOfNavigation,
  expectNoHorizontalOverflow,
  expectSingleVisiblePrimaryNavigation,
} from "./helpers";

test.describe("responsive primary navigation", () => {
  for (const viewport of [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 1000 },
  ]) {
    test(`${viewport.name} uses one clear navigation handoff`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/projects");

      await expectSingleVisiblePrimaryNavigation(page);
      await expectHeadingClearOfNavigation(page, "Projects");
      await expectNoHorizontalOverflow(page);
    });
  }
});
