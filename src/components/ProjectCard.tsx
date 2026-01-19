"use client";

interface ProjectCardProps {
  initials: string;
  title: string;
  description: string;
  tags: string[];
  gradient?: string;
  url?: string;
  image?: string;
  useIframe?: boolean;
}

export default function ProjectCard({
  initials,
  title,
  description,
  tags,
  gradient = "from-indigo-500 to-purple-600",
  url,
  image,
  useIframe = true
}: ProjectCardProps) {
  const CardWrapper = url ? 'a' : 'div';
  const linkProps = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {};

  const renderPreview = () => {
    // If there's a custom image, use it
    if (image) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-top"
        />
      );
    }

    // If there's a URL and iframe is enabled, show iframe
    if (url && useIframe) {
      return (
        <iframe
          src={url}
          title={title}
          className="w-[900px] h-[600px] origin-top-left pointer-events-none border-0"
          style={{ transform: 'scale(0.2)' }}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }

    // Fallback to gradient
    return (
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold text-lg`}>
        {initials}
      </div>
    );
  };

  return (
    <CardWrapper
      {...linkProps}
      className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <div className="w-full sm:w-[180px] h-[160px] sm:h-[120px] rounded-lg overflow-hidden flex-shrink-0 relative bg-gray-100">
        {renderPreview()}
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
