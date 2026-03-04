import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-4">Projects</h1>
      <p className="text-sm lg:text-base text-gray-600 mb-6 lg:mb-8">
        A collection of projects I&apos;ve built for clients and personal ventures.
      </p>

      {/* Responsive Projects Container */}
      <div className="grid grid-cols-1 gap-4 lg:flex lg:flex-col lg:gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
}
