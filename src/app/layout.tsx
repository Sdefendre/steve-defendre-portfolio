import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import AnimatedBackground from "@/components/AnimatedBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const previewImage = "/defendre-solutions.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Steve Defendre | Full-Stack Developer",
  description: "Veteran-owned software development. Transforming ideas into production-ready applications.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Background - hidden on mobile for performance */}
        <div className="hidden lg:block">
          <AnimatedBackground />
        </div>

        {/* Mobile background */}
        <div className="lg:hidden fixed inset-0 -z-10 bg-gray-50" />

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
