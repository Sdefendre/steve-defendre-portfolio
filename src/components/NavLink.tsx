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
  "aria-label"?: string;
}

export function NavLink({
  href,
  children,
  className,
  target,
  rel,
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

  if (isExternal) {
    return (
      <a
        href={safeHref}
        className={resolvedClassName}
        target={target}
        rel={rel || (target === "_blank" ? "noopener noreferrer" : undefined)}
        aria-label={ariaLabel}
      >
        {resolvedChildren}
      </a>
    );
  }

  return (
    <Link
      href={safeHref}
      prefetch={false}
      className={resolvedClassName}
      aria-current={isActive ? "page" : undefined}
      aria-label={ariaLabel}
    >
      {resolvedChildren}
    </Link>
  );
}
