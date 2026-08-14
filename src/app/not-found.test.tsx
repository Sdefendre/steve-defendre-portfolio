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

    expect(screen.getByText(/Steve Defendre · Signal lost/i)).toBeInTheDocument();
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

  it("exports a specific page title and recovery description", () => {
    expect(metadata.title).toBe("Page Not Found | Steve Defendre");
    expect(metadata.description).toContain("portfolio, projects, or contact page");
  });
});
