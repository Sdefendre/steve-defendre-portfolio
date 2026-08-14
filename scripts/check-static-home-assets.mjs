import { readFileSync } from "node:fs";
import { currentCss, verifyMedia } from "./static-home-assets-lib.mjs";

const asset = currentCss();
verifyMedia(asset.content);
const publicContent = readFileSync(`public${asset.publicPath}`);
if (!publicContent.equals(asset.content)) throw new Error("Static homepage CSS content is stale; run npm run sync:static-home");
const manifest = readFileSync("src/generated/static-home-assets.ts", "utf8");
if (!manifest.includes(JSON.stringify(asset.publicPath)) || !manifest.includes(JSON.stringify(asset.hash))) {
  throw new Error("Static homepage asset manifest is stale; run npm run sync:static-home");
}
const htmlPath = manifest.match(/staticHomeHtml = ("[^"]+")/)?.[1];
if (!htmlPath) throw new Error("Static homepage HTML manifest entry is missing");
const html = readFileSync(`public${JSON.parse(htmlPath)}`, "utf8");
if (!html.includes(`href="${asset.publicPath}"`)) throw new Error("Static homepage HTML references stale CSS");
if (html.includes("/_next/static/chunks") || (html.match(/<script/g) ?? []).length !== 1 || !html.includes('/_vercel/insights/script.js')) throw new Error("Static homepage must contain zero Next chunks and exactly one Insights script");
console.log(`Verified ${asset.publicPath}, generated HTML, and all referenced font assets`);
