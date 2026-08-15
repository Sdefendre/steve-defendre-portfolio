import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { BriefcaseIcon, EnvelopeIcon, HomeIcon } from "@heroicons/react/24/outline";
import HomeNavigation from "@/components/HomeNavigation";

export const metadata: Metadata = {
  title: "Page Not Found | Steve Defendre",
  description:
    "The requested page could not be found. Return to Steve Defendre's portfolio, projects, or contact page.",
};

const recoveryLinks = [
  {
    label: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: BriefcaseIcon,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: EnvelopeIcon,
  },
] as const;

export default async function NotFound() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <>
      <a
        href="#main-content"
        className="focus-ring sr-only fixed left-[max(1rem,env(safe-area-inset-left,0px))] top-[max(1rem,env(safe-area-inset-top,0px))] z-[60] min-h-11 items-center rounded-full bg-[var(--accent-strong)] px-5 py-2.5 text-sm font-bold text-[var(--accent-foreground)] shadow-[0_16px_48px_rgba(0,4,8,0.5)] focus:not-sr-only focus:flex"
      >
        Skip to content
      </a>
      <div className="relative z-10 min-h-screen w-full overflow-x-clip">
        <HomeNavigation activeHref={null} />
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col pb-[calc(12rem+env(safe-area-inset-bottom,0px))] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pt-7 focus:outline-none sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.5rem,env(safe-area-inset-right,0px))] sm:pt-10 md:pb-12 md:pt-36 lg:px-10 xl:px-14 2xl:px-16"
        >
          <div className="w-full min-w-0 flex-1">
            <div className="spatial-window spatial-reveal relative isolate mx-auto max-w-5xl overflow-hidden rounded-[2.25rem] p-6 sm:p-10 lg:p-14">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-28 -z-10 font-display text-[clamp(12rem,34vw,32rem)] font-semibold leading-none tracking-[-0.1em] text-[color-mix(in_oklab,var(--accent)_10%,transparent)]"
              >
                404
              </div>

              <div className="relative max-w-2xl py-6 sm:py-16">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                  Steve Defendre · Signal lost
                </p>
                <h1 className="mt-4 max-w-[9ch] font-display text-[clamp(3.25rem,8vw,7rem)] font-medium leading-[0.9] tracking-[-0.055em] text-[var(--foreground)]">
                  Page not found.
                </h1>
                <p className="mt-6 max-w-[54ch] text-base leading-8 text-[var(--muted-foreground)]">
                  This route drifted out of view. The portfolio, project work, and contact
                  channel are still online.
                </p>

                <nav aria-label="Page recovery" className="mt-7 sm:mt-9">
                  <ul className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:flex-wrap">
                    {recoveryLinks.map((link) => (
                      <li key={link.href} className="last:col-span-2 sm:last:col-span-1">
                        <Link
                          href={link.href}
                          className="spatial-glass focus-ring group inline-flex min-h-12 w-full items-center gap-3 rounded-full border border-[var(--border)] px-5 text-sm font-bold text-[var(--foreground)] transition-[transform,background-color] duration-300 hover:-translate-y-1 hover:bg-[var(--surface-elevated)] active:translate-y-0 sm:w-auto"
                        >
                          <link.icon aria-hidden="true" className="h-4 w-4 text-[var(--accent)]" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <p className="relative border-t border-[var(--border)] pt-5 text-xs text-[var(--muted)]">
                Built by{" "}
                <a
                  href="https://defendresolutions.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring rounded-sm font-bold text-[var(--foreground)] underline decoration-[var(--accent)] underline-offset-4 transition-colors hover:text-[var(--accent)]"
                >
                  Defendre Solutions
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
      <script defer src="/_vercel/insights/script.js" nonce={nonce} />
    </>
  );
}
