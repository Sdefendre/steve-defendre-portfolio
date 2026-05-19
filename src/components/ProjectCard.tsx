import Image from "next/image";

interface ProjectCardProps {
  initials: string;
  title: string;
  description: string;
  tags: string[];
  gradient?: string;
  url?: string;
  image?: string;
  priority?: boolean;
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
      className={`absolute inset-0 bg-gradient-to-br ${gradient} overflow-hidden`}
    >
      <div className="absolute inset-x-4 top-4 flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-white/45" />
        <span className="h-2 w-2 rounded-full bg-white/30" />
        <span className="h-2 w-2 rounded-full bg-white/30" />
      </div>
      <div className="absolute inset-x-5 top-10 space-y-2">
        <span className="block h-3 w-2/3 rounded-full bg-white/75" />
        <span className="block h-2 w-full rounded-full bg-white/35" />
        <span className="block h-2 w-4/5 rounded-full bg-white/30" />
      </div>
      <div className="absolute bottom-5 left-5 flex items-end gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-lg font-semibold text-white ring-1 ring-white/25 lg:h-10 lg:w-10 lg:text-sm">
          {initials}
        </span>
        <span className="mb-1 block h-8 w-24 rounded-lg bg-white/15 ring-1 ring-white/20 lg:h-6 lg:w-16" />
      </div>
      <div className="absolute -right-10 -bottom-14 h-36 w-36 rounded-full bg-white/15" />
    </div>
  );
}

function ProjectCard({
  initials,
  title,
  description,
  tags,
  gradient = "from-indigo-500 to-purple-600",
  url,
  image,
  priority = false,
}: ProjectCardProps) {
  const cardClassName =
    "flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-5 bg-white rounded-2xl lg:rounded-xl border border-gray-100 lg:border-gray-200 shadow-sm lg:shadow-none hover:shadow-lg active:scale-[0.98] lg:active:scale-100 lg:hover:-translate-y-0.5 transition-all overflow-hidden";

  const cardContent = (
    <>
      <div className="relative w-full aspect-[16/10] min-h-[190px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 lg:h-[120px] lg:min-h-0 lg:w-[180px] lg:aspect-auto">
        {image ? (
          <Image
            src={image}
            alt={`${title} project preview`}
            fill
            sizes="(max-width: 1023px) calc(100vw - 2rem), 180px"
            className="object-cover object-top"
            priority={priority}
          />
        ) : (
          <ProjectPreviewFallback initials={initials} gradient={gradient} />
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-lg lg:text-base font-semibold text-gray-900 mb-1 lg:mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 lg:text-gray-600 mb-3 lg:mb-4 leading-relaxed line-clamp-2 lg:line-clamp-none">
          {description}
        </p>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag, index) => (
            <span
              key={tag}
              className={`px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium lg:font-normal rounded-full lg:rounded ${
                index >= 3 ? "hidden lg:inline-block" : ""
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  const isSafeUrl = url && (url.trim().toLowerCase().startsWith("http://") || url.trim().toLowerCase().startsWith("https://"));

  if (isSafeUrl) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cardClassName} cursor-pointer`}
      >
        {cardContent}
      </a>
    );
  }

  return <div className={cardClassName}>{cardContent}</div>;
}

export default ProjectCard;
