import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";

const layoutSource = readFileSync("src/app/(home)/layout.tsx", "utf8");

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers([["x-nonce", "test-nonce"]])),
}));

vi.mock("next/font/google", () => ({
  Fraunces: () => ({ variable: "font-fraunces" }),
  Manrope: () => ({ variable: "font-manrope" }),
}));

vi.mock("@/components/AnimatedBackground", () => ({ default: () => null }));
vi.mock("@/components/HomeNavigation", () => ({ default: () => <nav data-testid="home-navigation" /> }));

describe("home layout", () => {
  it("keeps a nonce-protected same-origin analytics loader without the React adapter", async () => {
    const { default: HomeLayout } = await import("./layout");
    render(await HomeLayout({ children: <div data-testid="layout-child">Child</div> }));

    expect(screen.getByTestId("layout-child")).toBeInTheDocument();
    expect(screen.getByTestId("home-navigation")).toBeInTheDocument();
    expect(document.querySelector('script[src="/_vercel/insights/script.js"]')).toHaveAttribute("nonce", "test-nonce");
  });

  it("does not reintroduce client navigation or the React Analytics adapter", () => {
    expect(layoutSource).not.toContain("@vercel/analytics/next");
    expect(layoutSource).not.toContain("Sidebar");
    expect(layoutSource).not.toContain("MobileNav");
    expect(layoutSource).toContain("/_vercel/insights/script.js");
  });
});
