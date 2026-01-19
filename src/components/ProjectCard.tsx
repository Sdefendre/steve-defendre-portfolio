interface ProjectCardProps {
  initials: string;
  title: string;
  description: string;
  tags: string[];
  gradient?: string;
  url?: string;
}

export default function ProjectCard({
  initials,
  title,
  description,
  tags,
  gradient = "from-indigo-500 to-purple-600",
  url
}: ProjectCardProps) {
  const CardWrapper = url ? 'a' : 'div';
  const linkProps = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <CardWrapper
      {...linkProps}
      className="flex gap-6 p-5 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <div className={`w-[180px] h-[120px] rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}>
        {initials}
      </div>
      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
}
