import { useRef, useCallback } from "react";
import * as THREE from "three";

/**
 * Hook to manage the particle system in the Three.js scene.
 */
export function useParticles() {
  const particlesMeshRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);

  const init = useCallback((scene: THREE.Scene) => {
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    geometryRef.current = geometry;

    const material = new THREE.PointsMaterial({
      size: 0.15,
      color: new THREE.Color("#6366f1"),
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    materialRef.current = material;

    const particlesMesh = new THREE.Points(geometry, material);
    particlesMeshRef.current = particlesMesh;
    scene.add(particlesMesh);

    return particlesMesh;
  }, []);

  const update = useCallback((elapsedTime: number, targetX: number, targetY: number) => {
    if (!particlesMeshRef.current) return;

    // Rotate particles
    particlesMeshRef.current.rotation.y = elapsedTime * 0.05;
    particlesMeshRef.current.rotation.x = elapsedTime * 0.03;

    // Mouse influence on particles
    particlesMeshRef.current.rotation.y += targetX * 0.1;
    particlesMeshRef.current.rotation.x += targetY * 0.1;
  }, []);

  const cleanup = useCallback((scene: THREE.Scene) => {
    if (particlesMeshRef.current) {
      scene.remove(particlesMeshRef.current);
      particlesMeshRef.current = null;
    }
    geometryRef.current?.dispose();
    geometryRef.current = null;
    materialRef.current?.dispose();
    materialRef.current = null;
  }, []);

  return { init, update, cleanup };
}
