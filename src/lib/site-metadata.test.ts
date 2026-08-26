import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { metadata as aboutMetadata } from "@/app/(site)/about/page";
import { metadata as contactMetadata } from "@/app/(site)/contact/page";
import { metadata as projectsMetadata } from "@/app/(site)/projects/page";
import { metadata as notFoundMetadata } from "@/app/not-found";
import { siteMetadata } from "./site-metadata";

const previewImagePath = "public/project-previews/defendre-solutions.jpg";
const previewImageUrl = "/project-previews/defendre-solutions.jpg";
const previewImageAlt = "Steve Defendre portfolio preview";

const routeMetadata = [
  ["/", siteMetadata],
  ["/about", aboutMetadata],
  ["/projects", projectsMetadata],
  ["/contact", contactMetadata],
  ["/404", notFoundMetadata],
] as const;

const startOfFrameMarkers = new Set([
  0xc0, 0xc1, 0xc2, 0xc3,
  0xc5, 0xc6, 0xc7,
  0xc9, 0xca, 0xcb,
  0xcd, 0xce, 0xcf,
]);

function readJpegDimensions(bytes: Buffer): { width: number; height: number } {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    throw new Error(`${previewImagePath} is not a JPEG`);
  }

  let offset = 2;

  while (offset + 3 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      throw new Error(`Invalid JPEG marker at byte ${offset}`);
    }

    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset];
    offset += 1;

    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) continue;
    if (marker === 0xda || marker === 0xd9 || offset + 1 >= bytes.length) break;

    const segmentLength = bytes.readUInt16BE(offset);
    if (segmentLength < 2 || offset + segmentLength > bytes.length) {
      throw new Error(`Invalid JPEG segment at byte ${offset}`);
    }

    if (startOfFrameMarkers.has(marker)) {
      if (segmentLength < 7) throw new Error("Invalid JPEG start-of-frame segment");

      return {
        height: bytes.readUInt16BE(offset + 3),
        width: bytes.readUInt16BE(offset + 5),
      };
    }

    offset += segmentLength;
  }

  throw new Error(`No JPEG dimensions found in ${previewImagePath}`);
}

function firstImage(images: unknown) {
  if (!Array.isArray(images) || typeof images[0] !== "object" || images[0] === null) {
    throw new Error("Expected one structured social image descriptor");
  }

  return images[0] as { url: string | URL; width?: number | string; height?: number | string; alt?: string };
}

describe("shared route social metadata", () => {
  it.each(routeMetadata)("declares exact image metadata for %s", (_route, metadata) => {
    const openGraphImage = firstImage(metadata.openGraph?.images);
    const twitterImage = firstImage(metadata.twitter?.images);

    expect(openGraphImage).toEqual({
      url: previewImageUrl,
      width: 1440,
      height: 900,
      alt: previewImageAlt,
    });
    expect(twitterImage).toEqual({
      url: previewImageUrl,
      alt: previewImageAlt,
    });
  });

  it("keeps declared Open Graph dimensions synchronized with the JPEG bytes", () => {
    const dimensions = readJpegDimensions(readFileSync(previewImagePath));

    expect(dimensions).toEqual({ width: 1440, height: 900 });

    for (const [, metadata] of routeMetadata) {
      const image = firstImage(metadata.openGraph?.images);
      expect({ width: image.width, height: image.height }).toEqual(dimensions);
    }
  });
});
