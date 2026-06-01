import { render, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ThreeScene from "../ThreeScene";

// Mock Three.js to avoid WebGL errors
vi.mock("three", () => {
  class Scene {
    add = vi.fn();
    remove = vi.fn();
  }

  class PerspectiveCamera {
    position = { z: 0 };
    aspect = 1;
    updateProjectionMatrix = vi.fn();
  }

  class WebGLRenderer {
    domElement = document.createElement("canvas");
    setSize = vi.fn();
    setPixelRatio = vi.fn();
    dispose = vi.fn();
    render = vi.fn();
  }

  class BufferGeometry {
    setAttribute = vi.fn();
    dispose = vi.fn();
  }

  class BufferAttribute {
    constructor() {}
  }

  class PointsMaterial {
    dispose = vi.fn();
    constructor() {}
  }

  class Points {
    rotation = { x: 0, y: 0 };
    constructor() {}
  }

  class IcosahedronGeometry {
    dispose = vi.fn();
  }
  class OctahedronGeometry {
    dispose = vi.fn();
  }
  class TetrahedronGeometry {
    dispose = vi.fn();
  }

  class MeshBasicMaterial {
    color = { set: vi.fn() };
    clone() {
      return {
        dispose: vi.fn(),
      };
    }
    dispose = vi.fn();
  }

  class Mesh {
    position = { x: 0, y: 0, z: 0 };
    rotation = { x: 0, y: 0 };
    scale = { set: vi.fn() };
    material = { dispose: vi.fn() };
  }

  class Color {
    constructor() {}
  }

  class Clock {
    start = vi.fn();
    getDelta = vi.fn().mockReturnValue(0.016);
  }

  return {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BufferGeometry,
    BufferAttribute,
    PointsMaterial,
    Points,
    IcosahedronGeometry,
    OctahedronGeometry,
    TetrahedronGeometry,
    MeshBasicMaterial,
    Mesh,
    Color,
    Clock,
    AdditiveBlending: 1,
  };
});

describe("ThreeScene Performance", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("tracks window dimension access during mousemove", () => {
    let innerWidthAccessCount = 0;
    let innerHeightAccessCount = 0;

    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;

    Object.defineProperty(window, "innerWidth", {
      get: () => {
        innerWidthAccessCount++;
        return 1024;
      },
      configurable: true,
    });

    Object.defineProperty(window, "innerHeight", {
      get: () => {
        innerHeightAccessCount++;
        return 768;
      },
      configurable: true,
    });

    render(<ThreeScene />);

    // Reset counters after initial mount
    innerWidthAccessCount = 0;
    innerHeightAccessCount = 0;

    // Simulate mouse move
    fireEvent.mouseMove(window, { clientX: 500, clientY: 400 });

    // After optimization, these should NOT be accessed on mousemove
    expect(innerWidthAccessCount).toBe(0);
    expect(innerHeightAccessCount).toBe(0);

    // Simulate resize
    innerWidthAccessCount = 0;
    innerHeightAccessCount = 0;
    fireEvent.resize(window);

    // Should be accessed on resize after debounce
    vi.advanceTimersByTime(100);
    expect(innerWidthAccessCount).toBeGreaterThan(0);
    expect(innerHeightAccessCount).toBeGreaterThan(0);

    // Restore original properties
    Object.defineProperty(window, "innerWidth", { value: originalInnerWidth, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: originalInnerHeight, configurable: true });
  });
});
