import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { proxy } from "./proxy";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("proxy CSP", () => {
  it("keeps generated homepage implementation files out of the crawlable URL space", () => {
    for (const path of ["/static-home-internal", "/static-home.0123456789abcdef.html"]) {
      const response = proxy(new NextRequest(`https://portfolio.defendresolutions.com${path}`));

      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe("https://portfolio.defendresolutions.com/");
    }
  });

  it("allows framework inline styles without loosening scripts", () => {
    const response = proxy(new NextRequest("https://portfolio.defendresolutions.com/contact"));
    const csp = response.headers.get("Content-Security-Policy") ?? "";

    const scriptDirective = csp.match(/script-src[^;]+/)?.[0] ?? "";
    const styleDirective = csp.match(/style-src[^;]+/)?.[0] ?? "";

    expect(scriptDirective).toContain("'strict-dynamic'");
    expect(scriptDirective).toMatch(/'nonce-[^']+'/);
    expect(scriptDirective).not.toContain("'unsafe-inline'");
    expect(styleDirective).toBe("style-src 'self' 'unsafe-inline'");
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("does not upgrade local HTTP assets to HTTPS", () => {
    const response = proxy(new NextRequest("http://127.0.0.1:3002/contact"));
    const csp = response.headers.get("Content-Security-Policy") ?? "";

    expect(csp).not.toContain("upgrade-insecure-requests");
  });

  it("allows PostHog connections only when the public host is configured", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "");
    const withoutPosthog = proxy(new NextRequest("https://portfolio.defendresolutions.com/about"));
    expect(withoutPosthog.headers.get("Content-Security-Policy") ?? "").not.toContain(
      "posthog.com",
    );

    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://us.i.posthog.com");
    const withPosthog = proxy(new NextRequest("https://portfolio.defendresolutions.com/about"));
    expect(withPosthog.headers.get("Content-Security-Policy") ?? "").toContain(
      "connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com",
    );
  });
});
