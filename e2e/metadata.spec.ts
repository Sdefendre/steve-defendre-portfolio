import { expect, test } from "@playwright/test";

const previewImagePath = "/project-previews/defendre-solutions.jpg";
const previewImageAlt = "Steve Defendre portfolio preview";

const routes = [
  {
    path: "/",
    title: "Steve Defendre | Full-stack developer",
    description:
      "Veteran-owned software studio. I build web apps, booking flows, and ops tools for small teams.",
  },
  {
    path: "/about",
    title: "About Steve Defendre | Veteran software builder",
    description:
      "Steve Defendre is a military veteran, CS graduate, and founder of Defendre Solutions. He builds software for small teams that need a usable product.",
  },
  {
    path: "/projects",
    title: "Projects | Steve Defendre",
    description:
      "Client sites, studio work, and products Steve Defendre has shipped, including booking, healthcare, and local tools.",
  },
  {
    path: "/contact",
    title: "Contact Steve Defendre | Project inquiries",
    description:
      "Email Steve Defendre about a software project, or find him on GitHub and LinkedIn.",
  },
] as const;

test.describe("social metadata", () => {
  for (const route of routes) {
    test(`${route.path} emits one consistent social image descriptor`, async ({ page }) => {
      await page.goto(route.path);

      await expect(page).toHaveTitle(route.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        route.description,
      );
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        "content",
        route.title,
      );
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
        "content",
        route.description,
      );
      await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
        "content",
        route.title,
      );
      await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
        "content",
        route.description,
      );

      const expectedTags = [
        ['meta[property="og:image"]', previewImagePath],
        ['meta[property="og:image:width"]', "1440"],
        ['meta[property="og:image:height"]', "900"],
        ['meta[property="og:image:alt"]', previewImageAlt],
        ['meta[name="twitter:image"]', previewImagePath],
        ['meta[name="twitter:image:alt"]', previewImageAlt],
      ] as const;

      for (const [selector, content] of expectedTags) {
        const tag = page.locator(selector);
        await expect(tag).toHaveCount(1);
        await expect(tag).toHaveAttribute(
          "content",
          content === previewImagePath ? new RegExp(`${previewImagePath}$`) : content,
        );
      }
    });
  }
});
