import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Fraunces: () => ({ variable: "font-fraunces" }),
  Manrope: () => ({ variable: "font-manrope" }),
}));

vi.mock("@/components/Sidebar", () => ({
  default: () => null,
}));

vi.mock("@/components/MobileNav", () => ({
  default: () => null,
}));

vi.mock("@/components/AnimatedBackground", () => ({
  default: () => null,
}));

const siteEnvKeys = [
  "NEXT_PUBLIC_SITE_URL",
  "VERCEL_PROJECT_PRODUCTION_URL",
  "VERCEL_URL",
] as const;

type SiteEnvKey = (typeof siteEnvKeys)[number];

const originalEnv = Object.fromEntries(
  siteEnvKeys.map((key) => [key, process.env[key]]),
) as Record<SiteEnvKey, string | undefined>;

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

async function loadMetadata(env: Partial<Record<SiteEnvKey, string>>) {
  for (const key of siteEnvKeys) {
    const value = env[key];

    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  vi.resetModules();

  return (await import("./layout")).metadata;
}

afterEach(() => {
  restoreSiteEnv();
  vi.resetModules();
});

describe("layout metadata URL handling", () => {
  it("normalizes a scheme-less NEXT_PUBLIC_SITE_URL across metadata fields", async () => {
    const metadata = await loadMetadata({
      NEXT_PUBLIC_SITE_URL: " portfolio.defendresolutions.com ",
    });

    expect(metadata.metadataBase?.toString()).toBe("https://portfolio.defendresolutions.com/");
    expect(metadata.alternates?.canonical?.toString()).toBe("https://portfolio.defendresolutions.com/");
    expect(metadata.openGraph?.url?.toString()).toBe("https://portfolio.defendresolutions.com/");
  });

  it("prefers VERCEL_PROJECT_PRODUCTION_URL over VERCEL_URL when NEXT_PUBLIC_SITE_URL is unset", async () => {
    const metadata = await loadMetadata({
      VERCEL_PROJECT_PRODUCTION_URL: "stevedefendre.com",
      VERCEL_URL: "portfolio-git-feature-preview.vercel.app",
    });

    expect(metadata.metadataBase?.toString()).toBe("https://stevedefendre.com/");
    expect(metadata.alternates?.canonical?.toString()).toBe("https://stevedefendre.com/");
    expect(metadata.openGraph?.url?.toString()).toBe("https://stevedefendre.com/");
  });

  it("falls back past malformed env values to the next valid site URL", async () => {
    const metadata = await loadMetadata({
      NEXT_PUBLIC_SITE_URL: "https://[::1",
      VERCEL_PROJECT_PRODUCTION_URL: "://bad",
      VERCEL_URL: "portfolio-preview.vercel.app/feature",
    });

    expect(metadata.metadataBase?.toString()).toBe("https://portfolio-preview.vercel.app/");
    expect(metadata.alternates?.canonical?.toString()).toBe("https://portfolio-preview.vercel.app/");
    expect(metadata.openGraph?.url?.toString()).toBe("https://portfolio-preview.vercel.app/");
  });

  it("uses localhost when every site URL source is unusable", async () => {
    const metadata = await loadMetadata({
      NEXT_PUBLIC_SITE_URL: "https://[::1",
      VERCEL_PROJECT_PRODUCTION_URL: "://bad",
      VERCEL_URL: "http://[::1",
    });

    expect(metadata.metadataBase?.toString()).toBe("http://localhost:3000/");
    expect(metadata.alternates?.canonical?.toString()).toBe("http://localhost:3000/");
    expect(metadata.openGraph?.url?.toString()).toBe("http://localhost:3000/");
  });
});
