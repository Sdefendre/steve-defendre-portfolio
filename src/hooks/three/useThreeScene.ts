import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { useThreeBase } from "./useThreeBase";
import { useInteractivity } from "./useInteractivity";
import { useParticles } from "./useParticles";
import { useShapes } from "./useShapes";

/**
 * Orchestrator hook that coordinates all Three.js sub-hooks.
 */
export function useThreeScene(containerRef: React.RefObject<HTMLDivElement | null>) {
  const { init: initBase, cleanup: cleanupBase, rendererRef, cameraRef, sceneRef } = useThreeBase();
  const { mouseRef, dimensionsRef, shouldAnimate } = useInteractivity();
  const { init: initParticles, update: updateParticles, cleanup: cleanupParticles } = useParticles();
  const { init: initShapes, update: updateShapes, cleanup: cleanupShapes } = useShapes();

  const frameIdRef = useRef<number>(0);
  const clockRef = useRef(new THREE.Clock(false));
  const elapsedTimeRef = useRef(0);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);

  // Use a ref to store the animate function so it can be called safely in requestAnimationFrame
  // and avoid ESLint "Cannot access variable before it is declared" error.
  const animateRef = useRef<() => void>(() => {});

  const animate = useCallback(() => {
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;

    if (!renderer || !camera || !scene) {
      frameIdRef.current = 0;
      return;
    }

    if (!shouldAnimate) {
      renderer.render(scene, camera);
      frameIdRef.current = 0;
      return;
    }

    elapsedTimeRef.current += Math.min(clockRef.current.getDelta(), 0.033);

    // Normalize mouse coordinates within the animation loop for better performance
    const { width, height } = dimensionsRef.current;
    const normalizedMouseX = (mouseRef.current.x / width) * 2 - 1;
    const normalizedMouseY = -(mouseRef.current.y / height) * 2 + 1;

    // Smooth mouse following
    targetXRef.current += (normalizedMouseX - targetXRef.current) * 0.02;
    targetYRef.current += (normalizedMouseY - targetYRef.current) * 0.02;

    updateParticles(elapsedTimeRef.current, targetXRef.current, targetYRef.current);
    updateShapes(elapsedTimeRef.current);

    renderer.render(scene, camera);
    frameIdRef.current = requestAnimationFrame(animateRef.current);
  }, [shouldAnimate, updateParticles, updateShapes, mouseRef, dimensionsRef, rendererRef, cameraRef, sceneRef]);

  // Update the animateRef whenever animate changes
  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  // Handle initialization and base cleanup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentSceneRef = sceneRef.current;

    try {
      const { scene } = initBase(container);
      initParticles(scene);
      initShapes(scene);
    } catch (error) {
      // In case of error during initialization, ensure any partially created
      // resources are cleaned up immediately.
      const scene = sceneRef.current;
      if (scene) {
        cleanupParticles(scene);
        cleanupShapes(scene);
      }
      cleanupBase(container);
      console.error("ThreeScene disabled because WebGL setup failed.", error);
    }

    return () => {
      if (currentSceneRef) {
        cleanupParticles(currentSceneRef);
        cleanupShapes(currentSceneRef);
      }
      cleanupBase(container);
    };
  }, [containerRef, initBase, initParticles, initShapes, cleanupParticles, cleanupShapes, cleanupBase, sceneRef]);

  // Handle animation loop start/stop based on shouldAnimate
  useEffect(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    if (shouldAnimate && !frameIdRef.current && renderer) {
      clockRef.current.start();
      frameIdRef.current = requestAnimationFrame(animateRef.current);
    } else if (!shouldAnimate && frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = 0;
      // Final render to ensure state is reflected (e.g. if reduced motion was just enabled)
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = 0;
      }
    };
  }, [shouldAnimate, rendererRef, sceneRef, cameraRef]);
}
