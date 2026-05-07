import { render, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AnimatedBackground from "../AnimatedBackground";
import React from "react";

// Mock next/dynamic
vi.mock("next/dynamic", () => ({
  default: vi.fn(() => {
    const MockThreeScene = () => <div data-testid="three-scene">Mock Three Scene</div>;
    return MockThreeScene;
  }),
}));

describe("AnimatedBackground", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("renders ThreeScene on desktop (>= 1024px)", () => {
    window.innerWidth = 1024;
    const { getByTestId } = render(<AnimatedBackground />);
    expect(getByTestId("three-scene")).toBeInTheDocument();
  });

  it("renders mobile fallback on mobile (< 1024px)", () => {
    window.innerWidth = 1023;
    const { queryByTestId, container } = render(<AnimatedBackground />);
    expect(queryByTestId("three-scene")).not.toBeInTheDocument();

    const background = container.firstChild as HTMLElement;
    expect(background).toHaveClass("bg-gray-50");
    // On mobile, the inline background style should be undefined/empty
    expect(background.style.background).toBe("");
  });

  it("updates when window is resized", () => {
    // Start with desktop
    window.innerWidth = 1024;
    const { getByTestId, queryByTestId } = render(<AnimatedBackground />);
    expect(getByTestId("three-scene")).toBeInTheDocument();

    // Resize to mobile
    act(() => {
      window.innerWidth = 1023;
      fireEvent(window, new Event("resize"));
    });

    expect(queryByTestId("three-scene")).not.toBeInTheDocument();

    // Resize back to desktop
    act(() => {
      window.innerWidth = 1024;
      fireEvent(window, new Event("resize"));
    });

    expect(getByTestId("three-scene")).toBeInTheDocument();
  });

  it("cleans up event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<AnimatedBackground />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
  });
});
