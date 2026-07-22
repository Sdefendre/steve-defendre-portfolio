import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Contact, { metadata } from "./page";

describe("Contact page", () => {
  it("renders a primary project inquiry path", () => {
    render(<Contact />);

    expect(
      screen.getByRole("heading", { name: /start a project conversation/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /project inquiry/i })).toBeInTheDocument();

    const emailLink = screen.getByRole("link", { name: /email steve/i });
    expect(emailLink).toHaveAttribute("href", "mailto:steve@defendresolutions.com");
    expect(screen.getByRole("button", { name: /copy email/i })).toBeInTheDocument();
  });

  it("renders GitHub, LinkedIn, and Defendre Solutions as secondary links", () => {
    render(<Contact />);

    const secondarySection = screen
      .getByRole("heading", { name: /other ways to connect/i })
      .closest("section");

    expect(secondarySection).not.toBeNull();

    const secondary = within(secondarySection as HTMLElement);
    expect(secondary.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/Sdefendre",
    );
    expect(secondary.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/joseph-m-defendre-a11a47225/",
    );
    expect(secondary.getByRole("link", { name: /defendre solutions/i })).toHaveAttribute(
      "href",
      "https://defendresolutions.com",
    );
    expect(secondary.queryByRole("link", { name: /support/i })).not.toBeInTheDocument();
  });

  it("demotes Support to a low-priority footer link", () => {
    render(<Contact />);

    const supportLink = screen.getByRole("link", { name: /support defendre solutions/i });
    expect(supportLink).toHaveAttribute("href", "https://buymeacoffee.com/defendresolutions");
    expect(supportLink).toHaveClass("rounded-full");
  });

  it("exports route-specific contact metadata", () => {
    expect(metadata.title).toBe("Contact Steve Defendre | Project Inquiries");
    expect(metadata.description).toContain("Start a project inquiry");
    expect(metadata.alternates?.canonical).toBe("/contact");
    expect(metadata.openGraph?.url).toBe("/contact");
  });
});
