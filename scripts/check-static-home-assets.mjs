import { readFileSync } from "node:fs";
import { fileSha256, staticHomeInputHash } from "./static-home-assets-lib.mjs";
import { staticHomeFontHashes } from "./static-home-fonts.mjs";

const manifest = readFileSync("src/generated/static-home-assets.ts", "utf8");
const outputManifest = JSON.parse(manifest.match(/staticHomeOutputManifest = (.+) as const;/)?.[1] ?? "");
if (!outputManifest.inputSha256 || !outputManifest.css?.path || !outputManifest.html?.path) {
  throw new Error("Static homepage asset manifest is incomplete; run npm run sync:static-home");
}
if (outputManifest.inputSha256 !== staticHomeInputHash()) {
  throw new Error("Static homepage inputs changed; run npm run sync:static-home");
}
for (const [kind, output] of Object.entries({ css: outputManifest.css, html: outputManifest.html })) {
  const path = `public${output.path}`;
  if (fileSha256(path) !== output.sha256) throw new Error(`Static homepage ${kind} output hash is stale; run npm run sync:static-home`);
}
if (outputManifest.html.cssSha256 !== outputManifest.css.sha256) throw new Error("Static homepage manifest has mismatched HTML/CSS cross-links; run npm run sync:static-home");
if (JSON.stringify(outputManifest.fonts) !== JSON.stringify(staticHomeFontHashes())) throw new Error("Static homepage font output hashes are stale; run npm run sync:static-home");
console.log(`Verified static homepage inputs and committed output hashes (${outputManifest.inputSha256.slice(0, 16)})`);
