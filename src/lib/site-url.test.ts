import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveSiteUrl } from "./site-url.mjs";
import robots from "../app/robots";
import sitemap from "../app/sitemap";

const keys = ["NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL", "VERCEL_URL"] as const;
type Environment = Partial<Record<typeof keys[number], string>>;

const cases: { name: string; environment: Environment; canonical: string }[] = [
  { name: "explicit public origin", environment: { NEXT_PUBLIC_SITE_URL: " https://custom.example/path?q=1#hash ", VERCEL_PROJECT_PRODUCTION_URL: "production.example", VERCEL_URL: "preview.example" }, canonical: "https://custom.example/" },
  { name: "production before preview", environment: { NEXT_PUBLIC_SITE_URL: " ", VERCEL_PROJECT_PRODUCTION_URL: " //production.example/path ", VERCEL_URL: "preview.example" }, canonical: "https://production.example/" },
  { name: "invalid candidates before preview", environment: { NEXT_PUBLIC_SITE_URL: "https://[::1", VERCEL_PROJECT_PRODUCTION_URL: "ftp://production.example", VERCEL_URL: "preview.example/path" }, canonical: "https://preview.example/" },
  { name: "safe public fallback", environment: { NEXT_PUBLIC_SITE_URL: "https://user:secret@example.com", VERCEL_URL: "://bad" }, canonical: "https://steve-defendre-portfolio.vercel.app/" },
  { name: "absent environment", environment: {}, canonical: "https://steve-defendre-portfolio.vercel.app/" },
  { name: "explicit local development", environment: { NEXT_PUBLIC_SITE_URL: "http://localhost:4107/path" }, canonical: "http://localhost:4107/" },
];

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("canonical URL policy across public metadata", () => {
  it.each(cases)("uses $name consistently", async ({ environment, canonical }) => {
    for (const key of keys) vi.stubEnv(key, environment[key]);
    vi.resetModules();
    const { siteMetadata, createPageMetadata } = await import("./site-metadata");
    expect(resolveSiteUrl(environment).href).toBe(canonical);
    expect(siteMetadata.metadataBase?.href).toBe(canonical);
    expect(siteMetadata.alternates?.canonical?.toString()).toBe(canonical);
    expect(siteMetadata.openGraph?.url?.toString()).toBe(canonical);
    const page = createPageMetadata({ title: "Projects", description: "Work", canonical: "/projects" });
    expect(new URL(page.alternates?.canonical as string, siteMetadata.metadataBase!).href).toBe(`${canonical}projects`);
    expect(robots().sitemap).toBe(`${canonical}sitemap.xml`);
    expect(robots().host).toBe(new URL(canonical).origin);
    expect(sitemap().map(({ url }) => url)).toEqual([canonical, `${canonical}projects`, `${canonical}about`, `${canonical}contact`]);
  });

  it.each(["ftp://example.com", "javascript://example.com", "file:///tmp/example", "https://user@example.com", "https://example.com\\\\other", "https://exa mple.com", "mailto:person@example.com"])("skips unsafe or malformed override %s", (candidate) => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: candidate, VERCEL_PROJECT_PRODUCTION_URL: "production.example" }).href).toBe("https://production.example/");
  });
});
