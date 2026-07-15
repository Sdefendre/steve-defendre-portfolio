import { afterEach, describe, expect, it } from "vitest";
import sitemap from "./sitemap";

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

describe("sitemap metadata route", () => {
  it("uses production-safe canonical URLs for core portfolio routes", () => {
    setSiteEnv({
      VERCEL_PROJECT_PRODUCTION_URL: "stevedefendre.com",
      VERCEL_URL: "portfolio-git-preview.vercel.app",
    });

    expect(sitemap()).toEqual([
      {
        url: "https://stevedefendre.com/",
        changeFrequency: "monthly",
        priority: 1,
      },
      {
        url: "https://stevedefendre.com/projects",
        changeFrequency: "monthly",
        priority: 0.8,
      },
      {
        url: "https://stevedefendre.com/about",
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: "https://stevedefendre.com/contact",
        changeFrequency: "monthly",
        priority: 0.9,
      },
    ]);
  });
});
