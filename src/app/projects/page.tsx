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

export default function Projects() {
  const [featuredProject, ...otherProjects] = projects;
  const totalLabel = String(projects.length).padStart(2, "0");

  return (
    <div className="space-y-20 lg:space-y-28">
      <header className="spatial-reveal grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)] lg:items-end lg:gap-16">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
            Live software, not concept boards
          </p>
          <h1 className="mt-4 max-w-[10ch] font-display text-[clamp(3.5rem,8vw,8rem)] font-medium leading-[0.86] tracking-[-0.06em] text-[var(--foreground)]">
            Projects
          </h1>
        </div>
        <div className="space-y-5 border-l border-[var(--border)] pl-5">
          <p className="max-w-[54ch] text-base leading-8 text-[var(--muted-foreground)]">
            A working portfolio of studio, client, and founder-led builds: websites,
            booking flows, transition tools, and personal brands that moved from idea
            to shipped product.
          </p>
          <dl className="grid grid-cols-2 gap-4 sm:max-w-xs">
            <div>
              <dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                Builds
              </dt>
              <dd className="mt-1 text-sm font-bold text-[var(--foreground)]">
                {totalLabel} shipped
              </dd>
            </div>
            <div>
              <dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                Layout
              </dt>
              <dd className="mt-1 text-sm font-bold text-[var(--foreground)]">
                Featured + archive
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {featuredProject && (
        <section aria-labelledby="featured-project-heading">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                01 · Featured
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
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              02–{totalLabel} · Archive
            </p>
            <h2
              id="project-archive-heading"
              className="mt-3 font-display text-[clamp(2.5rem,5vw,4.75rem)] font-medium leading-none tracking-[-0.04em] text-[var(--foreground)]"
            >
              Project archive
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[var(--muted-foreground)]">
            Client sites, product builds, and open-source work in a consistent
            two-column grid.
          </p>
        </div>

        <ul className="grid list-none grid-cols-1 items-stretch gap-6 p-0 md:grid-cols-2 md:gap-7 xl:gap-8">
          {otherProjects.map((project, index) => (
            <li
              key={project.title}
              className="spatial-reveal flex min-w-0 flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-3 px-1">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                  {String(index + 2).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-[var(--border)]" aria-hidden="true" />
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {project.initials}
                </span>
              </div>
              <div className="flex min-h-0 flex-1 flex-col [&_a]:h-full [&_a]:min-h-full">
                <ProjectCard {...project} variant="detailed" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
