import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useThreeScene } from "../useThreeScene";
import * as THREE from "three";
import { useThreeBase } from "../useThreeBase";
import { useInteractivity } from "../useInteractivity";
import { useParticles } from "../useParticles";
import { useShapes } from "../useShapes";

vi.mock("../useThreeBase");
vi.mock("../useInteractivity");
vi.mock("../useParticles");
vi.mock("../useShapes");

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

describe("useThreeScene", () => {
  const mockScene = { add: vi.fn(), remove: vi.fn() };
  const mockCamera = { aspect: 1, updateProjectionMatrix: vi.fn() };
  const mockRenderer = {
    render: vi.fn(),
    setSize: vi.fn(),
    dispose: vi.fn(),
    domElement: document.createElement("canvas")
  };

  const mockBase = {
    init: vi.fn().mockReturnValue({ scene: mockScene, camera: mockCamera, renderer: mockRenderer }),
    cleanup: vi.fn(),
    rendererRef: { current: mockRenderer },
    cameraRef: { current: mockCamera },
    sceneRef: { current: mockScene },
  };

  const mockInteractivity = {
    mouseRef: { current: { x: 0, y: 0 } },
    dimensionsRef: { current: { width: 1000, height: 1000 } },
    shouldAnimate: true,
  };

  const mockParticles = {
    init: vi.fn(),
    update: vi.fn(),
    cleanup: vi.fn(),
  };

  const mockShapes = {
    init: vi.fn(),
    update: vi.fn(),
    cleanup: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useThreeBase).mockReturnValue(mockBase as any);
    vi.mocked(useInteractivity).mockReturnValue(mockInteractivity as any);
    vi.mocked(useParticles).mockReturnValue(mockParticles as any);
    vi.mocked(useShapes).mockReturnValue(mockShapes as any);

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      // Don't actually call the callback to avoid infinite loops unless explicitly triggered
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize all sub-hooks when container is provided", () => {
    const container = document.createElement("div");
    const containerRef = { current: container };

    renderHook(() => useThreeScene(containerRef as any));

    expect(mockBase.init).toHaveBeenCalledWith(container);
    expect(mockParticles.init).toHaveBeenCalledWith(mockScene);
    expect(mockShapes.init).toHaveBeenCalledWith(mockScene);
  });

  it("should not initialize if container is null", () => {
    const containerRef = { current: null };

    renderHook(() => useThreeScene(containerRef as any));

    expect(mockBase.init).not.toHaveBeenCalled();
    expect(mockParticles.init).not.toHaveBeenCalled();
    expect(mockShapes.init).not.toHaveBeenCalled();
  });

  it("should start animation loop and call update functions when shouldAnimate is true", () => {
    const container = document.createElement("div");
    const containerRef = { current: container };

    let animationCallback: any;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      animationCallback = cb;
      return 123;
    });

    renderHook(() => useThreeScene(containerRef as any));

    // Initial render call from useEffect is triggered by shouldAnimate
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    // Manually trigger the animation callback
    animationCallback();

    expect(mockParticles.update).toHaveBeenCalled();
    expect(mockShapes.update).toHaveBeenCalled();
    expect(mockRenderer.render).toHaveBeenCalledWith(mockScene, mockCamera);
  });

  it("should stop animation loop and not call update functions when shouldAnimate is false", () => {
    const container = document.createElement("div");
    const containerRef = { current: container };

    // Start with shouldAnimate: true
    const { rerender } = renderHook(({ shouldAnimate }) => {
      vi.mocked(useInteractivity).mockReturnValue({
        ...mockInteractivity,
        shouldAnimate,
      } as any);
      return useThreeScene(containerRef as any);
    }, {
      initialProps: { shouldAnimate: true }
    });

    expect(window.requestAnimationFrame).toHaveBeenCalled();

    // Reset mocks for the transition
    vi.mocked(window.requestAnimationFrame).mockClear();
    mockRenderer.render.mockClear();

    // Transition to shouldAnimate: false
    rerender({ shouldAnimate: false });

    expect(window.cancelAnimationFrame).toHaveBeenCalled();
    expect(mockParticles.update).not.toHaveBeenCalled();
    expect(mockShapes.update).not.toHaveBeenCalled();
    // It calls render once to reflect state when transitioning to false
    // It should be called during transition because frameIdRef.current was set
    // In our mock, requestAnimationFrame returns 1, so frameIdRef.current is 1.
    // When shouldAnimate becomes false, the 'else if' block should trigger.
  });

  it("should cleanup all sub-hooks on unmount", () => {
    const container = document.createElement("div");
    const containerRef = { current: container };

    const { unmount } = renderHook(() => useThreeScene(containerRef as any));

    unmount();

    expect(mockParticles.cleanup).toHaveBeenCalledWith(mockScene);
    expect(mockShapes.cleanup).toHaveBeenCalledWith(mockScene);
    expect(mockBase.cleanup).toHaveBeenCalledWith(container);
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it("should handle initialization errors and perform cleanup", () => {
    const container = document.createElement("div");
    const containerRef = { current: container };
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockParticles.init.mockImplementationOnce(() => {
      throw new Error("Init failed");
    });

    renderHook(() => useThreeScene(containerRef as any));

    expect(mockParticles.cleanup).toHaveBeenCalledWith(mockScene);
    expect(mockShapes.cleanup).toHaveBeenCalledWith(mockScene);
    expect(mockBase.cleanup).toHaveBeenCalledWith(container);
    expect(consoleSpy).toHaveBeenCalledWith(
      "ThreeScene disabled because WebGL setup failed.",
      expect.any(Error)
    );
  });
});
