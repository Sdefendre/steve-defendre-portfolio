import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const fontRoot = "public/static-home/fonts";
const faces = [
  ["Fraunces", "fraunces-vietnamese.250cc2966c658fb6.woff2", "250cc2966c658fb6", "U+102-103,U+110-111,U+128-129,U+168-169,U+1A0-1A1,U+1AF-1B0,U+300-301,U+303-304,U+308-309,U+323,U+329,U+1EA0-1EF9,U+20AB"],
  ["Fraunces", "fraunces-latin-ext.f1451edd6434085c.woff2", "f1451edd6434085c", "U+100-2BA,U+2BD-2C5,U+2C7-2CC,U+2CE-2D7,U+2DD-2FF,U+304,U+308,U+329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"],
  ["Fraunces", "fraunces-latin.88e17be075f1be50.woff2", "88e17be075f1be50", "U+0-FF,U+131,U+152-153,U+2BB-2BC,U+2C6,U+2DA,U+2DC,U+304,U+308,U+329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"],
  ["Manrope", "manrope-cyrillic-ext.e8c0b39992f06b3d.woff2", "e8c0b39992f06b3d", "U+460-52F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F"],
  ["Manrope", "manrope-cyrillic.95a493061fe0a8d0.woff2", "95a493061fe0a8d0", "U+301,U+400-45F,U+490-491,U+4B0-4B1,U+2116"],
  ["Manrope", "manrope-greek.40af11327fe53081.woff2", "40af11327fe53081", "U+370-377,U+37A-37F,U+384-38A,U+38C,U+38E-3A1,U+3A3-3FF"],
  ["Manrope", "manrope-vietnamese.bab757f8a0a1bc04.woff2", "bab757f8a0a1bc04", "U+102-103,U+110-111,U+128-129,U+168-169,U+1A0-1A1,U+1AF-1B0,U+300-301,U+303-304,U+308,U+329,U+323,U+1EA0-1EF9,U+20AB"],
  ["Manrope", "manrope-latin-ext.ce093b341d9c1065.woff2", "ce093b341d9c1065", "U+100-2BA,U+2BD-2C5,U+2C7-2CC,U+2CE-2D7,U+2DD-2FF,U+304,U+308,U+329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF"],
  ["Manrope", "manrope-latin.e310b55a7fd9677f.woff2", "e310b55a7fd9677f", "U+0-FF,U+131,U+152-153,U+2BB-2BC,U+2C6,U+2DA,U+2DC,U+304,U+308,U+329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"],
];

export const staticHomeFontClasses = "static-home-fraunces static-home-manrope";
export const staticHomeFontCss = `${faces.map(([family, file, , range]) => `@font-face{font-family:${family};font-style:normal;font-weight:${family === "Fraunces" ? "100 900" : "200 800"};font-display:swap;src:url(/static-home/fonts/${file})format("woff2");unicode-range:${range}}`).join("")}@font-face{font-family:Fraunces Fallback;src:local(Times New Roman);ascent-override:84.71%;descent-override:22.09%;line-gap-override:0%;size-adjust:115.45%}@font-face{font-family:Manrope Fallback;src:local(Arial);ascent-override:103.31%;descent-override:29.07%;line-gap-override:0%;size-adjust:103.19%}.static-home-fraunces{--font-fraunces:"Fraunces","Fraunces Fallback"}.static-home-manrope{--font-manrope:"Manrope","Manrope Fallback"}`;

export function staticHomeFontHashes(root = process.cwd()) {
  return Object.fromEntries(faces.map(([, file]) => {
    const path = join(root, fontRoot, file);
    if (!existsSync(path)) throw new Error(`Missing static homepage font: ${path}`);
    return [`/static-home/fonts/${file}`, createHash("sha256").update(readFileSync(path)).digest("hex")];
  }));
}

export function verifyStaticHomeFonts(root = process.cwd()) {
  for (const [, file, hash] of faces) {
    const path = join(root, fontRoot, file);
    if (!existsSync(path)) throw new Error(`Missing static homepage font: ${path}`);
    if (createHash("sha256").update(readFileSync(path)).digest("hex").slice(0, 16) !== hash) throw new Error(`Static homepage font hash mismatch: ${path}`);
  }
}
