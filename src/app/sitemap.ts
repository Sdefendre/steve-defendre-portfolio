import type { MetadataRoute } from "next";

import { resolveSiteUrl } from "../lib/site-url.mjs";

const routes = [
  { path: "/", priority: 1 },
  { path: "/projects", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/contact", priority: 0.9 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = resolveSiteUrl();

  return routes.map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}
