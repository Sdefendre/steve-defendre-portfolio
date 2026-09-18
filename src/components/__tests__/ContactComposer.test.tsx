import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContactComposer, buildContactMailtoUrl, toWellFormedString } from "../ContactComposer";

const trackAnalyticsEvent = vi.hoisted(() => vi.fn());

vi.mock("@/utils/analytics", () => ({
  trackAnalyticsEvent,
}));

describe("ContactComposer", () => {
  beforeEach(() => {
    trackAnalyticsEvent.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("validates required fields and email on blur and submit", () => {
    const { container } = render(<ContactComposer />);
    const form = container.querySelector("form");

    fireEvent.blur(screen.getByLabelText(/your name/i));
    fireEvent.blur(screen.getByLabelText(/email address/i));
    fireEvent.blur(screen.getByLabelText(/project type/i));
    fireEvent.blur(screen.getByLabelText(/budget range/i));
    fireEvent.blur(screen.getByRole("textbox", { name: /message/i }));
    fireEvent.submit(form!);

    expect(screen.getByRole("alert")).toHaveTextContent(/check the highlighted fields/i);
    expect(screen.getByLabelText(/your name/i)).toHaveClass("border-rose-300");
    expect(screen.getByLabelText(/email address/i)).toHaveClass("border-rose-300");
    expect(screen.getByLabelText(/project type/i)).toHaveClass("border-rose-300");
    expect(screen.getByLabelText(/budget range/i)).toHaveClass("border-rose-300");
    expect(screen.getByRole("textbox", { name: /message/i })).toHaveClass("border-rose-300");
    expect(screen.getByText(/enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your email address/i)).toBeInTheDocument();
    expect(screen.getByText(/choose the kind of project you want help with/i)).toBeInTheDocument();
    expect(screen.getByText(/choose the budget range that fits best/i)).toBeInTheDocument();
    expect(screen.getByText(/add a short message so i can prepare the draft/i)).toBeInTheDocument();
  });

  it("clears the validation banner after the last invalid field is fixed", () => {
    const { container } = render(<ContactComposer />);
    const form = container.querySelector("form");

    fireEvent.submit(form!);
    expect(screen.getByRole("alert")).toHaveTextContent(/check the highlighted fields/i);

    fillValidForm();

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Opens a draft in your email app. You review and send it.",
    );
  });

  it("builds a properly encoded mailto draft and tracks the draft action", async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const { container } = render(<ContactComposer />);
    const form = container.querySelector("form");

    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: "Steve Example" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "steve@example.com" } });
    fireEvent.change(screen.getByLabelText(/project type/i), { target: { value: "new-website" } });
    fireEvent.change(screen.getByLabelText(/budget range/i), { target: { value: "10k-25k" } });
    fireEvent.change(screen.getByRole("textbox", { name: /message/i }), {
      target: { value: "Need a draft with spaces, commas, and / symbols." },
    });

    fireEvent.submit(form!);

    await waitFor(() => expect(clickSpy).toHaveBeenCalledTimes(1));
    expect(trackAnalyticsEvent).toHaveBeenCalledWith("contact_mailto_draft", {
      budget_range: "10k-25k",
      project_type: "new-website",
    });

    const expectedBody = [
      "Name: Steve Example",
      "Email: steve@example.com",
      "Project type: New website",
      "Budget range: $10k - $25k",
      "",
      "Message:",
      "Need a draft with spaces, commas, and / symbols.",
      "",
      "This draft was prepared from the Steve Defendre portfolio contact form.",
    ].join("\r\n");

    expect(
      buildContactMailtoUrl({
        name: "Steve Example",
        email: "steve@example.com",
        projectType: "new-website",
        budgetRange: "10k-25k",
        message: "Need a draft with spaces, commas, and / symbols.",
      }),
    ).toBe(
      `mailto:steve@defendresolutions.com?subject=${encodeURIComponent(
        "Project inquiry: New website",
      )}&body=${encodeURIComponent(expectedBody)}`,
    );

    clickSpy.mockRestore();
  });

  it("keeps surrogate-safe encoding when String.prototype.toWellFormed is missing", () => {
    const loneSurrogateMessage = "Emoji pair 🙂 then a lone half \uD83D and trailing text.";
    const nativeDescriptor = Object.getOwnPropertyDescriptor(String.prototype, "toWellFormed");
    const expectedWithNative = toWellFormedString(loneSurrogateMessage);

    expect(expectedWithNative).toBe("Emoji pair 🙂 then a lone half \uFFFD and trailing text.");

    // Simulate Firefox <= 118 / Safari <= 16.3, which lack the method entirely.
    Object.defineProperty(String.prototype, "toWellFormed", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    try {
      expect(typeof "".toWellFormed).toBe("undefined");
      expect(toWellFormedString(loneSurrogateMessage)).toBe(expectedWithNative);
      expect(() => encodeURIComponent(loneSurrogateMessage)).toThrow(URIError);

      const mailtoUrl = buildContactMailtoUrl({
        name: "Ada",
        email: "ada@example.com",
        projectType: "new-website",
        budgetRange: "5k-10k",
        message: loneSurrogateMessage,
      });
      expect(mailtoUrl).toContain(encodeURIComponent("🙂"));
      expect(mailtoUrl).toContain(encodeURIComponent("\uFFFD"));

      // Every field edit runs draft validation; it must not throw without the method.
      render(<ContactComposer />);
      const messageField = screen.getByRole("textbox", { name: /message/i });
      expect(() => fireEvent.change(messageField, { target: { value: loneSurrogateMessage } })).not.toThrow();
      expect(messageField).toHaveValue(loneSurrogateMessage);
    } finally {
      if (nativeDescriptor) {
        Object.defineProperty(String.prototype, "toWellFormed", nativeDescriptor);
      } else {
        delete (String.prototype as { toWellFormed?: unknown }).toWellFormed;
      }
    }
  });

  it("renders a perceivable busy state before handoff, then makes no delivery claim", () => {
    vi.useFakeTimers();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {
      expect(screen.getByRole("button", { name: /preparing draft/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /preparing draft/i }).closest("form")).toHaveAttribute(
        "aria-busy",
        "true",
      );
      expect(screen.getByRole("status")).toHaveTextContent(/preparing your email draft/i);
    });
    const { container } = render(<ContactComposer />);
    const form = container.querySelector("form");

    expect(screen.getByRole("status")).toHaveTextContent(
      "Opens a draft in your email app. You review and send it.",
    );
    expect(screen.queryByText(/mailto:/i)).not.toBeInTheDocument();
    expect(form).not.toHaveClass("border", "bg-[var(--surface)]", "p-4");
    expect(screen.getByLabelText(/your name/i)).toHaveClass("text-base");

    const emailInput = screen.getByLabelText(/email address/i);
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: "Steve Example" } });
    fireEvent.change(emailInput, { target: { value: "bad-email" } });
    fireEvent.blur(emailInput);

    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(emailInput).toHaveAttribute("aria-describedby");

    fireEvent.change(emailInput, { target: { value: "steve@example.com" } });
    fireEvent.change(screen.getByLabelText(/project type/i), { target: { value: "portfolio-refresh" } });
    fireEvent.change(screen.getByLabelText(/budget range/i), { target: { value: "25k-plus" } });
    fireEvent.change(screen.getByRole("textbox", { name: /message/i }), {
      target: { value: "This project needs a polished contact flow." },
    });

    fireEvent.submit(form!);

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /preparing draft/i })).toBeDisabled();

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(screen.getByRole("button", { name: /preparing draft/i })).toBeDisabled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.getByRole("status")).toHaveTextContent(/email draft requested/i);
    expect(screen.getByRole("status")).toHaveTextContent(/nothing was sent/i);
    expect(screen.getByRole("status")).toHaveTextContent(/if no mail app opened/i);
    expect(screen.getByRole("status")).not.toHaveTextContent(/message sent|email sent/i);
    expect(screen.getByRole("button", { name: /prepare email draft/i })).toBeInTheDocument();
    expect(form).toHaveAttribute("aria-busy", "false");
  });

  it("clears the preparing timer when the composer unmounts", () => {
    vi.useFakeTimers();
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    const { container, unmount } = render(<ContactComposer />);

    fillValidForm();
    fireEvent.submit(container.querySelector("form")!);
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("bounds field values and rejects a mailto URL that exceeds cross-app limits", () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const { container } = render(<ContactComposer />);

    expect(screen.getByLabelText(/your name/i)).toHaveAttribute("maxlength", "80");
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute("maxlength", "254");
    expect(screen.getByRole("textbox", { name: /message/i })).toHaveAttribute("maxlength", "1000");

    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: "Steve Example" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "steve@example.com" } });
    fireEvent.change(screen.getByLabelText(/project type/i), { target: { value: "new-website" } });
    fireEvent.change(screen.getByLabelText(/budget range/i), { target: { value: "10k-25k" } });
    fireEvent.change(screen.getByRole("textbox", { name: /message/i }), {
      target: { value: "🙂".repeat(500) },
    });

    expect(screen.getByText(/1000\/1000/i)).toBeInTheDocument();
    fireEvent.submit(container.querySelector("form")!);

    expect(screen.getByText(/shorten your message or use fewer special characters/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /message/i })).toHaveFocus();
    expect(clickSpy).not.toHaveBeenCalled();
    expect(trackAnalyticsEvent).not.toHaveBeenCalled();
  });

  it("first reveals draft overflow on submit so blur cannot move the clicked button", () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const { container } = render(<ContactComposer />);
    fillValidForm();
    const message = screen.getByRole("textbox", { name: /message/i });
    fireEvent.change(message, { target: { value: "🙂".repeat(200) } });
    const submitButton = screen.getByRole("button", { name: /prepare email draft/i });
    fireEvent.blur(message);
    expect(message).toHaveAttribute("aria-invalid", "false");
    fireEvent.blur(message, { relatedTarget: submitButton });
    // Keep the clicked button in place until its click submits the form.
    expect(screen.queryByText(/shorten your message or use fewer special characters/i)).not.toBeInTheDocument();
    fireEvent.submit(container.querySelector("form")!);
    expect(message).toHaveFocus();
    expect(message).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent(/check the highlighted fields/i);
    expect(clickSpy).not.toHaveBeenCalled();
    fireEvent.blur(message, { relatedTarget: submitButton });
    expect(message).toHaveAttribute("aria-invalid", "true");
  });

  it("keeps an oversized draft invalid through unchanged blur and still-too-long edits", () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const { container } = render(<ContactComposer />);
    fillValidForm();
    const message = screen.getByRole("textbox", { name: /message/i });
    fireEvent.change(message, { target: { value: "🙂".repeat(200) } });
    fireEvent.submit(container.querySelector("form")!);

    const expectOverflow = () => {
      expect(message).toHaveAttribute("aria-invalid", "true");
      expect(message).toHaveAccessibleDescription(/shorten your message or use fewer special characters/i);
      expect(screen.getByRole("alert")).toHaveTextContent(/check the highlighted fields/i);
    };
    expectOverflow();
    fireEvent.blur(message);
    expectOverflow();
    fireEvent.change(message, { target: { value: "🙂".repeat(190) } });
    expectOverflow();
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: "Ada" } });
    expectOverflow();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "" } });
    expectOverflow();
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute("aria-invalid", "true");
    expect(clickSpy).not.toHaveBeenCalled();
    expect(trackAnalyticsEvent).not.toHaveBeenCalled();

    fireEvent.change(message, { target: { value: "A short project inquiry." } });
    expect(message).toHaveAttribute("aria-invalid", "false");
    expect(screen.getByRole("alert")).toHaveTextContent(/check the highlighted fields/i);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "ada@example.com" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it.each([
    { label: /your name/i, long: "🙂".repeat(40), short: "Ada", emojiCount: 100 },
    { label: /email address/i, long: `${"a".repeat(100)}@example.com`, short: "ada@example.com", emojiCount: 131 },
    { label: /project type/i, long: "portfolio-refresh", short: "new-website", emojiCount: 138 },
    { label: /budget range/i, long: "10k-25k", short: "under-5k", emojiCount: 138 },
    { label: /^message/i, long: "🙂".repeat(200), short: "A short project inquiry.", emojiCount: 100 },
  ])("revalidates the complete draft when $label changes", ({ label, long, short, emojiCount }) => {
    const drafts: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      drafts.push(this.href);
    });
    const { container } = render(<ContactComposer />);
    fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText(/project type/i), { target: { value: "new-website" } });
    fireEvent.change(screen.getByLabelText(/budget range/i), { target: { value: "under-5k" } });
    const message = screen.getByRole("textbox", { name: /message/i });
    fireEvent.change(message, { target: { value: "🙂".repeat(emojiCount) } });
    fireEvent.change(screen.getByLabelText(label), { target: { value: long } });
    fireEvent.submit(container.querySelector("form")!);
    expect(message).toHaveAttribute("aria-invalid", "true");
    expect(drafts).toEqual([]);

    fireEvent.change(screen.getByLabelText(label), { target: { value: short } });
    expect(message).toHaveAttribute("aria-invalid", "false");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(drafts).toEqual([]);

    // Growing any contributing field must also restore the error without a submit.
    fireEvent.change(screen.getByLabelText(label), { target: { value: long } });
    expect(message).toHaveAttribute("aria-invalid", "true");
    fireEvent.change(screen.getByLabelText(label), { target: { value: short } });
    fireEvent.submit(container.querySelector("form")!);
    expect(drafts).toHaveLength(1);
    expect(drafts[0].length).toBeLessThanOrEqual(2000);
    expect(new URL(drafts[0]).searchParams.get("body")).toContain("Name: Ada");
  });

  it("describes name use in the draft body and validates the same trimmed draft on blur and submit", () => {
    const drafts: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      drafts.push(this.href);
    });
    const { container } = render(<ContactComposer />);
    fillValidForm();
    expect(screen.getByLabelText(/your name/i)).toHaveAccessibleDescription(/draft body/i);
    const message = screen.getByRole("textbox", { name: /message/i });
    fireEvent.change(message, { target: { value: `${" ".repeat(600)}A short project inquiry.` } });
    fireEvent.blur(message);
    expect(message).toHaveAttribute("aria-invalid", "false");
    fireEvent.submit(container.querySelector("form")!);
    expect(drafts).toHaveLength(1);
    expect(new URL(drafts[0]).searchParams.get("body")).toContain("Message:\r\nA short project inquiry.");
  });

  it("handles a truncated surrogate while validating and preparing the draft", () => {
    const drafts: string[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      drafts.push(this.href);
    });
    const { container } = render(<ContactComposer />);
    fillValidForm();
    const message = screen.getByRole("textbox", { name: /message/i });
    fireEvent.change(message, { target: { value: "A project inquiry with a truncated emoji: \uD83D" } });
    fireEvent.blur(message);
    fireEvent.submit(container.querySelector("form")!);
    expect(drafts).toHaveLength(1);
    expect(new URL(drafts[0]).searchParams.get("body")).toContain("A project inquiry with a truncated emoji: �");
  });

  it("reports a failed mail-app handoff without implying that anything was sent", () => {
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {
      throw new Error("No mail handler");
    });
    const { container } = render(<ContactComposer />);

    fillValidForm();
    fireEvent.submit(container.querySelector("form")!);

    expect(screen.getByRole("alert")).toHaveTextContent(/could not be opened/i);
    expect(screen.getByRole("alert")).toHaveTextContent(/nothing was sent/i);
    expect(screen.getByRole("button", { name: /prepare email draft/i })).toBeEnabled();
  });

  it("drops undefined analytics properties before calling track", async () => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");

    const track = vi.fn();
    vi.doUnmock("@/utils/analytics");
    vi.doMock("@vercel/analytics", () => ({
      track,
    }));

    const { trackAnalyticsEvent: realTrackAnalyticsEvent } = await import("@/utils/analytics");

    realTrackAnalyticsEvent("contact_mailto_draft", {
      project_type: "new-website",
      budget_range: undefined,
      notes: null,
      submitted: true,
    });

    expect(track).toHaveBeenCalledWith("contact_mailto_draft", {
      project_type: "new-website",
      submitted: true,
    });

    vi.unstubAllEnvs();
    vi.doMock("@/utils/analytics", () => ({
      trackAnalyticsEvent,
    }));
  });
});

function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: "Steve Example" } });
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "steve@example.com" } });
  fireEvent.change(screen.getByLabelText(/project type/i), { target: { value: "new-website" } });
  fireEvent.change(screen.getByLabelText(/budget range/i), { target: { value: "10k-25k" } });
  fireEvent.change(screen.getByRole("textbox", { name: /message/i }), {
    target: { value: "This is a detailed enough project inquiry." },
  });
}
