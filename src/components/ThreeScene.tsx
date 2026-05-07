"use client";

import { useRef } from "react";
import { useThreeScene } from "@/hooks/three/useThreeScene";

/**
 * ThreeScene component that renders an interactive background using Three.js.
 * Logic is delegated to the useThreeScene hook for better maintainability.
 */
export default function ThreeScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the orchestrator hook to handle all Three.js logic
  useThreeScene(containerRef);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-br from-[#fafafa] to-[#f0f0f5]"
    />
  );
}
