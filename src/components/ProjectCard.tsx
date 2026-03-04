"use client";

import { memo } from "react";
import { Project } from "@/data/projects";

const ProjectPreview = memo(function ProjectPreview({
  initials,
  title,
  gradient,
  url,
  image,
  useIframe
}: {
  initials: string;
  title: string;
  gradient: string;
  url?: string;
  image?: string;
  useIframe: boolean;
}) {
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
      <div className="relative w-full h-full">
        {/*
          Single iframe with responsive dimensions and scaling to avoid multiple network requests.
          - Mobile (default): 1440x900 scaled by 0.28
          - Desktop (sm): 900x600 scaled by 0.2

          Security note: sandbox="allow-scripts allow-same-origin" is used to
          match the original implementation, though combining these is generally
          avoided in some security conventions.
        */}
        <iframe
          src={url}
          title={title}
          className="absolute top-0 left-0 w-[1440px] h-[900px] sm:w-[900px] sm:h-[600px] origin-top-left pointer-events-none border-0 scale-[0.28] sm:scale-[0.2]"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    );
  }

  // Fallback to gradient
  return (
    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold text-lg`}>
      <span className="sm:text-lg text-3xl font-bold opacity-50 sm:opacity-100">{initials}</span>
    </div>
  );
});

export default function ProjectCard({
  initials,
  title,
  description,
  tags,
  gradient = "from-indigo-500 to-purple-600",
  url,
  image,
  useIframe = true
}: Project) {
  const CardWrapper = url ? 'a' : 'div';
  const linkProps = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <CardWrapper
      {...linkProps}
      className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 bg-white rounded-xl lg:rounded-2xl border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] sm:active:scale-[1] transition-all cursor-pointer overflow-hidden"
    >
      <div className="w-full sm:w-[180px] h-[250px] sm:h-[120px] rounded-lg overflow-hidden flex-shrink-0 relative bg-gray-100">
        <ProjectPreview
          initials={initials}
          title={title}
          gradient={gradient}
          url={url}
          image={image}
          useIframe={useIframe}
        />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-lg sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2 sm:line-clamp-none">{description}</p>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag, index) => (
            <span
              key={tag}
              className={`px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full sm:rounded ${index >= 3 ? 'hidden sm:inline-block' : ''}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
}
