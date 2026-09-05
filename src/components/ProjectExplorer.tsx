"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import ProjectCard from "@/components/ProjectCard";
import {
  filterProjectCatalog,
  parseProjectFilter,
  projectsFilterHref,
  type Project,
  type ProjectCategory,
  type ProjectFilter,
} from "@/data/projects";

interface ProjectExplorerProps {
  projects: readonly Project[];
  categories: readonly ProjectCategory[];
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function statusTone(status: Project["status"]) {
  switch (status) {
    case "Live":
      return "bg-[color-mix(in_oklab,var(--accent)_10%,var(--surface))] text-[var(--foreground)]";
    case "Prototype":
      return "bg-[color-mix(in_oklab,var(--surface-muted)_68%,var(--accent)_12%)] text-[var(--foreground)]";
    default:
      return "bg-[var(--surface)] text-[var(--foreground)]";
  }
}

function statusDot(status: Project["status"]) {
  return status === "Live" ? "bg-emerald-400" : "bg-amber-400";
}

export default function ProjectExplorer({
  projects,
  categories,
}: ProjectExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCategory = parseProjectFilter(searchParams.get("category"));
  const [activeCategory, setActiveCategory] = useState<ProjectFilter>(urlCategory);

  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  function selectCategory(category: ProjectFilter) {
    setActiveCategory(category);
    const href = category === "All" ? "/projects" : projectsFilterHref(category);
    router.replace(href, { scroll: false });
  }

  const visibleProjects = useMemo(
    () => filterProjectCatalog(projects, activeCategory),
    [activeCategory, projects],
  );

  const totalCount = projects.length;
  const visibleCount = visibleProjects.length;
  const countLabel =
    activeCategory === "All"
      ? `Showing ${visibleCount} of ${totalCount} projects`
      : `Showing ${visibleCount} ${activeCategory} ${visibleCount === 1 ? "project" : "projects"}`;

  return (
    <section
      aria-labelledby="project-explorer-heading"
      className="space-y-6 sm:space-y-8"
    >
      <header className="spatial-reveal max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
          Shipped work
        </p>
        <h1
          id="project-explorer-heading"
          className="mt-3 font-display text-[clamp(3rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.055em] text-[var(--foreground)]"
        >
          Projects
        </h1>
        <p className="mt-4 max-w-[58ch] text-base leading-7 text-[var(--muted-foreground)] sm:text-lg">
          Studio work, client sites, and independent products. Explore the work
          and open a case study for the details.
        </p>
      </header>

      <div className="space-y-3">
        <p aria-live="polite" className="text-sm font-semibold text-[var(--muted-foreground)]">
          {countLabel}
        </p>

        <div
          aria-label="Project category filters"
          className="flex flex-wrap gap-3"
          role="group"
        >
          {(["All", ...categories] as const).map((category) => {
            const pressed = category === activeCategory;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={pressed}
                onClick={() => selectCategory(category)}
                className={cx(
                  "focus-ring inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-sm font-bold transition-colors",
                  pressed
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-elevated)]",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {visibleProjects.length > 0 ? (
        <div className="grid gap-x-6 gap-y-8 xl:grid-cols-2">
          {visibleProjects.map((project) => (
            <article
              key={project.title}
              className="spatial-reveal relative grid grid-rows-[auto_1fr_auto] gap-4 xl:row-span-3 xl:grid-rows-subgrid"
            >
              <div className="flex flex-wrap items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                <span className="inline-flex min-h-9 items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-3">
                  {project.category}
                </span>
                <span>{project.year}</span>
                <span
                  data-testid="project-status"
                  className={cx(
                    "inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--border)] px-3",
                    statusTone(project.status),
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cx("h-2 w-2 rounded-full", statusDot(project.status))}
                  />
                  {project.status}
                </span>
              </div>

              <ProjectCard {...project} variant="compact" showStatus={false} />

              <details className="group relative z-10 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)]/85 p-4 sm:p-5">
                <summary className="focus-ring relative z-10 flex min-h-11 w-full cursor-pointer list-none items-center justify-between gap-4 rounded-[1.15rem] outline-none">
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                      Case study
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                      Challenge, approach, and impact
                      <span className="sr-only"> for {project.title}</span>
                    </p>
                  </div>
                  <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)]">
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-open:rotate-180"
                    />
                  </span>
                </summary>

                <dl className="mt-4 grid gap-4 border-t border-[var(--border)] pt-4 sm:grid-cols-3">
                  {(
                    [
                      ["Challenge", project.caseStudy.challenge],
                      ["Approach", project.caseStudy.approach],
                      ["Impact", project.caseStudy.impact],
                    ] as const
                  ).map(([label, value], index) => (
                    <div
                      key={label}
                      className={cx(
                        "space-y-2",
                        index > 0 && "sm:border-l sm:border-[var(--border)] sm:pl-4",
                      )}
                    >
                      <dt className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                        {label}
                      </dt>
                      <dd className="text-sm leading-7 text-[var(--muted-foreground)]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>
            </article>
          ))}
        </div>
      ) : (
        <div className="spatial-window spatial-reveal rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
            No matches
          </p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-medium leading-none tracking-[-0.04em] text-[var(--foreground)]">
            Nothing in {activeCategory} right now.
          </h2>
          <p className="mt-4 max-w-[44ch] text-base leading-7 text-[var(--muted-foreground)]">
            Show everything, or pick another category.
          </p>
          <button
            type="button"
            onClick={() => selectCategory("All")}
            className="focus-ring mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-5 text-sm font-bold text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]"
          >
            Show all projects
          </button>
        </div>
      )}
    </section>
  );
}
