import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter" }),
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

describe("layout metadata URL handling - extended cases", () => {
  it("preserves http:// protocol", async () => {
    const metadata = await loadMetadata({
      NEXT_PUBLIC_SITE_URL: "http://example.com",
    });
    expect(metadata.metadataBase?.toString()).toBe("http://example.com/");
  });

  it("converts // to https://", async () => {
    const metadata = await loadMetadata({
      NEXT_PUBLIC_SITE_URL: "//example.com",
    });
    expect(metadata.metadataBase?.toString()).toBe("https://example.com/");
  });

  it("strips path, search, and hash from the base URL", async () => {
    const metadata = await loadMetadata({
      NEXT_PUBLIC_SITE_URL: "https://example.com/path?query=1#hash",
    });
    expect(metadata.metadataBase?.toString()).toBe("https://example.com/");
  });

  it("handles multiple subdomains", async () => {
    const metadata = await loadMetadata({
      NEXT_PUBLIC_SITE_URL: "sub.sub2.example.com",
    });
    expect(metadata.metadataBase?.toString()).toBe("https://sub.sub2.example.com/");
  });

  it("handles custom ports in the input", async () => {
    const metadata = await loadMetadata({
      NEXT_PUBLIC_SITE_URL: "example.com:8080",
    });
    expect(metadata.metadataBase?.toString()).toBe("https://example.com:8080/");
  });
});
