import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ContactComposer, buildContactMailtoUrl } from "../ContactComposer";

const trackAnalyticsEvent = vi.hoisted(() => vi.fn());

vi.mock("@/utils/analytics", () => ({
  trackAnalyticsEvent,
}));

describe("ContactComposer", () => {
  beforeEach(() => {
    trackAnalyticsEvent.mockClear();
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

  it("announces validation and success status with accessible semantics", async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
    const { container } = render(<ContactComposer />);
    const form = container.querySelector("form");

    expect(screen.getByRole("status")).toHaveTextContent(/nothing is sent automatically/i);

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

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/mail app should open/i));
    expect(screen.getByRole("button", { name: /prepare email draft/i })).toBeInTheDocument();

    clickSpy.mockRestore();
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
