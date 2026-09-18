import { expect, test } from "@playwright/test";

const preview = "/project-previews/defendre-solutions.jpg";

test("the optimizer returns a resized WebP that the browser can decode", async ({
  request,
  page,
}) => {
  const response = await request.get("/_next/image", {
    params: { url: preview, w: "640", q: "75" },
    headers: { Accept: "image/webp" },
  });

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("image/webp");

  // Decode the actual optimizer response, rather than checking only its headers.
  const body = await response.body();
  await page.setContent(
    `<img alt="Optimized project preview" src="data:image/webp;base64,${body.toString("base64")}">`,
  );
  const image = page.getByRole("img", { name: "Optimized project preview" });
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => ({
    complete: element.complete,
    width: element.naturalWidth,
    height: element.naturalHeight,
  }))).toEqual({ complete: true, width: 640, height: 400 });
});

test("the optimizer rejects a source outside the remote image allowlist", async ({ request }) => {
  const response = await request.get("/_next/image", {
    params: { url: "https://example.com/untrusted.jpg", w: "640", q: "75" },
  });

  expect(response.status()).toBe(400);
  expect(await response.text()).toContain('"url" parameter is not allowed');
});

test("the optimizer rejects an unsupported resize width", async ({ request }) => {
  const response = await request.get("/_next/image", {
    params: { url: preview, w: "13", q: "75" },
  });

  expect(response.status()).toBe(400);
  expect(await response.text()).toContain('"w" parameter (width) of 13 is not allowed');
});
