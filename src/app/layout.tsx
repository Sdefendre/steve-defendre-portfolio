import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import { WebMcpRegistrar } from "@/components/WebMcpRegistrar";
import { fraunces, manrope } from "@/lib/fonts";
import { siteMetadata, siteViewport } from "@/lib/site-metadata";

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
        <WebMcpRegistrar />
        <AnimatedBackground />
        {children}
      </body>
    </html>
  );
}
