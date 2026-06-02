import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import AnimatedBackground from "@/components/AnimatedBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased`} nonce={nonce}>
        <AnimatedBackground />

        <div className="flex min-h-screen w-full overflow-x-hidden">
          <Sidebar />
          <main className="flex-1 w-full lg:ml-[200px] px-4 py-6 pb-32 lg:px-12 lg:py-12 lg:pb-12 lg:pr-12 xl:pr-24 2xl:pr-32">
            <div className="w-full max-w-full lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
              {children}
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-6 border-t border-gray-200 text-center lg:text-left">
              <p className="text-sm text-gray-500">
                Made by{" "}
                <a
                  href="https://defendresolutions.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Defendre Solutions
                </a>
              </p>
            </footer>
          </main>
        </div>

        <MobileNav />
      </body>
    </html>
  );
}
