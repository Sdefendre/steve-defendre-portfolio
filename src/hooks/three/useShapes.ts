import { useRef, useCallback } from "react";
import * as THREE from "three";

/**
 * Hook to manage floating geometric shapes in the Three.js scene.
 */
export function useShapes() {
  const shapesRef = useRef<THREE.Mesh[]>([]);
  const geometriesRef = useRef<THREE.BufferGeometry[]>([]);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const init = useCallback((scene: THREE.Scene) => {
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0),
    ];
    geometriesRef.current = geometries;

    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#8b5cf6"),
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    materialRef.current = material;

    for (let i = 0; i < 15; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      // Optimization: Sharing the same material instance instead of cloning
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = (Math.random() - 0.5) * 60;
      mesh.position.y = (Math.random() - 0.5) * 60;
      mesh.position.z = (Math.random() - 0.5) * 30;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      const scale = Math.random() * 2 + 0.5;
      mesh.scale.set(scale, scale, scale);

      shapesRef.current.push(mesh);
      scene.add(mesh);
    }
  }, []);

  const update = useCallback((elapsedTime: number) => {
    shapesRef.current.forEach((shape, i) => {
      shape.rotation.x += 0.002 + i * 0.0005;
      shape.rotation.y += 0.003 + i * 0.0005;
      shape.position.y += Math.sin(elapsedTime + i) * 0.005;
    });
  }, []);

  const cleanup = useCallback((scene: THREE.Scene) => {
    shapesRef.current.forEach((shape) => {
      scene.remove(shape);
    });
    shapesRef.current = [];

    geometriesRef.current.forEach((geometry) => geometry.dispose());
    geometriesRef.current = [];

    // The material is shared, so we dispose of it exactly once here
    materialRef.current?.dispose();
    materialRef.current = null;
  }, []);

  return { init, update, cleanup };
}
