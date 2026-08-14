import { readFileSync } from "node:fs";
import { currentCss } from "./static-home-assets-lib.mjs";

const asset = await currentCss();
const publicContent = readFileSync(`public${asset.publicPath}`);
if (!publicContent.equals(asset.content)) throw new Error("Static homepage CSS content is stale; run npm run sync:static-home");
const manifest = readFileSync("src/generated/static-home-assets.ts", "utf8");
if (!manifest.includes(JSON.stringify(asset.publicPath)) || !manifest.includes(JSON.stringify(asset.hash))) {
  throw new Error("Static homepage asset manifest is stale; run npm run sync:static-home");
}
const htmlPath = manifest.match(/staticHomeHtml = ("[^"]+")/)?.[1];
if (!htmlPath) throw new Error("Static homepage HTML manifest entry is missing");
console.log(`Verified fresh ${asset.publicPath} and checked-in static homepage fonts`);
