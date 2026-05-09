import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import * as THREE from "three";
import { useShapes } from "../useShapes";

vi.mock("three", () => {
  const Scene = vi.fn().mockImplementation(function() {
    return {
      add: vi.fn(),
      remove: vi.fn(),
    };
  });

  const Mesh = vi.fn().mockImplementation(function() {
    return {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0 },
      scale: { set: vi.fn() },
    };
  });

  const BufferGeometry = vi.fn().mockImplementation(function() {
    return {
      dispose: vi.fn(),
    };
  });

  const MeshBasicMaterial = vi.fn().mockImplementation(function() {
    return {
      dispose: vi.fn(),
    };
  });

  const IcosahedronGeometry = vi.fn().mockImplementation(function() {
    return {
      dispose: vi.fn(),
    };
  });

  const OctahedronGeometry = vi.fn().mockImplementation(function() {
    return {
      dispose: vi.fn(),
    };
  });

  const TetrahedronGeometry = vi.fn().mockImplementation(function() {
    return {
      dispose: vi.fn(),
    };
  });

  const Color = vi.fn().mockImplementation(function(color: string) {
    return {
      color,
    };
  });

  return {
    Scene,
    Mesh,
    BufferGeometry,
    MeshBasicMaterial,
    IcosahedronGeometry,
    OctahedronGeometry,
    TetrahedronGeometry,
    Color,
  };
});

describe("useShapes", () => {
  let scene: THREE.Scene;

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    scene = new THREE.Scene();
  });

  it("should initialize 15 shapes and add them to the scene", () => {
    const { result } = renderHook(() => useShapes());

    result.current.init(scene);

    expect(scene.add).toHaveBeenCalledTimes(15);
    expect(THREE.Mesh).toHaveBeenCalledTimes(15);

    // Geometries are created once each and then reused
    expect(THREE.IcosahedronGeometry).toHaveBeenCalledTimes(1);
    expect(THREE.OctahedronGeometry).toHaveBeenCalledTimes(1);
    expect(THREE.TetrahedronGeometry).toHaveBeenCalledTimes(1);

    // Material is created once and shared
    expect(THREE.MeshBasicMaterial).toHaveBeenCalledTimes(1);

    // Verify meshes have randomized properties
    const meshes = vi.mocked(THREE.Mesh).mock.results.map(r => r.value);
    meshes.forEach(mesh => {
        expect(mesh.scale.set).toHaveBeenCalled();
    });
  });

  it("should update shape rotations and positions over time", () => {
    const { result } = renderHook(() => useShapes());
    result.current.init(scene);

    const meshes = vi.mocked(THREE.Mesh).mock.results.map(r => r.value);

    // Store initial values after init (which also sets random values)
    const midRotationsX = meshes.map(m => m.rotation.x);
    const midRotationsY = meshes.map(m => m.rotation.y);
    const midPositionsY = meshes.map(m => m.position.y);

    result.current.update(1.0);

    meshes.forEach((mesh, i) => {
      expect(mesh.rotation.x).toBeGreaterThan(midRotationsX[i]);
      expect(mesh.rotation.y).toBeGreaterThan(midRotationsY[i]);
      // position.y change depends on sin(1.0 + i)
      if (Math.sin(1.0 + i) !== 0) {
        expect(mesh.position.y).not.toBe(midPositionsY[i]);
      }
    });
  });

  it("should cleanup shapes and dispose resources", () => {
    const { result } = renderHook(() => useShapes());
    result.current.init(scene);

    const meshes = vi.mocked(THREE.Mesh).mock.results.map(r => r.value);
    const material = vi.mocked(THREE.MeshBasicMaterial).mock.results[0].value;

    const geometries = [
        vi.mocked(THREE.IcosahedronGeometry).mock.results[0].value,
        vi.mocked(THREE.OctahedronGeometry).mock.results[0].value,
        vi.mocked(THREE.TetrahedronGeometry).mock.results[0].value,
    ];

    result.current.cleanup(scene);

    expect(scene.remove).toHaveBeenCalledTimes(15);
    meshes.forEach(mesh => {
      expect(scene.remove).toHaveBeenCalledWith(mesh);
    });

    geometries.forEach(geometry => {
      expect(geometry.dispose).toHaveBeenCalled();
    });

    expect(material.dispose).toHaveBeenCalledTimes(1);
  });
});
