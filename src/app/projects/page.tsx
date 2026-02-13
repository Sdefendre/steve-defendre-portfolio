import ProjectCard from "@/components/ProjectCard";
import MobileProjectCard from "@/components/MobileProjectCard";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-4">Projects</h1>
      <p className="text-sm lg:text-base text-gray-600 mb-6 lg:mb-8">
        A collection of projects I&apos;ve built for clients and personal ventures.
      </p>

      {/* Mobile Projects */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <MobileProjectCard key={project.title} {...project} />
        ))}
      </div>

      {/* Desktop Projects */}
      <div className="hidden lg:flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
}
