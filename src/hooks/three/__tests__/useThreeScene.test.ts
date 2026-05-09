import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useThreeScene } from "../useThreeScene";

// Mock sub-hooks
const mockInitBase = vi.fn();
const mockCleanupBase = vi.fn();
const mockRendererRef = { current: { render: vi.fn() } as any };
const mockCameraRef = { current: {} as any };
const mockSceneRef = { current: { add: vi.fn() } as any };

vi.mock("../useThreeBase", () => ({
  useThreeBase: vi.fn(() => ({
    init: mockInitBase,
    cleanup: mockCleanupBase,
    rendererRef: mockRendererRef,
    cameraRef: mockCameraRef,
    sceneRef: mockSceneRef,
  })),
}));

const mockMouseRef = { current: { x: 0, y: 0 } };
const mockDimensionsRef = { current: { width: 1000, height: 1000 } };
let mockShouldAnimateState = true;

vi.mock("../useInteractivity", () => ({
  useInteractivity: vi.fn(() => ({
    mouseRef: mockMouseRef,
    dimensionsRef: mockDimensionsRef,
    shouldAnimate: mockShouldAnimateState,
  })),
}));

const mockInitParticles = vi.fn();
const mockUpdateParticles = vi.fn();
const mockCleanupParticles = vi.fn();

vi.mock("../useParticles", () => ({
  useParticles: vi.fn(() => ({
    init: mockInitParticles,
    update: mockUpdateParticles,
    cleanup: mockCleanupParticles,
  })),
}));

const mockInitShapes = vi.fn();
const mockUpdateShapes = vi.fn();
const mockCleanupShapes = vi.fn();

vi.mock("../useShapes", () => ({
  useShapes: vi.fn(() => ({
    init: mockInitShapes,
    update: mockUpdateShapes,
    cleanup: mockCleanupShapes,
  })),
}));

// Mock THREE.Clock
vi.mock("three", async () => {
  const actual = await vi.importActual("three");
  return {
    ...actual,
    Clock: vi.fn().mockImplementation(function() {
      return {
        start: vi.fn(),
        getDelta: vi.fn(() => 0.016),
      };
    }),
  };
});

describe("useThreeScene", () => {
  let containerRef: { current: HTMLDivElement | null };

  beforeEach(() => {
    vi.useFakeTimers();
    // We need to return a positive integer for requestAnimationFrame
    let nextFrameId = 1;
    vi.stubGlobal("requestAnimationFrame", vi.fn((cb) => {
      const id = nextFrameId++;
      setTimeout(() => cb(Date.now()), 16);
      return id;
    }));
    vi.stubGlobal("cancelAnimationFrame", vi.fn((id) => {
      // Do nothing, just mock it.
    }));

    containerRef = { current: document.createElement("div") };

    mockInitBase.mockReturnValue({ scene: mockSceneRef.current });
    mockShouldAnimateState = true;

    // Reset call counts but keep implementations
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("initializes all sub-hooks when container is provided", () => {
    renderHook(() => useThreeScene(containerRef as any));

    expect(mockInitBase).toHaveBeenCalledWith(containerRef.current);
    expect(mockInitParticles).toHaveBeenCalledWith(mockSceneRef.current);
    expect(mockInitShapes).toHaveBeenCalledWith(mockSceneRef.current);
  });

  it("starts animation loop when shouldAnimate is true", () => {
    renderHook(() => useThreeScene(containerRef as any));

    expect(requestAnimationFrame).toHaveBeenCalled();

    // Fast-forward to trigger the animation frame
    act(() => {
      vi.advanceTimersByTime(20);
    });

    expect(mockUpdateParticles).toHaveBeenCalled();
    expect(mockUpdateShapes).toHaveBeenCalled();
    expect(mockRendererRef.current.render).toHaveBeenCalledWith(mockSceneRef.current, mockCameraRef.current);
  });

  it("stops animation loop when shouldAnimate becomes false", () => {
    mockShouldAnimateState = true;
    const { rerender } = renderHook(() => useThreeScene(containerRef as any));

    // Ensure it started
    expect(requestAnimationFrame).toHaveBeenCalled();
    vi.clearAllMocks();

    // Change the mocked value
    mockShouldAnimateState = false;

    // Rerender to trigger the useEffect that handles shouldAnimate change
    act(() => {
      rerender();
    });

    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it("cleans up all sub-hooks on unmount", () => {
    const { unmount } = renderHook(() => useThreeScene(containerRef as any));

    const currentScene = mockSceneRef.current;
    unmount();

    expect(mockCleanupParticles).toHaveBeenCalledWith(currentScene);
    expect(mockCleanupShapes).toHaveBeenCalledWith(currentScene);
    expect(mockCleanupBase).toHaveBeenCalledWith(containerRef.current);
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it("handles initialization errors and cleans up partially created resources", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("WebGL Error");
    mockInitBase.mockImplementation(() => {
      throw error;
    });

    renderHook(() => useThreeScene(containerRef as any));

    expect(mockCleanupParticles).toHaveBeenCalled();
    expect(mockCleanupShapes).toHaveBeenCalled();
    expect(mockCleanupBase).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "ThreeScene disabled because WebGL setup failed.",
      error
    );
  });
});
