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

export const siteMetadata: Metadata = {
  metadataBase,
  title: "Steve Defendre | Full-Stack Developer",
  description: "Veteran-owned software development. Transforming ideas into production-ready applications.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: canonicalUrl,
    title: "Steve Defendre | Full-Stack Developer",
    description: "Veteran-owned software development. Transforming ideas into production-ready applications.",
    siteName: "Steve Defendre Portfolio",
    images: [{ url: previewImage, width: 1280, height: 720, alt: "Steve Defendre portfolio preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Steve Defendre | Full-Stack Developer",
    description: "Veteran-owned software development. Transforming ideas into production-ready applications.",
    images: [previewImage],
  },
};

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
