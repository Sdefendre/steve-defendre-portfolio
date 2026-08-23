import type { ComponentPropsWithoutRef } from "react";

type ExternalLinkProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "rel" | "target"
>;

const newTabDisclosure = "opens in a new tab";

export function ExternalLink({
  children,
  "aria-label": ariaLabel,
  ...props
}: ExternalLinkProps) {
  const textLabel = typeof children === "string" ? children : undefined;
  const accessibleLabel = ariaLabel ?? textLabel;

  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        accessibleLabel
          ? `${accessibleLabel} (${newTabDisclosure})`
          : undefined
      }
    >
      {children}
      {!accessibleLabel && (
        <span className="sr-only"> — {newTabDisclosure}</span>
      )}
    </a>
  );
}
