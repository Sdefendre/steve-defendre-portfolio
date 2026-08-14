import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await headers();

  return (
    <>
        <a
          href="#main-content"
          className="focus-ring sr-only fixed left-[max(1rem,env(safe-area-inset-left,0px))] top-[max(1rem,env(safe-area-inset-top,0px))] z-[60] min-h-11 items-center rounded-full bg-[var(--accent-strong)] px-5 py-2.5 text-sm font-bold text-[var(--accent-foreground)] shadow-[0_16px_48px_rgba(0,4,8,0.5)] focus:not-sr-only focus:flex"
        >
          Skip to content
        </a>
        <div className="relative z-10 min-h-screen w-full overflow-x-clip">
          <Sidebar />
          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col pb-[calc(10rem+env(safe-area-inset-bottom,0px))] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pt-7 focus:outline-none sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.5rem,env(safe-area-inset-right,0px))] sm:pt-10 md:pb-12 md:pt-36 lg:px-10 xl:px-14 2xl:px-16"
          >
            <div className="w-full min-w-0 flex-1">{children}</div>

            <footer className="mt-16 flex flex-col items-center gap-3 border-t border-[var(--border)] py-7 text-center sm:flex-row sm:justify-between sm:text-left lg:mt-24">
              <p className="text-sm leading-relaxed text-[var(--muted)]">
                Made by{" "}
                <a
                  href="https://defendresolutions.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring rounded-sm font-semibold text-[var(--accent-strong)] transition-colors duration-200 hover:text-[var(--foreground)]"
                >
                  Defendre Solutions
                </a>
              </p>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-[var(--success)] shadow-[0_0_12px_rgba(137,215,173,0.65)]"
                />
                Built with intent
              </p>
            </footer>
          </main>
        </div>

        <MobileNav />
        <Analytics />
    </>
  );
}
