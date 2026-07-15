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
    expect(nav.className).toContain(
      "pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]"
    );
    expect(nav.className).toContain("fixed");

    const rail = nav.firstElementChild;
    expect(rail).toHaveClass("min-h-[4.5rem]");
    expect(rail).toHaveClass("max-w-md");
  });

  it("marks the active route with aria-current and visual state", () => {
    mockUsePathname.mockReturnValue("/projects");
    render(<MobileNav />);

    const projectsLink = screen.getByRole("link", { name: /projects/i });
    expect(projectsLink).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(projectsLink.className).toContain("dock-link-active");
    expect(projectsLink.className).toContain("focus-ring");

    expect(screen.getByRole("link", { name: /home/i })).not.toHaveAttribute(
      "aria-current"
    );
  });
});
