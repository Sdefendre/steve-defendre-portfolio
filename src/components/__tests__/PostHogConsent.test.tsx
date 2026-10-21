import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PostHogConsent } from "../PostHogConsent";
import { CONSENT_STORAGE_KEY } from "@/lib/posthog-consent";
import { resetPostHogInitForTests } from "@/lib/posthog-init";

const init = vi.hoisted(() => vi.fn());

vi.mock("posthog-js", () => ({
  default: { init },
}));

afterEach(() => {
  resetPostHogInitForTests();
  window.localStorage.clear();
  init.mockReset();
  vi.unstubAllEnvs();
});

function stubConfiguredEnv() {
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test_key");
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://us.i.posthog.com");
}

describe("PostHogConsent", () => {
  it("does not init PostHog before Accept", async () => {
    stubConfiguredEnv();
    render(<PostHogConsent />);

    expect(await screen.findByRole("button", { name: "Accept" })).toBeInTheDocument();
    expect(init).not.toHaveBeenCalled();
  });

  it("inits PostHog only after Accept and masks typed input", async () => {
    stubConfiguredEnv();
    render(<PostHogConsent />);

    fireEvent.click(await screen.findByRole("button", { name: "Accept" }));

    await waitFor(() => {
      expect(init).toHaveBeenCalledTimes(1);
    });
    expect(init).toHaveBeenCalledWith(
      "phc_test_key",
      expect.objectContaining({
        api_host: "https://us.i.posthog.com",
        session_recording: { maskAllInputs: true },
      }),
    );
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("accepted");
    expect(screen.queryByRole("button", { name: "Accept" })).not.toBeInTheDocument();
  });

  it("does not init PostHog after Decline, including on remount", async () => {
    stubConfiguredEnv();
    const { unmount } = render(<PostHogConsent />);

    fireEvent.click(await screen.findByRole("button", { name: "Decline" }));
    expect(init).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("declined");

    unmount();
    render(<PostHogConsent />);

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Decline" })).not.toBeInTheDocument();
    });
    expect(init).not.toHaveBeenCalled();
  });

  it("does not throw or init when the public env vars are missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "");

    render(<PostHogConsent />);
    fireEvent.click(await screen.findByRole("button", { name: "Accept" }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Accept" })).not.toBeInTheDocument();
    });
    expect(init).not.toHaveBeenCalled();
  });
});

describe("consent bar placement", () => {
  it("stays below the floating docks and above the mobile nav clearance", () => {
    const source = readFileSync("src/components/PostHogConsentBar.tsx", "utf8");
    const homeShell = readFileSync("src/components/HomeShell.tsx", "utf8");
    const siteLayout = readFileSync("src/app/(site)/layout.tsx", "utf8");

    expect(source).toContain('className="pointer-events-auto fixed inset-x-3 z-30');
    expect(source).toContain("bottom-[calc(var(--mobile-nav-clearance)+0.75rem)]");
    expect(source).toContain("md:bottom-6");
    expect(source).not.toContain("inset-x-0 bottom-0");
    expect(source.indexOf("pointer-events-auto fixed")).toBeLessThan(
      source.indexOf('className="spatial-glass'),
    );
    expect(homeShell.indexOf("overflow-x-clip")).toBeLessThan(
      homeShell.indexOf("<PostHogConsentBar"),
    );
    expect(siteLayout.indexOf("overflow-x-clip")).toBeLessThan(
      siteLayout.indexOf("<PostHogConsent"),
    );
  });
});
