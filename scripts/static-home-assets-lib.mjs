import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveSiteUrl } from "../src/lib/site-url.mjs";
import { staticHomeFontClasses, staticHomeFontCss, verifyStaticHomeFonts } from "./static-home-fonts.mjs";

const inputFiles = [
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.ts",
  "postcss.config.mjs",
  "scripts/check-static-home-assets.mjs",
  "scripts/check-static-home-runtime.mjs",
  "scripts/render-static-home.tsx",
  "scripts/static-home-assets-lib.mjs",
  "scripts/static-home-fonts.mjs",
  "scripts/sync-static-home-assets.mjs",
];

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function filesIn(root, directory) {
  const absoluteDirectory = join(root, directory);
  if (!existsSync(absoluteDirectory)) return [];
  return readdirSync(absoluteDirectory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    return entry.isDirectory() ? filesIn(root, path) : [path];
  });
}

/**
 * Hash all application source, rather than a manually maintained renderer
 * dependency list, so new transitive imports cannot silently leave HTML stale.
 * Generated outputs are excluded to avoid a circular hash.
 */
export function staticHomeInputFiles(root = process.cwd()) {
  const sources = filesIn(root, "src").filter((path) => !path.startsWith("src/generated/"));
  return [...inputFiles, ...sources, ...filesIn(root, "public/static-home/fonts"), ...filesIn(root, "public/project-previews"), "public/headshot.jpg"].sort();
}

export function staticHomeInputHash(root = process.cwd(), environment = process.env) {
  const hash = createHash("sha256");
  hash.update("canonical\0").update(resolveSiteUrl(environment).href).update("\0");
  for (const path of staticHomeInputFiles(root)) {
    const absolutePath = join(root, path);
    if (!existsSync(absolutePath)) throw new Error(`Static homepage input is missing: ${path}`);
    const content = readFileSync(absolutePath);
    hash.update(path).update("\0").update(String(content.length)).update("\0").update(content).update("\0");
  }
  return hash.digest("hex");
}

export function fileSha256(path) {
  return sha256(readFileSync(path));
}

export async function currentCss() {
  verifyStaticHomeFonts();
  const [{ default: postcss }, { default: tailwind }, { transform }] = await Promise.all([
    import("postcss"),
    import("@tailwindcss/postcss"),
    import("lightningcss"),
  ]);
  const result = await postcss([tailwind()]).process(readFileSync("src/app/globals.css", "utf8"), { from: "src/app/globals.css" });
  const content = transform({
    filename: "static-home.css",
    code: Buffer.from(`${staticHomeFontCss}${result.css}`),
    minify: true,
  }).code;
  const hash = sha256(content);
  return { content, hash, publicPath: `/static-home.${hash.slice(0, 16)}.css` };
}

/** Validate a rendered document before publishing it or accepting checked-in output. */
export function assertStaticHomeRuntime(html, cssPath) {
  if (!html.includes(`href="${cssPath}"`)) throw new Error("Static homepage HTML references stale CSS");
  if (!html.includes(staticHomeFontClasses)) throw new Error("Static homepage HTML is missing stable font classes");
  if (!html.includes('rel="stylesheet"') || !html.includes(cssPath)) throw new Error("Static homepage HTML is missing its committed stylesheet");
  if (html.includes("/_next/static/chunks") || (html.match(/<script/g) ?? []).length !== 1 || !html.includes('/_vercel/insights/script.js')) throw new Error("Static homepage must contain zero Next chunks and exactly one Insights script");
}
