import { render, screen } from "@testing-library/react";
import Projects from "./page";
import { projects } from "@/data/projects";
import { expect, test, vi } from "vitest";

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

test("renders Projects page with correct title and description", () => {
  render(<Projects />);

  expect(screen.getByText("Projects")).toBeDefined();
  expect(
    screen.getByText(/A collection of projects I've built for clients and personal ventures\./i)
  ).toBeDefined();
});

test("renders all projects from the data", () => {
  render(<Projects />);

  expect(screen.getAllByRole("heading", { level: 3 }).length).toBe(projects.length);

  projects.forEach((project) => {
    expect(screen.getByText(project.title)).toBeDefined();
  });
});

test("renders project links with correct attributes", () => {
  render(<Projects />);

  const links = screen.getAllByRole("link");
  const linkedProjects = projects.filter((project) => project.url);

  expect(links.length).toBe(linkedProjects.length);

  linkedProjects.forEach((project) => {
    const projectLinks = links.filter(
      (link) => link.getAttribute("href") === project.url
    );
    expect(projectLinks.length).toBe(1);

    projectLinks.forEach((link) => {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    });
  });
});

test("renders tags for projects", () => {
  render(<Projects />);

  projects
    .flatMap((project) => project.tags)
    .forEach((tag) => {
      expect(screen.getAllByText(tag).length).toBe(1);
    });
});
