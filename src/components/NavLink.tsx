"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

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

  if (isExternal) {
    return (
      <a
        href={href}
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
      href={href}
      className={resolvedClassName}
      aria-current={isActive ? "page" : undefined}
      aria-label={ariaLabel}
    >
      {resolvedChildren}
    </Link>
  );
}
