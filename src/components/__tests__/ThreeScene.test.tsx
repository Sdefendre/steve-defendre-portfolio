import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

  return {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BufferGeometry,
  };
});

import ThreeScene from "../ThreeScene";

describe("ThreeScene", () => {
  beforeEach(() => {
    threeMockState.failRendererConstruction = false;
    threeMockState.failBufferGeometryConstruction = false;
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
    expect(background.getAttribute("style")).toContain("linear-gradient");
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
    expect(background.getAttribute("style")).toContain("linear-gradient");
    expect(background.querySelector("canvas")).not.toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "ThreeScene disabled because WebGL setup failed.",
      expect.any(Error)
    );
  });
});
