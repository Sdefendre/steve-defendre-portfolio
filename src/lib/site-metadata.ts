import type { Metadata, Viewport } from "next";

import { resolveSiteUrl } from "./site-url.mjs";

const metadataBase = resolveSiteUrl();
const canonicalUrl = new URL("/", metadataBase);
export const socialPreviewImage = {
  url: "/project-previews/defendre-solutions.jpg",
  width: 1440,
  height: 900,
  alt: "Steve Defendre portfolio preview",
} as const;
const siteTitle = "Steve Defendre | Full-stack developer";
const siteDescription =
  "Veteran-owned software studio. I build web apps, booking flows, and ops tools for small teams.";

const sharedOpenGraph = {
  type: "website",
  locale: "en_US",
  siteName: "Steve Defendre Portfolio",
  images: [socialPreviewImage],
} satisfies NonNullable<Metadata["openGraph"]>;

const sharedTwitter = {
  card: "summary_large_image",
  images: [{ url: socialPreviewImage.url, alt: socialPreviewImage.alt }],
} satisfies NonNullable<Metadata["twitter"]>;

type PageMetadataOptions = {
  title: string;
  description: string;
  canonical: `/${string}` | URL;
};

export function createPageMetadata({
  title,
  description,
  canonical,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      ...sharedOpenGraph,
      url: canonical,
      title,
      description,
    },
    twitter: {
      ...sharedTwitter,
      title,
      description,
    },
  };
}

export const siteMetadata: Metadata = {
  metadataBase,
  ...createPageMetadata({
    title: siteTitle,
    description: siteDescription,
    canonical: canonicalUrl,
  }),
};

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
