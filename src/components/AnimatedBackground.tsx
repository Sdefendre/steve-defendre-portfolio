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
  // Using Tailwind classes for the background to match ThreeScene background
  return (
    <div
      className={`fixed inset-0 -z-10 ${
        isDesktop === null || isDesktop
          ? "bg-gradient-to-br from-[#fafafa] to-[#f0f0f5]"
          : "bg-gray-50"
      } lg:bg-transparent`}
    />
  );
}
