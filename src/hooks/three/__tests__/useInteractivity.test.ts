import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { useInteractivity } from "../useInteractivity";

describe("useInteractivity", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("throttles/debounces resize events", () => {
    let accessCount = 0;
    const originalInnerWidth = window.innerWidth;

    Object.defineProperty(window, "innerWidth", {
      get: () => {
        accessCount++;
        return 1024;
      },
      configurable: true,
    });

    renderHook(() => useInteractivity());

    // Initial call during render/mount
    const initialAccessCount = accessCount;

    // Fire multiple resize events
    act(() => {
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("resize"));
      window.dispatchEvent(new Event("resize"));
    });

    // Access count should not have increased yet because of debounce
    expect(accessCount).toBe(initialAccessCount);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Now it should have increased by 1
    expect(accessCount).toBe(initialAccessCount + 1);

    // Restore original property
    Object.defineProperty(window, "innerWidth", { value: originalInnerWidth, configurable: true });
  });
});
