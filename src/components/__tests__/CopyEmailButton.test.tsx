import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyEmailButton } from "../CopyEmailButton";

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");

function setClipboard(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText,
    },
  });
}

afterEach(() => {
  vi.restoreAllMocks();

  if (originalClipboard) {
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  } else {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
  }
});

describe("CopyEmailButton", () => {
  it("copies the email address and announces success accessibly", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);

    render(<CopyEmailButton email="steve@defendresolutions.com" />);

    fireEvent.click(screen.getByRole("button", { name: /copy email/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("steve@defendresolutions.com");
    });

    expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "steve@defendresolutions.com copied to clipboard.",
    );
  });

  it("reports copy failures without using window alerts", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });

    render(<CopyEmailButton email="steve@defendresolutions.com" />);

    fireEvent.click(screen.getByRole("button", { name: /copy email/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Copy attempt 1 failed");
    });
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it("changes the live-region text for every consecutive copy failure", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("Clipboard denied"));
    setClipboard(writeText);

    render(<CopyEmailButton email="steve@defendresolutions.com" />);

    fireEvent.click(screen.getByRole("button", { name: /copy email/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Copy attempt 1 failed");
    });

    fireEvent.click(screen.getByRole("button", { name: /try copy again/i }));
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Copy attempt 2 failed");
    });

    expect(writeText).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
  });
});
