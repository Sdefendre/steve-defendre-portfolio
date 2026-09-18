import { readFileSync } from "node:fs";
import { assertStaticHomeRuntime } from "./static-home-assets-lib.mjs";

const manifest = readFileSync("src/generated/static-home-assets.ts", "utf8");
const staticHomeCss = JSON.parse(manifest.match(/staticHomeCss = ("[^"]+")/)?.[1] ?? "");
const staticHomeHtml = JSON.parse(manifest.match(/staticHomeHtml = ("[^"]+")/)?.[1] ?? "");
if (!staticHomeCss || !staticHomeHtml) throw new Error("Static homepage asset manifest is incomplete");
const html = readFileSync(`public${staticHomeHtml}`, "utf8");
assertStaticHomeRuntime(html, staticHomeCss);
console.log("Verified static homepage runtime invariants");
