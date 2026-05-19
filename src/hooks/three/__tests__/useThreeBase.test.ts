import { renderHook, act } from "@testing-library/react";
import * as THREE from "three";
import { useThreeBase } from "../useThreeBase";

vi.mock("three", () => {
  const Scene = vi.fn().mockImplementation(function() {
    return {
      add: vi.fn(),
      remove: vi.fn(),
    };
  });

  const PerspectiveCamera = vi.fn().mockImplementation(function() {
    return {
      position: { z: 0 },
      aspect: 1,
      updateProjectionMatrix: vi.fn(),
    };
  });

  const WebGLRenderer = vi.fn().mockImplementation(function() {
    return {
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      dispose: vi.fn(),
      domElement: document.createElement("canvas"),
    };
  });

  return {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
  };
});

describe("useThreeBase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Mock window dimensions
    vi.stubGlobal("innerWidth", 1024);
    vi.stubGlobal("innerHeight", 768);
    vi.stubGlobal("devicePixelRatio", 1);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("should initialize scene, camera, and renderer", () => {
    const { result } = renderHook(() => useThreeBase());
    const container = document.createElement("div");

    act(() => {
      result.current.init(container);
    });

    expect(THREE.Scene).toHaveBeenCalled();
    expect(THREE.PerspectiveCamera).toHaveBeenCalledWith(75, 1024 / 768, 0.1, 1000);
    expect(THREE.WebGLRenderer).toHaveBeenCalled();

    const renderer = vi.mocked(THREE.WebGLRenderer).mock.results[0].value;
    expect(renderer.setSize).toHaveBeenCalledWith(1024, 768);
    expect(renderer.setPixelRatio).toHaveBeenCalled();
    expect(container.contains(renderer.domElement)).toBe(true);

    expect(result.current.sceneRef.current).not.toBeNull();
    expect(result.current.cameraRef.current).not.toBeNull();
    expect(result.current.rendererRef.current).not.toBeNull();
  });

  it("should cleanup resources on cleanup call", () => {
    const { result } = renderHook(() => useThreeBase());
    const container = document.createElement("div");

    act(() => {
      result.current.init(container);
    });

    const renderer = result.current.rendererRef.current;

    act(() => {
      result.current.cleanup(container);
    });

    expect(renderer?.dispose).toHaveBeenCalled();
    expect(container.contains(renderer!.domElement)).toBe(false);
    expect(result.current.sceneRef.current).toBeNull();
    expect(result.current.cameraRef.current).toBeNull();
    expect(result.current.rendererRef.current).toBeNull();
  });

  it("should handle resize with debounce", () => {
    const { result } = renderHook(() => useThreeBase());
    const container = document.createElement("div");

    act(() => {
      result.current.init(container);
    });

    const camera = result.current.cameraRef.current;
    const renderer = result.current.rendererRef.current;

    // Change window size
    vi.stubGlobal("innerWidth", 800);
    vi.stubGlobal("innerHeight", 600);

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    // Should not update immediately due to debounce
    expect(camera?.updateProjectionMatrix).not.toHaveBeenCalled();
    expect(renderer?.setSize).toHaveBeenCalledTimes(1); // Only once during init

    // Advance time by 100ms
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(camera?.aspect).toBe(800 / 600);
    expect(camera?.updateProjectionMatrix).toHaveBeenCalled();
    expect(renderer?.setSize).toHaveBeenCalledWith(800, 600);
    expect(renderer?.setSize).toHaveBeenCalledTimes(2);
  });

  it("should clear resize timeout on unmount", () => {
    const { unmount, result } = renderHook(() => useThreeBase());
    const container = document.createElement("div");

    act(() => {
        result.current.init(container);
    });

    const renderer = result.current.rendererRef.current;

    act(() => {
        window.dispatchEvent(new Event("resize"));
    });

    unmount();

    act(() => {
        vi.advanceTimersByTime(100);
    });

    // renderer.setSize was called once during init.
    // It should NOT be called a second time because the resize was cancelled.
    expect(renderer?.setSize).toHaveBeenCalledTimes(1);
  });
});
