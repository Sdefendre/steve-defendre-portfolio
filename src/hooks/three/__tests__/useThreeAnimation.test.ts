import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useThreeAnimation } from "../useThreeAnimation";
import * as THREE from "three";

// Mock THREE.Clock
const mockClock = {
  start: vi.fn(),
  getDelta: vi.fn().mockReturnValue(0.016),
};

vi.mock("three", async () => {
  const actual = await vi.importActual<typeof THREE>("three");
  return {
    ...actual,
    Clock: vi.fn().mockImplementation(function() {
      return mockClock;
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
    domElement: document.createElement("canvas"),
  };

  const createDefaultProps = () => ({
    rendererRef: { current: mockRenderer } as unknown as React.RefObject<THREE.WebGLRenderer | null>,
    cameraRef: { current: mockCamera } as unknown as React.RefObject<THREE.PerspectiveCamera | null>,
    sceneRef: { current: mockScene } as unknown as React.RefObject<THREE.Scene | null>,
    shouldAnimate: true,
    mouseRef: { current: { x: 0, y: 0 } },
    dimensionsRef: { current: { width: 1000, height: 1000 } },
    updateParticles: vi.fn(),
    updateShapes: vi.fn(),
  });

  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
    mockClock.getDelta.mockReturnValue(0.016);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should start animation loop when shouldAnimate is true", () => {
    renderHook(() => useThreeAnimation(createDefaultProps()));

    expect(window.requestAnimationFrame).toHaveBeenCalled();
    expect(mockClock.start).toHaveBeenCalled();
  });

  it("should call update functions and render in the animation loop", () => {
    let animationCallback: FrameRequestCallback = () => {};
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      animationCallback = cb;
      return 123;
    });

    const props = createDefaultProps();
    renderHook(() => useThreeAnimation(props));

    // Manually trigger the animation callback
    act(() => {
      animationCallback(0);
    });

    expect(props.updateParticles).toHaveBeenCalled();
    expect(props.updateShapes).toHaveBeenCalled();
    expect(mockRenderer.render).toHaveBeenCalledWith(mockScene, mockCamera);
    // Should request next frame
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);
  });

  it("should stop animation loop and call final render when shouldAnimate becomes false", () => {
    const props = createDefaultProps();
    const { rerender } = renderHook(
      ({ shouldAnimate }) => useThreeAnimation({ ...props, shouldAnimate }),
      { initialProps: { shouldAnimate: true } }
    );

    expect(window.requestAnimationFrame).toHaveBeenCalled();

    act(() => {
      rerender({ shouldAnimate: false });
    });

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(mockRenderer.render).toHaveBeenCalledWith(mockScene, mockCamera);
  });

  it("should cleanup on unmount", () => {
    renderHook(() => useThreeAnimation(createDefaultProps())).unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it("should not proceed with animation if refs are null during loop", () => {
    let animationCallback: FrameRequestCallback = () => {};
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      animationCallback = cb;
      return 123;
    });

    const props = createDefaultProps();
    props.rendererRef = { current: null };

    renderHook(() => useThreeAnimation(props));

    act(() => {
      animationCallback(0);
    });

    expect(props.updateParticles).not.toHaveBeenCalled();
    expect(mockRenderer.render).not.toHaveBeenCalled();
  });

  it("should clamp clock delta to 0.033", () => {
    let animationCallback: FrameRequestCallback = () => {};
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      animationCallback = cb;
      return 123;
    });

    const props = createDefaultProps();
    renderHook(() => useThreeAnimation(props));

    // Mock a large delta
    mockClock.getDelta.mockReturnValue(0.1);

    act(() => {
      animationCallback(0);
    });

    // elapsedTime should be 0.033, not 0.1
    expect(props.updateParticles).toHaveBeenCalledWith(
      0.033,
      expect.any(Number),
      expect.any(Number)
    );
  });

  it("should normalize and smooth mouse coordinates", () => {
    let animationCallback: FrameRequestCallback = () => {};
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      animationCallback = cb;
      return 1;
    });

    const props = createDefaultProps();
    props.mouseRef = { current: { x: 1000, y: 1000 } }; // Bottom right
    props.dimensionsRef = { current: { width: 1000, height: 1000 } };

    renderHook(() => useThreeAnimation(props));

    // normalizedMouseX = (1000 / 1000) * 2 - 1 = 1
    // normalizedMouseY = -(1000 / 1000) * 2 + 1 = -1
    // targetX = 0 + (1 - 0) * 0.02 = 0.02
    // targetY = 0 + (-1 - 0) * 0.02 = -0.02

    act(() => {
      animationCallback(0);
    });

    expect(props.updateParticles).toHaveBeenCalledWith(
      expect.any(Number),
      0.02,
      -0.02
    );

    // Second frame
    // targetX = 0.02 + (1 - 0.02) * 0.02 = 0.02 + 0.98 * 0.02 = 0.02 + 0.0196 = 0.0396
    act(() => {
      animationCallback(0);
    });

    const secondCallArgs = props.updateParticles.mock.calls[1];
    expect(secondCallArgs[1]).toBeCloseTo(0.0396);
    expect(secondCallArgs[2]).toBeCloseTo(-0.0396);
  });

  it("should perform only render (no updates) when shouldAnimate is false during loop", () => {
    let animationCallback: FrameRequestCallback = () => {};
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      animationCallback = cb;
      return 1;
    });

    const props = createDefaultProps();
    const { rerender } = renderHook(
      ({ shouldAnimate }) => useThreeAnimation({ ...props, shouldAnimate }),
      { initialProps: { shouldAnimate: true } }
    );

    // Transition to false
    act(() => {
      rerender({ shouldAnimate: false });
    });

    // Clear call history
    mockRenderer.render.mockClear();
    props.updateParticles.mockClear();

    // Now call the animation callback that was already queued
    act(() => {
      animationCallback(0);
    });

    expect(mockRenderer.render).toHaveBeenCalledWith(mockScene, mockCamera);
    expect(props.updateParticles).not.toHaveBeenCalled();
    expect(props.updateShapes).not.toHaveBeenCalled();
  });
});
