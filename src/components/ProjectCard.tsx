import Image from "next/image";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import type { ProjectStatus } from "@/data/projects";
import { isSafeHref } from "@/utils/url";

type ProjectCardVariant = "compact" | "detailed" | "featured";

interface ProjectCardProps {
  initials: string;
  title: string;
  description: string;
  role: string;
  outcome: string;
  tags: string[];
  status?: ProjectStatus;
  gradient?: string;
  url?: string;
  image?: string;
  priority?: boolean;
  ctaLabel?: string;
  variant?: ProjectCardVariant;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ProjectPreviewFallback({
  initials,
  gradient,
}: {
  initials: string;
  gradient: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-br ${gradient}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
      <div className="absolute inset-x-6 top-1/2 h-px bg-white/35" />
      <div className="absolute left-1/2 inset-y-6 w-px bg-white/25" />
      <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/15 font-display text-2xl font-semibold text-white backdrop-blur-md">
        {initials}
      </span>
    </div>
  );
}

function ProjectCard({
  initials,
  title,
  description,
  role,
  outcome,
  tags,
  status = "Live",
  gradient = "from-slate-700 to-sky-700",
  url,
  image,
  priority = false,
  ctaLabel = "View live site",
  variant = "detailed",
}: ProjectCardProps) {
  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";
  const hasSafeUrl = Boolean(url && isSafeHref(url));
  const isLive = status === "Live";
  const imageAlt = `${title} live project preview for ${role}`;
  const imageSizes = isCompact
    ? "(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 42vw, 420px"
    : isFeatured
      ? "(max-width: 1023px) calc(100vw - 3rem), 58vw"
      : "(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 50vw, 520px";

  const cardClassName = cx(
    "spatial-window group relative isolate flex flex-col overflow-hidden rounded-[2rem] border border-[var(--border)]",
    !isCompact && "h-full",
    hasSafeUrl &&
      "focus-ring cursor-pointer motion-safe:transition-[transform,background-color] motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:bg-[var(--surface-elevated)] motion-safe:active:translate-y-0 motion-reduce:transition-none",
    isFeatured && "lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]",
  );

  const mediaClassName = cx(
    "relative w-full flex-shrink-0 overflow-hidden bg-[var(--surface-muted)]",
    isFeatured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[31rem]" : "aspect-[16/10]",
  );

  const cardContent = (
    <>
      <div className={mediaClassName}>
        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between gap-3 rounded-full border border-white/20 bg-[color-mix(in_oklab,var(--background)_72%,transparent)] px-3 py-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[var(--foreground)] backdrop-blur-xl sm:inset-x-4 sm:top-4">
            <span className="inline-flex items-center gap-2" data-testid="project-status">
              <span
                aria-hidden="true"
                className={cx(
                  "h-2 w-2 rounded-full",
                  isLive
                    ? "bg-emerald-400 shadow-[0_0_0.75rem_rgba(52,211,153,0.8)]"
                    : "bg-amber-300 shadow-[0_0_0.75rem_rgba(252,211,77,0.7)]",
                )}
              />
              {isLive ? "Live deployment" : "Prototype"}
            </span>
          {image && <span>{initials}</span>}
        </div>

        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes={imageSizes}
            className="pointer-events-none object-cover object-top motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.015] motion-reduce:transition-none"
            priority={priority || isFeatured}
          />
        ) : (
          <ProjectPreviewFallback initials={initials} gradient={gradient} />
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[color-mix(in_oklab,var(--background)_62%,transparent)] to-transparent"
        />
      </div>

      <div className={cx("flex min-w-0 flex-1 flex-col p-5 sm:p-6", isFeatured && "lg:p-8")}>
        <div className="flex items-start justify-between gap-5">
          <h3
            className={cx(
              "font-display font-medium tracking-[-0.04em] text-[var(--foreground)]",
              isFeatured ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl",
            )}
          >
            {title}
          </h3>
          {hasSafeUrl && (
            <span className="pointer-events-none flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" />
            </span>
          )}
        </div>

        <p
          className={cx(
            "mt-4 text-sm leading-7 text-[var(--muted-foreground)]",
            isCompact && "line-clamp-3",
          )}
        >
          {description}
        </p>

        <dl className="mt-6 grid gap-5 border-t border-[var(--border)] pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-[var(--muted)]">
              Role
            </dt>
            <dd className="mt-2 text-xs font-bold leading-6 text-[var(--foreground)]">
              {role}
            </dd>
          </div>
          <div>
            <dt className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-[var(--muted)]">
              Outcome
            </dt>
            <dd
              className={cx(
                "mt-2 text-xs leading-6 text-[var(--muted-foreground)]",
                isCompact && "line-clamp-3",
              )}
            >
              {outcome}
            </dd>
          </div>
        </dl>

        <div
          className="mt-6 flex flex-wrap gap-x-4 gap-y-2"
          data-testid="project-tags"
        >
          {tags.map((tag, index) => (
            <span
              key={tag}
              className={cx(
                "text-xs font-bold text-[var(--foreground)]",
                isCompact && index >= 3 ? "hidden lg:inline" : "",
              )}
            >
              {tag}
            </span>
          ))}
        </div>

        {hasSafeUrl && (
          <span className="pointer-events-none mt-auto inline-flex min-h-11 w-fit items-end gap-2 pt-7 text-sm font-bold text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
            {ctaLabel}
            <span className="sr-only">opens in a new tab</span>
          </span>
        )}
      </div>
    </>
  );

  if (hasSafeUrl) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${ctaLabel} for ${title} (opens in new tab)`}
        className={cardClassName}
      >
        {cardContent}
      </a>
    );
  }

  return <div className={cardClassName}>{cardContent}</div>;
}

export default ProjectCard;
