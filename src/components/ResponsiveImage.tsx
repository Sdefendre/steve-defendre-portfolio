const widths = [256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}

function imageUrl(src: string, width: number) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

/**
 * Server-rendered equivalent of the current next/image markup. Keeping the
 * optimizer URLs and width candidates preserves image selection and quality
 * without adding the next/image client component to the home route.
 */
export default function ResponsiveImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: ResponsiveImageProps) {
  const sourceSet = widths.map((width) => `${imageUrl(src, width)} ${width}w`).join(", ");

  return (
    // React emits the matching image preload when fetchPriority is high.
    // The source set intentionally uses Next's image optimizer endpoint.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl(src, 3840)}
      srcSet={sourceSet}
      sizes={sizes}
      alt={alt}
      className={`absolute inset-0 h-full w-full ${className ?? ""}`}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}
