import type { Metadata } from "next";
import ProjectExplorer from "@/components/ProjectExplorer";
import { projectCategories, projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects | Steve Defendre",
  description:
    "Explore software, booking, healthcare, transition, and portfolio projects built by Steve Defendre.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | Steve Defendre",
    description:
      "Explore software, booking, healthcare, transition, and portfolio projects built by Steve Defendre.",
    url: "/projects",
  },
};

export default function Projects() {
  return <ProjectExplorer projects={projects} categories={projectCategories} />;
}
