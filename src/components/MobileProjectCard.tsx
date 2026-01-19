"use client";

interface MobileProjectCardProps {
  initials: string;
  title: string;
  description: string;
  tags: string[];
  gradient?: string;
  url?: string;
  image?: string;
}

export default function MobileProjectCard({
  initials,
  title,
  description,
  tags,
  gradient = "from-indigo-500 to-purple-600",
  url,
  image,
}: MobileProjectCardProps) {
  const CardWrapper = url ? 'a' : 'div';
  const linkProps = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <CardWrapper
      {...linkProps}
      className="block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-transform"
    >
      {/* Preview Image */}
      <div className="w-full h-44 relative bg-gray-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-white text-3xl font-bold opacity-50">{initials}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
        <div className="flex gap-2 flex-wrap">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
}
