import type { Metadata, Viewport } from "next";

const localSiteUrl = new URL("http://localhost:3000");
const SCHEME_REGEX = /^[a-z][a-z\d+\-.]*:\/\//i;
const PROTOCOL_RELATIVE_REGEX = /^\/\//;

function normalizeSiteUrl(value?: string): URL | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const base = SCHEME_REGEX.test(trimmed)
    ? trimmed
    : `https://${trimmed.replace(PROTOCOL_RELATIVE_REGEX, "")}`;

  try {
    return new URL("/", base);
  } catch {
    return null;
  }
}

const metadataBase =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeSiteUrl(process.env.VERCEL_URL) ??
  localSiteUrl;
const canonicalUrl = new URL("/", metadataBase);
const previewImage = "/project-previews/defendre-solutions.jpg";
const siteTitle = "Steve Defendre | Full-Stack Developer";
const siteDescription =
  "Veteran-owned software development. Transforming ideas into production-ready applications.";

const sharedOpenGraph = {
  type: "website",
  locale: "en_US",
  siteName: "Steve Defendre Portfolio",
  images: [{ url: previewImage, width: 1280, height: 720, alt: "Steve Defendre portfolio preview" }],
} satisfies NonNullable<Metadata["openGraph"]>;

const sharedTwitter = {
  card: "summary_large_image",
  images: [previewImage],
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
