import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProjectExplorer from "../ProjectExplorer";
import type { Project, ProjectCategory } from "@/data/projects";

const navigation = vi.hoisted(() => ({
  replace: vi.fn(),
  params: new URLSearchParams(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: navigation.replace }),
  useSearchParams: () => navigation.params,
}));

const categories: ProjectCategory[] = ["Studio", "Client", "Product"];

const projects: Project[] = [
  {
    initials: "AL",
    title: "Alpha Launch",
    description: "Studio platform work that ships a client-ready launch surface.",
    role: "Founder and delivery lead",
    outcome: "Established a clear launch path for the studio.",
    category: "Studio",
    year: 2026,
    status: "Live",
    caseStudy: {
      challenge: "Make a broad service offering understandable at a glance.",
      approach: "Turned the offer into a focused launch site with direct calls to action.",
      impact: "Created a public home base for sales conversations and delivery.",
    },
    tags: ["Next.js", "TypeScript"],
    gradient: "from-slate-600 to-indigo-600",
    url: "https://alpha.example.com",
    ctaLabel: "Visit studio",
  },
  {
    initials: "BC",
    title: "Beta Care",
    description: "Client healthcare work with a clear route to the next step.",
    role: "Frontend architect",
    outcome: "Improved the patient-facing booking path.",
    category: "Client",
    year: 2026,
    status: "Live",
    caseStudy: {
      challenge: "Help people understand the service without extra friction.",
      approach: "Used a direct information hierarchy and cleaner booking affordances.",
      impact: "Reduced friction around reading services and starting a booking.",
    },
    tags: ["React", "Tailwind CSS"],
    gradient: "from-blue-500 to-cyan-600",
    url: "https://beta.example.com",
    ctaLabel: "Visit site",
  },
  {
    initials: "CP",
    title: "Command Prototype",
    description: "A product concept for transition planning and guided next steps.",
    role: "Product builder",
    outcome: "Validated the core interaction model for the concept.",
    category: "Product",
    year: 2026,
    status: "Prototype",
    caseStudy: {
      challenge: "Show the value of the concept before the full build exists.",
      approach: "Prototyped the skills mapping flow and a clearer step-by-step path.",
      impact: "Clarified the product direction for future development.",
    },
    tags: ["AI/ML", "React"],
    gradient: "from-emerald-500 to-teal-600",
    url: "https://prototype.example.com",
    ctaLabel: "Open prototype",
  },
];

describe("ProjectExplorer", () => {
  beforeEach(() => {
    navigation.replace.mockReset();
    navigation.params = new URLSearchParams();
  });

  it("renders the filter controls and visible result count", () => {
    render(<ProjectExplorer projects={projects} categories={categories} />);

    expect(screen.getByRole("heading", { name: "Projects", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Showing 3 of 3 projects")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Studio" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Client" })).toHaveAttribute("aria-pressed", "false");
  });

  it("opens the Product chip when the URL already has that category", () => {
    navigation.params = new URLSearchParams("category=Product");
    render(<ProjectExplorer projects={projects} categories={categories} />);

    expect(screen.getByRole("button", { name: "Product" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Showing 1 Product project")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open prototype for command prototype/i })).toBeInTheDocument();
  });

  it("filters projects by category and updates the visible count", () => {
    render(<ProjectExplorer projects={projects} categories={categories} />);

    fireEvent.click(screen.getByRole("button", { name: "Client" }));

    expect(screen.getByRole("button", { name: "Client" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Studio" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Product" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Showing 1 Client project")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /visit site for beta care/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /visit studio for alpha launch/i })).not.toBeInTheDocument();
    expect(navigation.replace).toHaveBeenCalledWith("/projects?category=Client", { scroll: false });
  });

  it("shows an empty state when a filter has no matches and allows reset", () => {
    render(
      <ProjectExplorer
        projects={projects.filter((project) => project.category !== "Product")}
        categories={categories}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Product" }));

    expect(screen.getByText("Showing 0 Product projects")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /nothing in product right now/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show all projects" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show all projects" }));

    expect(screen.getByText("Showing 2 of 2 projects")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /visit studio for alpha launch/i })).toBeInTheDocument();
  });

  it("maintains exclusive active state when switching between filters", () => {
    render(<ProjectExplorer projects={projects} categories={categories} />);

    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "Studio" }));
    expect(screen.getByRole("button", { name: "Studio" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Client" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Product" })).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(screen.getByRole("button", { name: "Product" }));
    expect(screen.getByRole("button", { name: "Product" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Studio" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Client" })).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Studio" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Client" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("button", { name: "Product" })).toHaveAttribute("aria-pressed", "false");
  });

  it("expands the inline case study and keeps external links safe", () => {
    render(<ProjectExplorer projects={[projects[0]]} categories={categories} />);

    const projectLink = screen.getByRole("link", { name: /visit studio for alpha launch/i });
    expect(projectLink).toHaveAttribute("target", "_blank");
    expect(projectLink).toHaveAttribute("rel", "noopener noreferrer");

    const caseStudySummary = screen
      .getByText("Case study")
      .closest("summary");

    expect(caseStudySummary).not.toBeNull();
    expect(caseStudySummary).toHaveClass("relative", "z-10", "w-full", "cursor-pointer");
    const chevron = (caseStudySummary as HTMLElement).querySelector("svg");
    expect(chevron).toHaveClass("group-open:rotate-180");
    fireEvent.click(caseStudySummary as HTMLElement);

    expect(screen.getByText(projects[0].caseStudy.challenge)).toBeVisible();
    expect(screen.getByText(projects[0].caseStudy.approach)).toBeVisible();
    expect(screen.getByText(projects[0].caseStudy.impact)).toBeVisible();

    const details = (caseStudySummary as HTMLElement).closest("details");
    expect(details).not.toBeNull();
    expect(within(details as HTMLElement).getByText("Challenge")).toBeInTheDocument();
  });
});
