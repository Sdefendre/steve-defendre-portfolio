import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Steve Defendre | Full-Stack Developer",
  description: "Veteran-owned software development. Transforming ideas into production-ready applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-[200px] p-12 max-w-[900px]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
