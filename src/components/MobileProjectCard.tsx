"use client";

import { memo, useMemo } from "react";

interface MobileProjectCardProps {
  initials: string;
  title: string;
  description: string;
  tags: string[];
  gradient?: string;
  url?: string;
  image?: string;
  useIframe?: boolean;
}

// Memoized iframe component to prevent reloading
const CachedIframe = memo(function CachedIframe({
  url,
  title
}: {
  url: string;
  title: string;
}) {
  return (
    <iframe
      src={url}
      title={title}
      className="w-[1440px] h-[900px] origin-top-left pointer-events-none border-0"
      style={{
        transform: 'scale(0.28)',
        transformOrigin: 'top left'
      }}
      loading="eager"
      sandbox="allow-scripts allow-same-origin"
    />
  );
});

function MobileProjectCard({
  initials,
  title,
  description,
  tags,
  gradient = "from-indigo-500 to-purple-600",
  url,
  image,
  useIframe = true,
}: MobileProjectCardProps) {
  const CardWrapper = url ? 'a' : 'div';
  const linkProps = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {};

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
      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-white text-3xl font-bold opacity-50">{initials}</span>
      </div>
    );
  }, [image, url, useIframe, title, gradient, initials]);

  return (
    <CardWrapper
      {...linkProps}
      className="block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden active:scale-[0.98] transition-transform"
    >
      {/* Preview - sized for iPhone Pro Max (430px width - 32px padding = 398px container) */}
      <div className="w-full h-[250px] relative bg-gray-100 overflow-hidden">
        {preview}
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

export default memo(MobileProjectCard);
