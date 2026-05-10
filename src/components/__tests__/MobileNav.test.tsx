import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePathname } from "next/navigation";
import MobileNav from "../MobileNav";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("MobileNav", () => {
  const mockUsePathname = vi.mocked(usePathname);

  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

  it("uses an explicit bottom safe-area inset style", () => {
    render(<MobileNav />);

    const nav = screen.getByRole("navigation", {
      name: /primary navigation/i,
    });

    expect(nav.className).not.toContain("safe-area-bottom");
    expect(nav).toHaveStyle({
      paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
    });
  });

  it("marks the active route with aria-current", () => {
    mockUsePathname.mockReturnValue("/projects");
    render(<MobileNav />);

    expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByRole("link", { name: /home/i })).not.toHaveAttribute(
      "aria-current"
    );
  });
});
