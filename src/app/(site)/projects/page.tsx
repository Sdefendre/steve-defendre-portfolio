import ProjectExplorer from "@/components/ProjectExplorer";
import { projectCategories, projects } from "@/data/projects";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Projects | Steve Defendre",
  description:
    "Explore software, booking, healthcare, transition, and portfolio projects built by Steve Defendre.",
  canonical: "/projects",
});

export default function Projects() {
  return <ProjectExplorer projects={projects} categories={projectCategories} />;
}
