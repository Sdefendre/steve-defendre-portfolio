import { afterEach, describe, expect, it } from "vitest";
import robots from "./robots";

const siteEnvKeys = [
  "NEXT_PUBLIC_SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
] as const;

type SiteEnvKey = (typeof siteEnvKeys)[number];

const originalEnv = Object.fromEntries(
  siteEnvKeys.map((key) => [key, process.env[key]]),
) as Record<SiteEnvKey, string | undefined>;

function setSiteEnv(env: Partial<Record<SiteEnvKey, string>>) {
  for (const key of siteEnvKeys) {
    const value = env[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function restoreSiteEnv() {
  for (const key of siteEnvKeys) {
    const value = originalEnv[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

afterEach(() => {
  restoreSiteEnv();
});

describe("robots metadata route", () => {
  it("allows crawling and points to the canonical sitemap", () => {
    setSiteEnv({
      NEXT_PUBLIC_SITE_URL: " portfolio.defendresolutions.com/path?ignored=1 ",
    });

    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: "https://portfolio.defendresolutions.com/sitemap.xml",
      host: "https://portfolio.defendresolutions.com",
    });
  });
});
