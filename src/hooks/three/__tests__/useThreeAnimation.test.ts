import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useThreeAnimation } from "../useThreeAnimation";
import * as THREE from "three";

// Mock THREE.Clock
vi.mock("three", async () => {
  const actual = await vi.importActual<typeof THREE>("three");
  return {
    ...actual,
    Clock: vi.fn().mockImplementation(function() {
      return {
        start: vi.fn(),
        getDelta: vi.fn().mockReturnValue(0.016),
      };
    }),
  };
});

describe("useThreeAnimation", () => {
  const mockScene = { add: vi.fn(), remove: vi.fn() };
  const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
  const mockRenderer = {
    render: vi.fn(),
    setSize: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement("canvas")
  };

  const defaultProps = {
    rendererRef: { current: mockRenderer } as React.RefObject<THREE.WebGLRenderer | null>,
    cameraRef: { current: mockCamera } as React.RefObject<THREE.PerspectiveCamera | null>,
    sceneRef: { current: mockScene } as React.RefObject<THREE.Scene | null>,
    shouldAnimate: true,
    mouseRef: { current: { x: 0, y: 0 } },
    dimensionsRef: { current: { width: 1000, height: 1000 } },
    updateParticles: vi.fn(),
    updateShapes: vi.fn(),
  };

  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should start animation loop when shouldAnimate is true", () => {
    renderHook(() => useThreeAnimation(defaultProps));

    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it("should call update functions and render in the animation loop", () => {
    let animationCallback: FrameRequestCallback = () => {};
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      animationCallback = cb;
      return 123;
    });

    renderHook(() => useThreeAnimation(defaultProps));

    // Manually trigger the animation callback
    act(() => {
      animationCallback(0);
    });

    expect(defaultProps.updateParticles).toHaveBeenCalled();
    expect(defaultProps.updateShapes).toHaveBeenCalled();
    expect(mockRenderer.render).toHaveBeenCalledWith(mockScene, mockCamera);
  });

  it("should stop animation loop when shouldAnimate is false", () => {
    const { rerender } = renderHook(({ props }) =>
      useThreeAnimation(props),
      { initialProps: { props: { ...defaultProps, shouldAnimate: true } } }
    );

    expect(window.requestAnimationFrame).toHaveBeenCalled();

    act(() => {
      rerender({ props: { ...defaultProps, shouldAnimate: false } });
    });

    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it("should cleanup on unmount", () => {
    const { unmount } = renderHook(() => useThreeAnimation(defaultProps));

    unmount();

    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });
});
