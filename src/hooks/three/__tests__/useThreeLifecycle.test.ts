import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { useThreeLifecycle } from "../useThreeLifecycle";
import * as THREE from "three";

describe("useThreeLifecycle", () => {
  const mockScene = { add: vi.fn(), remove: vi.fn() };
  const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
  const mockRenderer = {
    render: vi.fn(),
    setSize: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement("canvas")
  };

  const defaultProps = {
    containerRef: { current: document.createElement("div") } as React.RefObject<HTMLDivElement | null>,
    sceneRef: { current: mockScene } as React.RefObject<THREE.Scene | null>,
    initBase: vi.fn().mockReturnValue({ scene: mockScene, camera: mockCamera, renderer: mockRenderer }),
    cleanupBase: vi.fn(),
    initParticles: vi.fn(),
    cleanupParticles: vi.fn(),
    initShapes: vi.fn(),
    cleanupShapes: vi.fn(),
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize all components when container is provided", () => {
    renderHook(() => useThreeLifecycle(defaultProps));

    expect(defaultProps.initBase).toHaveBeenCalledWith(defaultProps.containerRef.current);
    expect(defaultProps.initParticles).toHaveBeenCalledWith(mockScene);
    expect(defaultProps.initShapes).toHaveBeenCalledWith(mockScene);
  });

  it("should not initialize if container is null", () => {
    renderHook(() => useThreeLifecycle({ ...defaultProps, containerRef: { current: null } }));

    expect(defaultProps.initBase).not.toHaveBeenCalled();
  });

  it("should cleanup all components on unmount", () => {
    const { unmount } = renderHook(() => useThreeLifecycle(defaultProps));

    unmount();

    expect(defaultProps.cleanupParticles).toHaveBeenCalledWith(mockScene);
    expect(defaultProps.cleanupShapes).toHaveBeenCalledWith(mockScene);
    expect(defaultProps.cleanupBase).toHaveBeenCalledWith(defaultProps.containerRef.current);
  });

  it("should handle initialization errors and perform cleanup", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("Init failed");
    defaultProps.initParticles.mockImplementationOnce(() => {
      throw error;
    });

    renderHook(() => useThreeLifecycle(defaultProps));

    expect(defaultProps.cleanupParticles).toHaveBeenCalledWith(mockScene);
    expect(defaultProps.cleanupShapes).toHaveBeenCalledWith(mockScene);
    expect(defaultProps.cleanupBase).toHaveBeenCalledWith(defaultProps.containerRef.current);
    expect(consoleSpy).toHaveBeenCalledWith(
      "ThreeScene disabled because WebGL setup failed.",
      error
    );
    consoleSpy.mockRestore();
  });
});
