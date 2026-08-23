import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExternalLink } from "../ExternalLink";

describe("ExternalLink", () => {
  it("securely opens a new tab and discloses the context change", () => {
    render(
      <ExternalLink href="https://example.com">Example</ExternalLink>,
    );

    const link = screen.getByRole("link", {
      name: "Example (opens in a new tab)",
    });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent("Example");
    expect(link).not.toHaveTextContent("opens in a new tab");
  });

  it("extends an explicit accessible label without duplicating visible copy", () => {
    render(
      <ExternalLink href="https://example.com" aria-label="Example profile">
        <span aria-hidden="true">Icon</span>
      </ExternalLink>,
    );

    const link = screen.getByRole("link", {
      name: "Example profile (opens in a new tab)",
    });
    expect(link).not.toHaveTextContent("opens in a new tab");
  });
});
