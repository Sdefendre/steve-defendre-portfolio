"use client";

import { primaryNavItems } from "@/data/navigation";
import { NavLink } from "./NavLink";

export default function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] pt-2 md:hidden"
      aria-label="Primary navigation"
    >
      <div className="spatial-glass spatial-dock mx-auto flex min-h-[4.5rem] max-w-md items-stretch justify-between gap-1 rounded-[1.6rem] p-1.5">
        {primaryNavItems.map((item) => (
          <NavLink
            key={item.name}
            href={item.href}
            forceDocumentNavigation={item.href === "/"}
            className={({ isActive }) =>
              `focus-ring dock-link relative flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[1.15rem] border px-1.5 py-2 text-center ${
                isActive
                  ? "dock-link-active"
                  : "border-transparent text-[var(--muted)] active:bg-[rgba(207,244,251,0.055)] active:text-[var(--foreground)]"
              }`
            }
          >
            {({ isActive }) => {
              const Icon = isActive ? item.activeIcon : item.icon;
              return (
                <>
                  <Icon
                    aria-hidden="true"
                    className={`h-5 w-5 shrink-0 ${
                      isActive ? "text-[var(--accent-strong)]" : ""
                    }`}
                  />
                  <span className="max-w-full truncate text-[0.66rem] font-bold leading-none tracking-[0.01em]">
                    {item.name}
                  </span>
                </>
              );
            }}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
