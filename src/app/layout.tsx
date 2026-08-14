import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import { siteMetadata, siteViewport } from "@/lib/site-metadata";

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

export const metadata = siteMetadata;
export const viewport = siteViewport;

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${fraunces.variable} ${manrope.variable} font-sans antialiased`}>
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
