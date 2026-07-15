import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects | Steve Defendre",
  description:
    "Explore software, booking, healthcare, transition, and portfolio projects built by Steve Defendre.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Steve Defendre",
    description:
      "Explore software, booking, healthcare, transition, and portfolio projects built by Steve Defendre.",
    url: "/projects",
  },
};

const archivePlacement = [
  "md:col-span-7",
  "md:col-span-5 md:mt-16",
  "md:col-span-5",
  "md:col-span-7 md:mt-10",
  "md:col-span-6 md:col-start-4",
] as const;

export default function Projects() {
  const [featuredProject, ...otherProjects] = projects;

  return (
    <div className="space-y-20 lg:space-y-28">
      <header className="spatial-reveal grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)] lg:items-end lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            Live software, not concept boards
          </p>
          <h1 className="mt-4 max-w-[10ch] font-display text-[clamp(3.5rem,8vw,8rem)] font-medium leading-[0.86] tracking-[-0.06em] text-[var(--foreground)]">
            Projects
          </h1>
        </div>
        <p className="max-w-[54ch] border-l border-[var(--border)] pl-5 text-base leading-8 text-[var(--muted-foreground)]">
          A working portfolio of studio, client, and founder-led builds: websites,
          booking flows, transition tools, and personal brands that moved from idea
          to shipped product.
        </p>
      </header>

      {featuredProject && (
        <section aria-labelledby="featured-project-heading">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                Deployment 01
              </p>
              <h2
                id="featured-project-heading"
                className="mt-2 font-display text-[clamp(2rem,4vw,3.5rem)] font-medium tracking-[-0.04em] text-[var(--foreground)]"
              >
                Featured build
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[var(--muted-foreground)]">
              The studio itself: positioning, product thinking, and full-stack
              delivery expressed as one living system.
            </p>
          </div>
          <div className="spatial-reveal">
            <ProjectCard {...featuredProject} variant="featured" />
          </div>
        </section>
      )}

      <section aria-labelledby="project-archive-heading">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            Deployments 02—{String(projects.length).padStart(2, "0")}
          </p>
          <h2
            id="project-archive-heading"
            className="mt-3 font-display text-[clamp(2.5rem,5vw,4.75rem)] font-medium leading-none tracking-[-0.04em] text-[var(--foreground)]"
          >
            Project archive
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-12 md:items-start">
          {otherProjects.map((project, index) => (
            <div
              key={project.title}
              className={`spatial-reveal ${archivePlacement[index] ?? "md:col-span-6"}`}
            >
              <ProjectCard {...project} variant="detailed" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
