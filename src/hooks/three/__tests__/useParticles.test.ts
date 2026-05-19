import { renderHook } from "@testing-library/react";
import * as THREE from "three";
import { useParticles } from "../useParticles";

vi.mock("three", () => {
  const Scene = vi.fn().mockImplementation(function() {
    return {
      add: vi.fn(),
      remove: vi.fn(),
    };
  });

  const Points = vi.fn().mockImplementation(function() {
    return {
      rotation: { x: 0, y: 0, z: 0 },
    };
  });

  const BufferGeometry = vi.fn().mockImplementation(function() {
    return {
      setAttribute: vi.fn(),
      dispose: vi.fn(),
    };
  });

  const PointsMaterial = vi.fn().mockImplementation(function() {
    return {
      dispose: vi.fn(),
    };
  });

  const BufferAttribute = vi.fn().mockImplementation(function() {});

  const Color = vi.fn().mockImplementation(function(color: string) {
    return {
      color,
    };
  });

  return {
    Scene,
    Points,
    BufferGeometry,
    PointsMaterial,
    BufferAttribute,
    Color,
    AdditiveBlending: 2,
  };
});

describe("useParticles", () => {
  let scene: THREE.Scene;

  beforeEach(() => {
    vi.clearAllMocks();
    scene = new THREE.Scene();
  });

  it("should initialize particles and add them to the scene", () => {
    const { result } = renderHook(() => useParticles());

    result.current.init(scene);

    expect(scene.add).toHaveBeenCalledTimes(1);
    expect(THREE.Points).toHaveBeenCalledTimes(1);
    expect(THREE.BufferGeometry).toHaveBeenCalledTimes(1);
    expect(THREE.PointsMaterial).toHaveBeenCalledTimes(1);

    const geometry = vi.mocked(THREE.BufferGeometry).mock.results[0].value;
    expect(geometry.setAttribute).toHaveBeenCalledWith("position", expect.any(THREE.BufferAttribute));
  });

  it("should update particle rotations over time and mouse movement", () => {
    const { result } = renderHook(() => useParticles());
    result.current.init(scene);

    const particlesMesh = vi.mocked(THREE.Points).mock.results[0].value;

    result.current.update(1.0, 0.5, -0.5);

    // Initial rotations are 0 from the mock
    // y: elapsedTime * 0.05 + targetX * 0.1 = 1.0 * 0.05 + 0.5 * 0.1 = 0.05 + 0.05 = 0.1
    // x: elapsedTime * 0.03 + targetY * 0.1 = 1.0 * 0.03 + (-0.5) * 0.1 = 0.03 - 0.05 = -0.02

    expect(particlesMesh.rotation.y).toBeCloseTo(0.1);
    expect(particlesMesh.rotation.x).toBeCloseTo(-0.02);
  });

  it("should cleanup particles and dispose resources", () => {
    const { result } = renderHook(() => useParticles());
    result.current.init(scene);

    const particlesMesh = vi.mocked(THREE.Points).mock.results[0].value;
    const geometry = vi.mocked(THREE.BufferGeometry).mock.results[0].value;
    const material = vi.mocked(THREE.PointsMaterial).mock.results[0].value;

    result.current.cleanup(scene);

    expect(scene.remove).toHaveBeenCalledWith(particlesMesh);
    expect(geometry.dispose).toHaveBeenCalled();
    expect(material.dispose).toHaveBeenCalled();
  });
});
