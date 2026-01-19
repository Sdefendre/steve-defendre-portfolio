import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import AnimatedBackground from "@/components/AnimatedBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Steve Defendre | Full-Stack Developer",
  description: "Veteran-owned software development. Transforming ideas into production-ready applications.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
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
          <main className="flex-1 w-full lg:ml-[200px] px-4 py-6 pb-24 lg:px-12 lg:py-12 lg:pb-12 lg:pr-12 xl:pr-24 2xl:pr-32">
            <div className="w-full max-w-full lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
              {children}
            </div>
          </main>
        </div>

        <MobileNav />
      </body>
    </html>
  );
}
