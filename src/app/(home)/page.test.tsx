import { render, screen } from "@testing-library/react";
import Home from "./page";
import { projects } from "@/data/projects";
import { expect, test, vi } from "vitest";
import type { ImgHTMLAttributes } from "react";

type MockImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
};

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ alt, fill, priority, ...props }: MockImageProps) => {
    void fill;
    void priority;

    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt ?? ""} {...props} />;
  },
}));

// Mock the projects data
vi.mock("@/data/projects", () => ({
  projects: [
    {
      initials: "TP1",
      title: "Test Project 1",
      description: "Description 1",
      role: "Test role 1",
      outcome: "Outcome 1",
      tags: ["Tag1", "Tag2"],
      gradient: "from-red-500 to-blue-500",
      url: "https://test1.com",
      ctaLabel: "Open test 1",
    },
    {
      initials: "TP2",
      title: "Test Project 2",
      description: "Description 2",
      role: "Test role 2",
      outcome: "Outcome 2",
      tags: ["Tag3"],
      gradient: "from-green-500 to-yellow-500",
      url: "https://test2.com",
      ctaLabel: "Open test 2",
    },
  ],
}));

test("renders Home page with header information", () => {
  render(<Home />);

  expect(screen.getByText(/Veteran founder · Full-stack builder/i)).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: /Software with clarity, depth, and staying power/i,
      level: 1,
    })
  ).toBeInTheDocument();

  expect(screen.getByText(/I'm Steve Defendre, a veteran and founder of/i)).toBeInTheDocument();

  const link = screen.getByRole("link", { name: /Defendre Solutions/i });
  expect(link).toHaveAttribute("href", "https://defendresolutions.com");

  expect(screen.getByRole("link", { name: /Start a project/i })).toHaveAttribute("href", "/contact");
  expect(screen.getByRole("link", { name: "Explore the work" })).toHaveAttribute("href", "/projects");
});

test("renders Projects section with correct heading", () => {
  render(<Home />);
  expect(
    screen.getByRole("heading", { name: /A constellation of shipped systems/i, level: 2 }),
  ).toBeInTheDocument();
});

test("renders all projects from the mocked data", () => {
  render(<Home />);

  // Since we mocked projects with 2 items
  expect(projects.length).toBe(2);

  projects.forEach((project) => {
    expect(screen.getByText(project.title)).toBeInTheDocument();
    expect(screen.getByText(project.description)).toBeInTheDocument();
    expect(screen.getByText(project.role)).toBeInTheDocument();
    expect(screen.getByText(project.outcome)).toBeInTheDocument();
  });
});
