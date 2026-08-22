import { expect, type Page } from "@playwright/test";

export async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    )
    .toBe(true);
}

export async function expectSingleVisiblePrimaryNavigation(page: Page) {
  const navigations = page.locator('nav[aria-label="Primary navigation"]');

  await expect(navigations).toHaveCount(2);
  await expect
    .poll(() =>
      navigations.evaluateAll((elements) =>
        elements.filter((element) => {
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
        }).length,
      ),
    )
    .toBe(1);
}

export async function expectHeadingClearOfNavigation(page: Page, headingName: string) {
  const navigation = page.locator('nav[aria-label="Primary navigation"]:visible');
  const heading = page.getByRole("heading", { name: headingName, exact: true });

  await expect(navigation).toHaveCount(1);
  await expect(heading).toBeVisible();

  const navigationBox = await navigation.boundingBox();
  const headingBox = await heading.boundingBox();

  expect(navigationBox).not.toBeNull();
  expect(headingBox).not.toBeNull();

  if (!navigationBox || !headingBox) {
    return;
  }

  const navigationIsAboveHeading = navigationBox.y < headingBox.y;
  const hasVerticalSeparation = navigationIsAboveHeading
    ? navigationBox.y + navigationBox.height <= headingBox.y
    : headingBox.y + headingBox.height <= navigationBox.y;

  expect(hasVerticalSeparation).toBe(true);
}
