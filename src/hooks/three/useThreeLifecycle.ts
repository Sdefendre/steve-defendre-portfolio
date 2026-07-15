import { useEffect } from "react";
import * as THREE from "three";

interface UseThreeLifecycleProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  sceneRef: React.RefObject<THREE.Scene | null>;
  initBase: (container: HTMLDivElement) => { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer };
  cleanupBase: (container: HTMLDivElement | null) => void;
  initParticles: (scene: THREE.Scene) => THREE.Points;
  cleanupParticles: (scene: THREE.Scene) => void;
  initShapes: (scene: THREE.Scene) => void;
  cleanupShapes: (scene: THREE.Scene) => void;
}

/**
 * Hook that manages the initialization and cleanup lifecycle of the Three.js scene.
 */
export function useThreeLifecycle({
  containerRef,
  sceneRef,
  initBase,
  cleanupBase,
  initParticles,
  cleanupParticles,
  initShapes,
  cleanupShapes,
}: UseThreeLifecycleProps) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initializedScene: THREE.Scene | null = null;

    try {
      const { scene } = initBase(container);
      initializedScene = scene;
      initParticles(scene);
      initShapes(scene);
    } catch (error) {
      // In case of error during initialization, ensure any partially created
      // resources are cleaned up immediately.
      initializedScene ??= sceneRef.current;
      if (initializedScene) {
        cleanupParticles(initializedScene);
        cleanupShapes(initializedScene);
      }
      cleanupBase(container);
      console.error("ThreeScene disabled because WebGL setup failed.", error);
    }

    const sceneToCleanup = initializedScene ?? sceneRef.current;

    return () => {
      if (sceneToCleanup) {
        cleanupParticles(sceneToCleanup);
        cleanupShapes(sceneToCleanup);
      }
      cleanupBase(container);
    };
  }, [
    containerRef,
    sceneRef,
    initBase,
    initParticles,
    initShapes,
    cleanupParticles,
    cleanupShapes,
    cleanupBase,
  ]);
}
