import { useRef, useEffect, useState, useCallback } from "react";

/**
 * Hook to manage user interactivity: mouse tracking, visibility, and reduced motion.
 */
export function useInteractivity() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const dimensionsRef = useRef({
    width: typeof window !== "undefined" ? window.innerWidth : 1,
    height: typeof window !== "undefined" ? window.innerHeight : 1,
  });

  // Initialize state with a function to avoid setstate in useEffect
  const [shouldReduceMotion, setShouldReduceMotion] = useState(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function"
    ) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  const [isVisible, setIsVisible] = useState(true);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    // Store raw coordinates for later normalization in the animation loop
    mouseRef.current.x = event.clientX;
    mouseRef.current.y = event.clientY;
  }, []);

  const handleVisibilityChange = useCallback(() => {
    setIsVisible(document.visibilityState === "visible");
  }, []);

  const handleResize = useCallback(() => {
    dimensionsRef.current = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, []);

  useEffect(() => {
    const reducedMotionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery?.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery?.removeEventListener("change", handleMotionPreferenceChange);
    };
  }, [handleMouseMove, handleResize, handleVisibilityChange]);

  const shouldAnimate = !shouldReduceMotion && isVisible;

  return {
    mouseRef,
    dimensionsRef,
    shouldAnimate,
    isVisible,
  };
}
