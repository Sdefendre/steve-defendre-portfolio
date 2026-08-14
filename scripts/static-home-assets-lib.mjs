import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const nextOutputRoots = [".next", ".vercel/output/static/_next"];

function currentOutputRoot() {
  for (const root of nextOutputRoots) {
    if (existsSync(join(root, "static", "chunks"))) return root;
  }

  throw new Error(
    `Could not find compiled Next static chunks. Checked: ${nextOutputRoots
      .map((root) => join(root, "static", "chunks"))
      .join(", ")}`,
  );
}

export function currentCss() {
  const outputRoot = currentOutputRoot();
  const dir = join(outputRoot, "static", "chunks");
  const files = readdirSync(dir).filter((file) => file.endsWith(".css"));
  if (files.length !== 1) throw new Error(`Expected one compiled global stylesheet, found ${files.length}`);
  const content = Buffer.from(
    readFileSync(join(dir, files[0]), "utf8").replaceAll("url(../media/", "url(/_next/static/media/"),
  );
  const hash = createHash("sha256").update(content).digest("hex").slice(0, 16);
  return { content, hash, outputRoot, publicPath: `/static-home.${hash}.css` };
}

export function verifyMedia(content, outputRoot) {
  const urls = [...content.toString().matchAll(/url\((?:"|')?(\/_next\/static\/media\/[^)"']+)/g)].map((match) => match[1]);
  for (const url of new Set(urls)) {
    if (!existsSync(join(outputRoot, url.replace("/_next/", "")))) throw new Error(`Missing compiled media asset: ${url}`);
  }
}
