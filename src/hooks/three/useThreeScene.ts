import { useThreeBase } from "./useThreeBase";
import { useInteractivity } from "./useInteractivity";
import { useParticles } from "./useParticles";
import { useShapes } from "./useShapes";
import { useThreeAnimation } from "./useThreeAnimation";
import { useThreeLifecycle } from "./useThreeLifecycle";

/**
 * Orchestrator hook that coordinates all Three.js sub-hooks.
 *
 * This hook delegates specific responsibilities to specialized sub-hooks:
 * - useThreeBase: Core Three.js setup (scene, camera, renderer)
 * - useInteractivity: User interaction and environment state
 * - useParticles/useShapes: Specific visual elements
 * - useThreeLifecycle: Initialization and cleanup orchestration
 * - useThreeAnimation: Animation loop management
 */
export function useThreeScene(containerRef: React.RefObject<HTMLDivElement | null>) {
  const {
    init: initBase,
    cleanup: cleanupBase,
    rendererRef,
    cameraRef,
    sceneRef,
  } = useThreeBase();

  const { mouseRef, dimensionsRef, shouldAnimate } = useInteractivity();

  const {
    init: initParticles,
    update: updateParticles,
    cleanup: cleanupParticles,
  } = useParticles();

  const {
    init: initShapes,
    update: updateShapes,
    cleanup: cleanupShapes,
  } = useShapes();

  // Orchestrate initialization and cleanup
  useThreeLifecycle({
    containerRef,
    sceneRef,
    initBase,
    cleanupBase,
    initParticles,
    cleanupParticles,
    initShapes,
    cleanupShapes,
  });

  // Orchestrate the animation loop
  useThreeAnimation({
    rendererRef,
    cameraRef,
    sceneRef,
    shouldAnimate,
    mouseRef,
    dimensionsRef,
    updateParticles,
    updateShapes,
  });
}
