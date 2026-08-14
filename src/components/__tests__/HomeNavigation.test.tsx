import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomeNavigation from "../HomeNavigation";

describe("HomeNavigation", () => {
  it("renders native links with Home marked current and secure external links", () => {
    render(<HomeNavigation />);
    const homeLinks = screen.getAllByRole("link", { name: "Home" });
    expect(homeLinks).toHaveLength(2);
    homeLinks.forEach((link) => expect(link).toHaveAttribute("aria-current", "page"));
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("rel", "noopener noreferrer");
  });
});
