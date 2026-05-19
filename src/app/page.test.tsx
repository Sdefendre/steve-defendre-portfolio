import { render, screen } from "@testing-library/react";
import Home from "./page";
import { projects } from "@/data/projects";
import { expect, test, vi } from "vitest";
import type { ImgHTMLAttributes } from "react";

interface MockImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  priority?: boolean;
}

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ alt, priority, ...props }: MockImageProps) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt ?? ""} {...props} data-priority={priority ? "true" : undefined} />;
  },
}));

// Mock the projects data
vi.mock("@/data/projects", () => ({
  projects: [
    {
      initials: "TP1",
      title: "Test Project 1",
      description: "Description 1",
      tags: ["Tag1", "Tag2"],
      gradient: "from-red-500 to-blue-500",
      url: "https://test1.com",
    },
    {
      initials: "TP2",
      title: "Test Project 2",
      description: "Description 2",
      tags: ["Tag3"],
      gradient: "from-green-500 to-yellow-500",
      url: "https://test2.com",
    },
  ],
}));

test("renders Home page with header information", () => {
  render(<Home />);

  // Check for the name (using regex to find text content that might be split by spans)
  expect(screen.getAllByText(/Steve Defendre/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/Hello there! I'm Steve/i).length).toBeGreaterThan(0);

  // Check for the role/bio
  expect(screen.getAllByText(/Full-Stack Developer/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/I'm a full-stack developer that loves building products/i)).toBeInTheDocument();

  // Check for the link
  const link = screen.getByRole("link", { name: /Defendre Solutions/i });
  expect(link).toHaveAttribute("href", "https://defendresolutions.com");
});

test("renders Projects section with correct heading", () => {
  render(<Home />);
  expect(screen.getByRole("heading", { name: "Projects", level: 2 })).toBeInTheDocument();
});

test("renders all projects from the mocked data", () => {
  render(<Home />);

  // Since we mocked projects with 2 items
  expect(projects.length).toBe(2);

  projects.forEach((project) => {
    expect(screen.getByText(project.title)).toBeInTheDocument();
    expect(screen.getByText(project.description)).toBeInTheDocument();
  });
});
