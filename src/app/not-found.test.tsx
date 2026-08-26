import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import NotFound, { metadata } from "./not-found";

type MockLinkProps = {
  children: ReactNode;
  href: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: MockLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers([["x-nonce", "test-nonce"]])),
}));

vi.mock("@/components/HomeNavigation", () => ({
  default: () => <nav data-testid="home-navigation" />,
}));

describe("not-found page", () => {
  it("renders branded recovery CTAs with the server-only home shell", async () => {
    render(await NotFound());

    expect(screen.getByText(/Steve Defendre · Wrong address/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /projects/i })).toHaveAttribute("href", "/projects");
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "/contact");
    expect(screen.getByRole("link", { name: /defendre solutions/i })).toHaveAttribute(
      "href",
      "https://defendresolutions.com",
    );
    expect(screen.getByTestId("home-navigation")).toBeInTheDocument();
    expect(document.querySelector('script[src="/_vercel/insights/script.js"]')).toHaveAttribute(
      "nonce",
      "test-nonce",
    );
  });

  it("exports page-specific social metadata and keeps the 404 out of the index", () => {
    expect(metadata.title).toBe("Page not found | Steve Defendre");
    expect(metadata.description).toBe(
      "That page is gone. Home, projects, and contact still work.",
    );
    expect(metadata.alternates?.canonical).toBe("/");
    expect(metadata.robots).toEqual({
      index: false,
      follow: true,
    });
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      locale: "en_US",
      url: "/",
      title: "Page not found | Steve Defendre",
      description: "That page is gone. Home, projects, and contact still work.",
      siteName: "Steve Defendre Portfolio",
    });
    expect(metadata.twitter).toMatchObject({
      title: "Page not found | Steve Defendre",
      description: "That page is gone. Home, projects, and contact still work.",
    });
  });
});
