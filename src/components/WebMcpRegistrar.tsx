"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { registerPortfolioTools } from "@/lib/webmcp";

// Registers WebMCP tools in browsers that expose document.modelContext.
// Humans keep the existing UI. Aborting this effect unregisters the tools.
export function WebMcpRegistrar() {
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    function navigate(href: string) {
      // `/` is a hashed static HTML rewrite, not a hydrated Next route.
      if (href === "/") {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- full load keeps the static homepage intact
        window.location.assign("/");
        return;
      }

      router.push(href);
    }

    void registerPortfolioTools({
      navigate,
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [router]);

  return null;
}
