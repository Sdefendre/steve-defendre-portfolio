import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";

const layoutSource = readFileSync("src/app/(site)/layout.tsx", "utf8");

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/components/Sidebar", () => ({
  default: () => null,
}));

vi.mock("@/components/MobileNav", () => ({
  default: () => null,
}));

vi.mock("@vercel/analytics/next", () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

describe("site layout", () => {
  it("mounts Vercel Analytics alongside the route content", async () => {
    const { default: RootLayout } = await import("./layout");

    const tree = await RootLayout({
      children: <div data-testid="layout-child">Child</div>,
    });

    render(tree);

    expect(screen.getByTestId("layout-child")).toBeInTheDocument();
    expect(screen.getByTestId("vercel-analytics")).toBeInTheDocument();
  });
});

describe("layout responsive navigation clearance", () => {
  it("resets mobile dock clearance when the tablet header takes over", () => {
    expect(layoutSource).toContain(
      "pb-[calc(12rem+env(safe-area-inset-bottom,0px))]",
    );
    expect(layoutSource).toContain("md:pb-12 md:pt-36");
    expect(layoutSource).not.toContain("lg:pb-12");
  });
});
