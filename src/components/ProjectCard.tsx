"use client";

import { memo, useMemo } from "react";

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

// Memoized iframe component to prevent unnecessary reloads
const CachedIframe = memo(function CachedIframe({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  return (
    <iframe
      src={url}
      title={title}
      className="w-[1440px] h-[960px] origin-top-left pointer-events-none border-0 scale-[0.28] lg:scale-[0.125]"
      loading="lazy"
      sandbox="allow-scripts"
    />
  );
});

function ProjectCard({
  initials,
  title,
  description,
  tags,
  gradient = "from-indigo-500 to-purple-600",
  url,
  image,
  useIframe = true,
}: ProjectCardProps) {
  const CardWrapper = url ? "a" : "div";
  const linkProps = url
    ? { href: url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  // Memoize the preview to prevent unnecessary re-renders
  const preview = useMemo(() => {
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

    // If there's a URL and iframe is enabled, show cached iframe
    if (url && useIframe) {
      return <CachedIframe url={url} title={title} />;
    }

    // Fallback to gradient
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold`}
      >
        <span className="text-3xl lg:text-lg opacity-50 lg:opacity-100">
          {initials}
        </span>
      </div>
    );
  }, [image, url, useIframe, title, gradient, initials]);

  return (
    <CardWrapper
      {...linkProps}
      className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-5 bg-white rounded-2xl lg:rounded-xl border border-gray-100 lg:border-gray-200 shadow-sm lg:shadow-none hover:shadow-lg active:scale-[0.98] lg:active:scale-100 lg:hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden"
    >
      <div className="w-full lg:w-[180px] h-[250px] lg:h-[120px] rounded-lg overflow-hidden flex-shrink-0 relative bg-gray-100">
        {preview}
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
    </CardWrapper>
  );
}

export default memo(ProjectCard);
