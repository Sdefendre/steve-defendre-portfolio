import ProjectCard from "@/components/ProjectCard";
import { projectCategories, projects, projectsFilterHref } from "@/data/projects";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
import ResponsiveImage from "@/components/ResponsiveImage";
import { ExternalLink } from "@/components/ExternalLink";

const constellationPlacement = [
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-16",
  "lg:col-span-5",
  "lg:col-span-7 lg:mt-10",
] as const;

export default function Home() {
  const selectedProjects = projects.slice(0, 4);
  const liveProjectCount = projects.filter((project) => project.status === "Live").length;
  const telemetry = [
    { label: "Studio", value: "Defendre Solutions" },
    { label: "Showcase", value: `${projects.length} public builds` },
    { label: "Live now", value: `${liveProjectCount} active links` },
  ];

  return (
    <div className="space-y-20 lg:space-y-28">
      <header className="spatial-window spatial-reveal spatial-glow relative isolate overflow-hidden rounded-[2rem] p-5 sm:p-8 lg:p-10 xl:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 -z-10 h-96 w-96 rounded-full bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] blur-3xl"
        />

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(15rem,0.65fr)] lg:gap-14">
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              <span className="hidden min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 lg:inline-flex">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_1rem_rgba(52,211,153,0.8)]"
                />
                Open to new work
              </span>
              <span className="inline-flex items-center gap-2 px-1">
                <SparklesIcon aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
                Veteran founder · Full-stack builder
              </span>
            </div>

            <h1 className="max-w-[13ch] font-display text-[clamp(2.5rem,7vw,7rem)] font-medium leading-[0.92] tracking-[-0.055em] text-[var(--foreground)]">
              I build software you can keep.
            </h1>

            <p className="mt-5 max-w-[62ch] text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
              I&apos;m Steve Defendre, a veteran, CS graduate, and founder of{" "}
              <ExternalLink
                href="https://defendresolutions.com"
                className="focus-ring rounded-sm font-semibold text-[var(--foreground)] underline decoration-[var(--accent)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--accent)]"
              >
                Defendre Solutions
              </ExternalLink>
              . I take loose requirements and ship booking flows, portfolios,
              ops tools, and the other applications a small team still has to
              run next year.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/contact"
                className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-bold text-[var(--accent-foreground)] shadow-[0_18px_45px_var(--shadow-warm)] transition-[transform,filter] duration-300 hover:-translate-y-1 hover:brightness-110 active:translate-y-0"
              >
                Start a project
                <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
              </a>
              <a
                href="/projects"
                className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 text-sm font-bold text-[var(--foreground)] transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-[var(--surface-elevated)] active:translate-y-0"
              >
                View projects
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[14.5rem] sm:max-w-[16rem] lg:max-w-[20rem] lg:justify-self-end">
            <div
              aria-hidden="true"
              className="absolute inset-5 translate-x-5 translate-y-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--surface-muted)] opacity-60"
            />
            <div className="spatial-glass relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-[var(--border)] p-2 shadow-[0_32px_80px_var(--shadow-warm)]">
              <ResponsiveImage
                src="/headshot.jpg"
                alt="Steve Defendre, veteran founder and full-stack engineer"
                sizes="(max-width: 1023px) 320px, 22vw"
                className="object-cover object-top p-2"
                priority
              />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-[color-mix(in_oklab,var(--background)_74%,transparent)] px-4 py-3 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Steve Defendre
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--foreground)]">
                  Founder · Engineer · Veteran
                </p>
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-10 grid border-t border-[var(--border)] sm:grid-cols-3">
          {telemetry.map((point) => (
            <div
              key={point.label}
              className="border-b border-[var(--border)] py-5 sm:border-b-0 sm:border-r sm:px-5 sm:last:border-r-0 sm:first:pl-0"
            >
              <dt className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                {point.label}
              </dt>
              <dd className="mt-2 text-sm font-bold text-[var(--foreground)]">
                {point.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <section aria-labelledby="selected-work-heading">
        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.62fr)] lg:items-end lg:gap-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              Selected work
            </p>
            <h2
              id="selected-work-heading"
              className="mt-3 max-w-[15ch] font-display text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-none tracking-[-0.04em] text-[var(--foreground)]"
            >
              A few I shipped.
            </h2>
            <p className="mt-4 max-w-[54ch] text-base leading-7 text-[var(--muted-foreground)]">
              A current sample of studio, client, and product work. Each card
              opens the public project page or repository; the full catalog
              marks prototypes separately.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <nav className="flex flex-wrap gap-2 lg:justify-end" aria-label="Browse projects by category">
              {projectCategories.map((category) => (
                <a
                  key={category}
                  href={projectsFilterHref(category)}
                  className="focus-ring inline-flex min-h-10 items-center rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_82%,transparent)] px-3 text-xs font-bold text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                >
                  {category}
                </a>
              ))}
            </nav>
            <a
              href="/projects"
              className="focus-ring inline-flex min-h-11 w-fit items-center gap-2 rounded-full px-2 text-sm font-bold text-[var(--foreground)] transition-colors hover:text-[var(--accent)]"
            >
              View the full project list
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
          {selectedProjects.map((project, index) => (
            <div
              key={project.title}
              className={`spatial-reveal ${constellationPlacement[index] ?? "md:col-span-6"}`}
            >
              <ProjectCard
                {...project}
                variant={index === 0 ? "featured" : "compact"}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
