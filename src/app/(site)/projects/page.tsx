import ProjectExplorer from "@/components/ProjectExplorer";
import { projectCategories, projects } from "@/data/projects";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Projects | Steve Defendre",
  description:
    "Client sites, studio work, and products Steve Defendre has shipped, including booking, healthcare, and local tools.",
  canonical: "/projects",
});

export default function Projects() {
  return <ProjectExplorer projects={projects} categories={projectCategories} />;
}
