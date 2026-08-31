import { expect, test, type Locator } from "@playwright/test";

const viewports = [
  { name: "narrow mobile", width: 320, height: 568 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop handoff", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 1000 },
] as const;

async function expectWordsToStayIntact(heading: Locator) {
  const wordLineCounts = await heading.evaluate((element) => {
    const textNode = element.firstChild;

    if (!(textNode instanceof Text)) {
      return [];
    }

    return Array.from(textNode.data.matchAll(/\S+/g), (match) => {
      const range = document.createRange();
      const start = match.index ?? 0;
      range.setStart(textNode, start);
      range.setEnd(textNode, start + match[0].length);

      return new Set(
        Array.from(range.getClientRects(), (rect) => Math.round(rect.top)),
      ).size;
    });
  });

  expect(wordLineCounts.length).toBeGreaterThan(0);
  expect(wordLineCounts).toEqual(wordLineCounts.map(() => 1));
}

test.describe("responsive home project titles", () => {
  for (const viewport of viewports) {
    test(`${viewport.name} keeps project names intact`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);

      const selectedWork = page.locator(
        'section[aria-labelledby="selected-work-heading"]',
      );

      for (const title of [
        "Defendre Solutions",
        "FreeVoiceTranscribe",
        "BraidsbyRose",
        "Traces",
      ]) {
        await expectWordsToStayIntact(
          selectedWork.getByRole("heading", { name: title, exact: true }),
        );
      }
    });
  }
});
