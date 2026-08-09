import { render, screen } from "@testing-library/react";
import Projects from "./page";
import { projectCategories, projects } from "@/data/projects";
import { expect, test, vi } from "vitest";

const projectExplorerMock = vi.hoisted(() => vi.fn());

vi.mock("@/components/ProjectExplorer", () => ({
  default: (props: unknown) => {
    projectExplorerMock(props);

    return <div data-testid="project-explorer" />;
  },
}));

test("passes the project catalog and categories into ProjectExplorer", () => {
  render(<Projects />);

  expect(screen.getByTestId("project-explorer")).toBeInTheDocument();
  expect(projectExplorerMock).toHaveBeenCalledTimes(1);

  const props = projectExplorerMock.mock.calls[0]?.[0] as {
    projects: typeof projects;
    categories: typeof projectCategories;
  };

  expect(props.projects).toBe(projects);
  expect(props.categories).toBe(projectCategories);
});
