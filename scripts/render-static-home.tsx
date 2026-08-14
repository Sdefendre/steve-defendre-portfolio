import { renderToStaticMarkup } from "react-dom/server";
import Home from "../src/app/(home)/page";
import AnimatedBackground from "../src/components/AnimatedBackground";
import HomeShell from "../src/components/HomeShell";

export function renderStaticHomeDocument(cssPath: string, fontClasses: string, canonical: string) {
  const title = "Steve Defendre | Full-Stack Developer";
  const description = "Veteran-owned software development. Transforming ideas into production-ready applications.";
  const image = new URL("/project-previews/defendre-solutions.jpg", canonical).toString();
  return "<!doctype html>" + renderToStaticMarkup(
    <html lang="en" data-scroll-behavior="smooth"><head>
      <meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <title>{title}</title><meta name="description" content={description} /><meta name="robots" content="index, follow" /><link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" /><meta property="og:locale" content="en_US" /><meta property="og:url" content={canonical} /><meta property="og:title" content={title} /><meta property="og:description" content={description} /><meta property="og:site_name" content="Steve Defendre Portfolio" />
      <meta property="og:image" content={image} /><meta property="og:image:width" content="1280" /><meta property="og:image:height" content="720" /><meta property="og:image:alt" content="Steve Defendre portfolio preview" />
      <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content={title} /><meta name="twitter:description" content={description} /><meta name="twitter:image" content={image} />
      <link rel="icon" href="/favicon.ico" sizes="any" /><link rel="stylesheet" href={cssPath} />
    </head><body className={`${fontClasses} font-sans antialiased`}><AnimatedBackground /><HomeShell><Home /></HomeShell><script defer src="/_vercel/insights/script.js" /></body></html>,
  );
}
