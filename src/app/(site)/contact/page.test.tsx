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
    expect(
      screen.getByRole("heading", { name: /prepare an email draft without losing the thread/i }),
    ).toBeInTheDocument();

    const emailLink = screen.getByRole("link", { name: /email steve/i });
    expect(emailLink).toHaveAttribute("href", "mailto:steve@defendresolutions.com");
    expect(emailLink.parentElement).toHaveClass("flex", "flex-col", "sm:flex-row");
    expect(emailLink.parentElement).not.toHaveClass("grid-cols-2");
    expect(screen.getByRole("button", { name: /copy email/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /prepare email draft/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget range/i)).toBeInTheDocument();
  });

  it("exposes secure new-tab context for GitHub, LinkedIn, and Defendre Solutions", () => {
    render(<Contact />);

    const secondarySection = screen
      .getByRole("heading", { name: /other ways to connect/i })
      .closest("section");

    expect(secondarySection).not.toBeNull();

    const secondary = within(secondarySection as HTMLElement);
    const expectedLinks = [
      ["GitHub", "https://github.com/Sdefendre"],
      ["LinkedIn", "https://www.linkedin.com/in/joseph-m-defendre-a11a47225/"],
      ["Defendre Solutions", "https://defendresolutions.com"],
    ] as const;

    for (const [name, href] of expectedLinks) {
      const link = secondary.getByRole("link", {
        name: `${name} (opens in a new tab)`,
      });

      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveTextContent(name);
      expect(link).not.toHaveTextContent("opens in a new tab");
    }
    expect(secondary.queryByRole("link", { name: /support/i })).not.toBeInTheDocument();
  });

  it("exposes secure new-tab context for the low-priority Support footer link", () => {
    render(<Contact />);

    const supportLink = screen.getByRole("link", {
      name: "Support Defendre Solutions (opens in a new tab)",
    });
    expect(supportLink).toHaveAttribute("href", "https://buymeacoffee.com/defendresolutions");
    expect(supportLink).toHaveAttribute("target", "_blank");
    expect(supportLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(supportLink).toHaveClass("rounded-full");
    expect(supportLink).toHaveTextContent("Support");
    expect(supportLink).not.toHaveTextContent("opens in a new tab");
  });

  it("keeps the desktop draft panel sticky with clearance from the fixed dock", () => {
    render(<Contact />);

    const heading = screen.getByRole("heading", {
      name: /prepare an email draft without losing the thread/i,
    });
    const explainer = heading.parentElement;
    const composerSection = heading.closest("section");

    expect(composerSection).toHaveClass("!overflow-visible");
    expect(explainer).toHaveClass("lg:sticky", "lg:top-36");
    expect(explainer).not.toHaveClass("lg:top-8");
  });

  it("exports route-specific contact metadata", () => {
    expect(metadata.title).toBe("Contact Steve Defendre | Project Inquiries");
    expect(metadata.description).toContain("Start a project inquiry");
    expect(metadata.alternates?.canonical).toBe("/contact");
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      locale: "en_US",
      url: "/contact",
      title: "Contact Steve Defendre | Project Inquiries",
      description:
        "Start a project inquiry with Steve Defendre and Defendre Solutions, or connect through GitHub and LinkedIn.",
      siteName: "Steve Defendre Portfolio",
      images: [
        {
          url: "/project-previews/defendre-solutions.jpg",
          width: 1280,
          height: 720,
          alt: "Steve Defendre portfolio preview",
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      title: "Contact Steve Defendre | Project Inquiries",
      description:
        "Start a project inquiry with Steve Defendre and Defendre Solutions, or connect through GitHub and LinkedIn.",
      images: ["/project-previews/defendre-solutions.jpg"],
    });
  });
});
