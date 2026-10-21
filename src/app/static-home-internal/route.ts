import { readFileSync } from "node:fs";
import { join } from "node:path";
import { staticHomeHtml } from "@/generated/static-home-assets";
import {
  buildStaticHomeContentSecurityPolicy,
  injectPostHogRuntime,
} from "@/lib/posthog-consent";

export const dynamic = "force-static";

export function GET() {
  const document = injectPostHogRuntime(
    readFileSync(join(process.cwd(), "public", staticHomeHtml.slice(1)), "utf8"),
  );
  return new Response(document, { headers: {
    "Cache-Control": "public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400",
    "Content-Type": "text/html; charset=utf-8",
    "Content-Security-Policy": buildStaticHomeContentSecurityPolicy(),
    "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
    "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "index, follow",
  }});
}
