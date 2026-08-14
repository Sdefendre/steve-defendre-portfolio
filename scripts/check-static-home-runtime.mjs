import { readFileSync } from "node:fs";
import { staticHomeFontClasses } from "./static-home-fonts.mjs";

const manifest = readFileSync("src/generated/static-home-assets.ts", "utf8");
const staticHomeCss = JSON.parse(manifest.match(/staticHomeCss = ("[^"]+")/)?.[1] ?? "");
const staticHomeHtml = JSON.parse(manifest.match(/staticHomeHtml = ("[^"]+")/)?.[1] ?? "");
if (!staticHomeCss || !staticHomeHtml) throw new Error("Static homepage asset manifest is incomplete");
const html = readFileSync(`public${staticHomeHtml}`, "utf8");
if (!html.includes(`href="${staticHomeCss}"`)) throw new Error("Static homepage HTML references stale CSS");
if (!html.includes(staticHomeFontClasses)) throw new Error("Static homepage HTML is missing stable font classes");
if (html.includes("/_next/static/chunks") || (html.match(/<script/g) ?? []).length !== 1 || !html.includes('/_vercel/insights/script.js')) throw new Error("Static homepage must contain zero Next chunks and exactly one Insights script");
console.log("Verified static homepage runtime invariants");
