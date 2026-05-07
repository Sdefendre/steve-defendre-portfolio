import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import AnimatedBackground from "../AnimatedBackground";

// Mock ThreeScene which is dynamically imported
vi.mock("../ThreeScene", () => ({
  default: () => <div data-testid="three-scene">Three Scene</div>,
}));

describe("AnimatedBackground", () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  const setWidth = (width: number) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event("resize"));
  };

  it("renders mobile fallback when width is less than 1024", () => {
    // Set width to mobile
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<AnimatedBackground />);

    expect(screen.queryByTestId("three-scene")).not.toBeInTheDocument();

    // Check for the fallback div classes
    // Note: It uses "fixed inset-0 -z-10 bg-gray-50 lg:bg-transparent"
    const fallback = document.querySelector(".bg-gray-50");
    expect(fallback).toBeInTheDocument();
  });

  it("renders ThreeScene when width is 1024 or greater", async () => {
    // Set width to desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });

    render(<AnimatedBackground />);

    expect(await screen.findByTestId("three-scene")).toBeInTheDocument();
  });

  it("responds to window resize events", async () => {
    // Start with mobile
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 375,
    });

    render(<AnimatedBackground />);
    expect(screen.queryByTestId("three-scene")).not.toBeInTheDocument();

    // Resize to desktop
    await act(async () => {
      setWidth(1200);
    });

    expect(await screen.findByTestId("three-scene")).toBeInTheDocument();

    // Resize back to mobile
    await act(async () => {
      setWidth(800);
    });

    expect(screen.queryByTestId("three-scene")).not.toBeInTheDocument();
  });
});
