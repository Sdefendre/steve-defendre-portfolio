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

  // Should render both desktop and mobile versions
  // Each project title should appear twice (once for desktop, once for mobile)
  const project1Titles = screen.getAllByText("Test Project 1");
  const project2Titles = screen.getAllByText("Test Project 2");

  expect(project1Titles.length).toBe(2);
  expect(project2Titles.length).toBe(2);
});

test("renders project links with correct attributes", () => {
  render(<Projects />);

  const links = screen.getAllByRole("link");

  // 2 projects * 2 versions (desktop/mobile) = 4 links
  expect(links.length).toBe(4);

  const project1Links = links.filter(link => link.getAttribute("href") === "https://test1.com");
  expect(project1Links.length).toBe(2);

  project1Links.forEach(link => {
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});

test("renders tags for projects", () => {
  render(<Projects />);

  // Tags from Test Project 1: Tag1, Tag2
  // Tags from Test Project 2: Tag3
  // Each should appear twice
  expect(screen.getAllByText("Tag1").length).toBe(2);
  expect(screen.getAllByText("Tag2").length).toBe(2);
  expect(screen.getAllByText("Tag3").length).toBe(2);
});
