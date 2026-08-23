"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isSafeHref } from "@/utils/url";

interface NavLinkProps {
  href: string;
  children: ReactNode | ((props: { isActive: boolean }) => ReactNode);
  className?: string | ((props: { isActive: boolean }) => string);
  target?: string;
  rel?: string;
  forceDocumentNavigation?: boolean;
  "aria-label"?: string;
}

export function NavLink({
  href,
  children,
  className,
  target,
  rel,
  forceDocumentNavigation = false,
  "aria-label": ariaLabel,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const resolvedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  const resolvedChildren =
    typeof children === "function" ? children({ isActive }) : children;

  const isExternal = href.startsWith("http") || target === "_blank";
  const safeHref = isSafeHref(href) ? href : "#";
  const opensInNewTab = target === "_blank";
  const textLabel =
    typeof resolvedChildren === "string" ? resolvedChildren : undefined;
  const baseAccessibleLabel = ariaLabel ?? textLabel;
  const accessibleLabel =
    opensInNewTab && baseAccessibleLabel
      ? `${baseAccessibleLabel} (opens in a new tab)`
      : ariaLabel;

  if (isExternal || forceDocumentNavigation) {
    return (
      <a
        href={safeHref}
        className={resolvedClassName}
        target={target}
        rel={rel || (target === "_blank" ? "noopener noreferrer" : undefined)}
        aria-label={accessibleLabel}
      >
        {resolvedChildren}
        {opensInNewTab && !baseAccessibleLabel && (
          <span className="sr-only"> — opens in a new tab</span>
        )}
      </a>
    );
  }

  return (
    <Link
      href={safeHref}
      prefetch={false}
      className={resolvedClassName}
      aria-current={isActive ? "page" : undefined}
      aria-label={accessibleLabel}
    >
      {resolvedChildren}
    </Link>
  );
}
