"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ThreeScene = dynamic(() => import("./ThreeScene"), {
  ssr: false,
});

export default function AnimatedBackground() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Check on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isDesktop) {
    return <ThreeScene />;
  }

  // Mobile background / Desktop fallback / SSR initial state
  // Using a class for the mobile color and inline style for the desktop gradient to match ThreeScene background
  return (
    <div
      className="fixed inset-0 -z-10 bg-gray-50 lg:bg-transparent"
      style={{
        background:
          isDesktop === null || isDesktop
            ? "linear-gradient(135deg, #fafafa 0%, #f0f0f5 100%)"
            : undefined,
      }}
    />
  );
}
