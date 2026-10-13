import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow } from "./helpers";

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`visual layout preserves previews and content at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const work = page.getByRole("region", { name: "A few I shipped." });
    const preview = work.getByAltText("Preview of the Defendre Solutions project");
    const box = await preview.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width / box!.height).toBeCloseTo(1.6, 1);
    if (width < 1024) {
      const cards = await work.getByRole("link").filter({ has: page.locator("img") }).all();
      const positions = await Promise.all(cards.map((card) => card.boundingBox()));
      for (let i = 1; i < positions.length; i++) {
        expect(positions[i]!.y).toBeGreaterThanOrEqual(positions[i - 1]!.y + positions[i - 1]!.height);
        expect(positions[i]!.x).toBeCloseTo(positions[0]!.x, 0);
      }
    }
    await expectNoHorizontalOverflow(page);

    await page.goto("/projects");
    await page.evaluate(() => document.fonts.ready);
    const articles = page.getByRole("article");
    await expect(articles).toHaveCount(8);
    for (const article of await articles.all()) {
      await expect(article.getByTestId("project-status")).toHaveCount(1);
      const description = article.locator("a p").first();
      expect(await description.evaluate((el) => el.scrollHeight <= el.clientHeight + 1)).toBe(true);
    }
    if (width >= 1280) {
      const summaries = await Promise.all([0, 1].map((index) => articles.nth(index).locator("summary").boundingBox()));
      expect(summaries[0]!.y).toBeCloseTo(summaries[1]!.y, 0);
    }
    await expectNoHorizontalOverflow(page);
  });
}

test("mobile leads with the message and tablet retains navigation labels", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const cta = await page.getByRole("main").getByRole("link", { name: "Start a project", exact: true }).boundingBox();
  const dock = await page.getByRole("navigation", { name: "Primary navigation" }).filter({ visible: true }).boundingBox();
  expect(cta!.y + cta!.height).toBeLessThan(dock!.y);
  await page.goto("/about");
  const heading = await page.getByRole("heading", { level: 1 }).boundingBox();
  const portrait = await page.getByAltText("Steve Defendre, founder of Defendre Solutions").boundingBox();
  expect(heading!.y).toBeLessThan(portrait!.y);
  await page.setViewportSize({ width: 768, height: 1024 });
  for (const name of ["Home", "About", "Projects", "Contact"]) {
    await expect(page.getByRole("navigation", { name: "Primary navigation" }).filter({ visible: true }).getByRole("link", { name, exact: true }).locator("span")).toBeVisible();
  }
  await expectNoHorizontalOverflow(page);
});
