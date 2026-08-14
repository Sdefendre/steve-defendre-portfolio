import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { staticHomeFontCss, verifyStaticHomeFonts } from "./static-home-fonts.mjs";

const inputFiles = [
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.ts",
  "postcss.config.mjs",
  "src/app/globals.css",
  "src/app/(home)/layout.tsx",
  "src/app/(home)/page.tsx",
  "src/components/AnimatedBackground.tsx",
  "src/components/HomeNavigation.tsx",
  "src/components/HomeShell.tsx",
  "src/components/ProjectCard.tsx",
  "src/components/ResponsiveImage.tsx",
  "src/components/SocialIcons.tsx",
  "src/data/navigation.ts",
  "src/data/projects.ts",
  "src/data/socials.ts",
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
 * Inputs are deliberately explicit so changes to a rendered source, compiler,
 * font, or image cannot be mistaken for fresh checked-in output.
 */
export function staticHomeInputFiles(root = process.cwd()) {
  return [...inputFiles, ...filesIn(root, "public/static-home/fonts"), ...filesIn(root, "public/project-previews"), "public/headshot.jpg"].sort();
}

export function staticHomeInputHash(root = process.cwd()) {
  const hash = createHash("sha256");
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
  const [{ default: postcss }, { default: tailwind }] = await Promise.all([import("postcss"), import("@tailwindcss/postcss")]);
  const result = await postcss([tailwind()]).process(readFileSync("src/app/globals.css", "utf8"), { from: "src/app/globals.css" });
  const content = Buffer.from(`${staticHomeFontCss}${result.css}`);
  const hash = sha256(content);
  return { content, hash, publicPath: `/static-home.${hash.slice(0, 16)}.css` };
}
