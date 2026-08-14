"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { primaryNavItems } from "@/data/navigation";
import { socialLinks } from "@/data/socials";
import { NavLink } from "./NavLink";

export default function Sidebar() {
  return (
    <aside className="fixed inset-x-0 top-0 z-40 hidden pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] pt-[max(1rem,env(safe-area-inset-top,0px))] md:block lg:px-6">
      <div className="spatial-glass spatial-dock mx-auto flex min-h-[4.75rem] w-full max-w-[1180px] items-center gap-1.5 rounded-[1.5rem] px-2 py-2.5 lg:gap-3 lg:rounded-[1.75rem] lg:px-3 xl:gap-4">
        <div className="flex min-w-0 shrink-0 items-center gap-3 pl-1 lg:min-w-[11.5rem]">
          <div className="relative shrink-0">
            <Image
              src="/headshot.jpg"
              alt="Steve Defendre"
              width={46}
              height={46}
              className="h-[46px] w-[46px] rounded-full object-cover object-top ring-1 ring-[var(--border-strong)] shadow-[0_10px_28px_rgba(0,4,8,0.46)]"
              priority
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-[var(--surface-opaque)] bg-[var(--success)] shadow-[0_0_12px_rgba(137,215,173,0.72)]"
            />
          </div>
          <div className="hidden min-w-0 lg:block">
            <p className="truncate font-display text-[1.02rem] font-semibold leading-tight text-[var(--foreground)]">
              Steve Defendre
            </p>
            <p className="mt-0.5 hidden truncate text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--muted)] xl:block">
              Full-stack developer
            </p>
          </div>
        </div>

        <nav
          className="flex min-w-0 flex-1 items-center justify-center gap-0.5 lg:gap-1"
          aria-label="Primary navigation"
        >
          {primaryNavItems.map((item) => (
            <NavLink
              key={item.name}
              href={item.href}
              aria-label={item.name}
              className={({ isActive }) =>
                `focus-ring dock-link group relative flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border px-3 text-sm font-semibold xl:px-4 ${
                  isActive
                    ? "dock-link-active"
                    : "border-transparent text-[var(--muted-foreground)] hover:border-[var(--border)] hover:bg-[rgba(207,244,251,0.055)] hover:text-[var(--foreground)]"
                }`
              }
            >
              {({ isActive }) => {
                const Icon = isActive ? item.activeIcon : item.icon;
                return (
                  <>
                    <Icon
                      aria-hidden="true"
                      className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${
                        isActive
                          ? "text-[var(--accent-strong)]"
                          : "text-[var(--muted)] group-hover:text-[var(--accent)]"
                      }`}
                    />
                    <span aria-hidden="true" className="hidden xl:inline">
                      {item.name}
                    </span>
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <div
            className="hidden min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-transparent px-2 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)] lg:flex xl:px-3"
            title="Available for select builds and advisory work"
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full bg-[var(--success)] shadow-[0_0_10px_rgba(137,215,173,0.62)]"
            />
            <span className="hidden xl:inline">Available</span>
            <span className="sr-only xl:hidden">Available for work</span>
          </div>

          <nav className="hidden items-center 2xl:flex" aria-label="Social links">
            {socialLinks.map((link) => (
              <NavLink
                key={link.name}
                href={link.href}
                target="_blank"
                aria-label={link.name}
                className="focus-ring dock-link flex min-h-11 min-w-11 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[rgba(207,244,251,0.055)] hover:text-[var(--foreground)]"
              >
                <link.icon aria-hidden="true" className="h-[17px] w-[17px]" />
              </NavLink>
            ))}
          </nav>

          <Link
            href="/contact"
            prefetch={false}
            aria-label="Start a project"
            className="focus-ring group flex min-h-11 w-11 shrink-0 items-center justify-center gap-0 rounded-full bg-[var(--accent-strong)] px-0 text-sm font-extrabold text-[var(--accent-foreground)] shadow-[0_10px_28px_rgba(0,4,8,0.38)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 lg:w-auto lg:gap-2 lg:px-4"
          >
            <span aria-hidden="true" className="hidden lg:inline">Start a project</span>
            <ArrowRightIcon
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </aside>
  );
}
