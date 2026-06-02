import { render } from "@testing-library/react";
const threeMockState = vi.hoisted(() => ({
  failRendererConstruction: false,
  failBufferGeometryConstruction: false,
}));

vi.mock("three", () => {
  class Scene {
    add = vi.fn();
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

    constructor() {
      if (threeMockState.failRendererConstruction) {
        throw new Error("WebGL unavailable");
      }
    }
  }

  class BufferGeometry {
    setAttribute = vi.fn();
    dispose = vi.fn();

    constructor() {
      if (threeMockState.failBufferGeometryConstruction) {
        throw new Error("Geometry setup failed");
      }
    }
  }

  class Clock {
    start = vi.fn();
    getDelta = vi.fn(() => 0.016);
  }

  class Color {
    constructor(color: string) {
      return { color };
    }
  }

  class Points {
    rotation = { x: 0, y: 0 };
  }

  class Mesh {
    position = { x: 0, y: 0, z: 0 };
    rotation = { x: 0, y: 0 };
    scale = { set: vi.fn() };
  }

  return {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BufferGeometry,
    Clock,
    Color,
    Points,
    Mesh,
    IcosahedronGeometry: vi.fn(),
    OctahedronGeometry: vi.fn(),
    TetrahedronGeometry: vi.fn(),
    PointsMaterial: vi.fn(),
    MeshBasicMaterial: vi.fn(),
    BufferAttribute: vi.fn(),
    AdditiveBlending: 1,
  };
});

import ThreeScene from "../ThreeScene";

describe("ThreeScene", () => {
  beforeEach(() => {
    threeMockState.failRendererConstruction = false;
    threeMockState.failBufferGeometryConstruction = false;

    // Mock window.matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("keeps the static gradient fallback when renderer creation fails", () => {
    threeMockState.failRendererConstruction = true;
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const { container } = render(<ThreeScene />);
    const background = container.firstChild as HTMLDivElement;

    expect(background).toBeInTheDocument();
    expect(background.className).toContain("bg-gradient-to-br");
    expect(background.className).toContain("from-[#fafafa]");
    expect(background.className).toContain("to-[#f0f0f5]");
    expect(background.querySelector("canvas")).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "ThreeScene disabled because WebGL setup failed.",
      expect.any(Error)
    );
  });

  it("removes the canvas and keeps the gradient when setup fails after mount", () => {
    threeMockState.failBufferGeometryConstruction = true;
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const { container } = render(<ThreeScene />);
    const background = container.firstChild as HTMLDivElement;

    expect(background).toBeInTheDocument();
    expect(background.className).toContain("bg-gradient-to-br");
    expect(background.className).toContain("from-[#fafafa]");
    expect(background.className).toContain("to-[#f0f0f5]");
    expect(background.querySelector("canvas")).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "ThreeScene disabled because WebGL setup failed.",
      expect.any(Error)
    );
  });
});
