import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

describe("proxy CSP", () => {
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
});
