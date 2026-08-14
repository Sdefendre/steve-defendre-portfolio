import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import { staticHomeFontCss, verifyStaticHomeFonts } from "./static-home-fonts.mjs";

export async function currentCss() {
  verifyStaticHomeFonts();
  const result = await postcss([tailwind()]).process(readFileSync("src/app/globals.css", "utf8"), { from: "src/app/globals.css" });
  const content = Buffer.from(`${staticHomeFontCss}${result.css}`);
  const hash = createHash("sha256").update(content).digest("hex").slice(0, 16);
  return { content, hash, publicPath: `/static-home.${hash}.css` };
}
