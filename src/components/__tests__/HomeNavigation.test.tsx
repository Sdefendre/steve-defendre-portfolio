import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomeNavigation from "../HomeNavigation";

describe("HomeNavigation", () => {
  it("renders native links with Home marked current and secure external links", () => {
    render(<HomeNavigation />);
    const homeLinks = screen.getAllByRole("link", { name: "Home" });
    expect(homeLinks).toHaveLength(2);
    homeLinks.forEach((link) => expect(link).toHaveAttribute("aria-current", "page"));
    const githubLink = screen.getByRole("link", {
      name: "GitHub (opens in a new tab)",
    });
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");

    const avatar = screen.getByRole("img", { name: "Steve Defendre" });
    expect(avatar).toHaveAttribute("loading", "lazy");
    expect(avatar).toHaveAttribute("fetchpriority", "low");
  });
});
