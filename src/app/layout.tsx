import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import AnimatedBackground from "@/components/AnimatedBackground";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const localSiteUrl = new URL("http://localhost:3000");

const SCHEME_REGEX = /^[a-z][a-z\d+\-.]*:\/\//i;
const PROTOCOL_RELATIVE_REGEX = /^\/\//;

function normalizeSiteUrl(value?: string): URL | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const base = SCHEME_REGEX.test(trimmed)
    ? trimmed
    : `https://${trimmed.replace(PROTOCOL_RELATIVE_REGEX, "")}`;

  try {
    return new URL("/", base);
  } catch {
    return null;
  }
}

const metadataBase =
  normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeSiteUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normalizeSiteUrl(process.env.VERCEL_URL) ??
  localSiteUrl;
const canonicalUrl = new URL("/", metadataBase);

const previewImage = "/defendre-solutions.png";

export const metadata: Metadata = {
  metadataBase,
  title: "Steve Defendre | Full-Stack Developer",
  description: "Veteran-owned software development. Transforming ideas into production-ready applications.",
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: canonicalUrl,
    title: "Steve Defendre | Full-Stack Developer",
    description:
      "Veteran-owned software development. Transforming ideas into production-ready applications.",
    siteName: "Steve Defendre Portfolio",
    images: [
      {
        url: previewImage,
        width: 1280,
        height: 720,
        alt: "Steve Defendre portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Steve Defendre | Full-Stack Developer",
    description:
      "Veteran-owned software development. Transforming ideas into production-ready applications.",
    images: [previewImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await headers();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${fraunces.variable} ${manrope.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="focus-ring sr-only fixed left-[max(1rem,env(safe-area-inset-left,0px))] top-[max(1rem,env(safe-area-inset-top,0px))] z-[60] min-h-11 items-center rounded-full bg-[var(--accent-strong)] px-5 py-2.5 text-sm font-bold text-[var(--accent-foreground)] shadow-[0_16px_48px_rgba(0,4,8,0.5)] focus:not-sr-only focus:flex"
        >
          Skip to content
        </a>
        <AnimatedBackground />

        <div className="relative z-10 min-h-screen w-full overflow-x-clip">
          <Sidebar />
          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col pb-[calc(10rem+env(safe-area-inset-bottom,0px))] pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))] pt-7 focus:outline-none sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.5rem,env(safe-area-inset-right,0px))] sm:pt-10 lg:px-10 lg:pb-12 lg:pt-36 xl:px-14 2xl:px-16"
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
      </body>
    </html>
  );
}
