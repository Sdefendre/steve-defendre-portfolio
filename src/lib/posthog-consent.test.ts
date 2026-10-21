import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  POSTHOG_HOST_PLACEHOLDER,
  POSTHOG_KEY_PLACEHOLDER,
  buildStaticHomeContentSecurityPolicy,
  consentValues,
  createPostHogInitOptions,
  getPostHogConfig,
  getPostHogCspOrigins,
  injectPostHogRuntime,
  readConsentChoice,
  shouldInitPostHog,
  writeConsentChoice,
} from "./posthog-consent";
import { initPostHogIfAllowed, resetPostHogInitForTests } from "./posthog-init";

const configuredEnv = {
  NEXT_PUBLIC_POSTHOG_KEY: "phc_test_key",
  NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com",
};

afterEach(() => {
  resetPostHogInitForTests();
  window.localStorage.clear();
  vi.unstubAllEnvs();
});

describe("PostHog config feature detection", () => {
  it("returns null when either public env var is missing", () => {
    expect(getPostHogConfig({})).toBeNull();
    expect(getPostHogConfig({ NEXT_PUBLIC_POSTHOG_KEY: "phc_test_key" })).toBeNull();
    expect(
      getPostHogConfig({ NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com" }),
    ).toBeNull();
    expect(
      getPostHogConfig({
        NEXT_PUBLIC_POSTHOG_KEY: "  ",
        NEXT_PUBLIC_POSTHOG_HOST: "https://us.i.posthog.com",
      }),
    ).toBeNull();
  });

  it("accepts a configured https host and ignores a bad host", () => {
    expect(getPostHogConfig(configuredEnv)).toEqual({
      key: "phc_test_key",
      host: "https://us.i.posthog.com",
    });
    expect(
      getPostHogConfig({
        NEXT_PUBLIC_POSTHOG_KEY: "phc_test_key",
        NEXT_PUBLIC_POSTHOG_HOST: "not-a-url",
      }),
    ).toBeNull();
  });
});

describe("consent storage", () => {
  it("reads only accepted or declined values", () => {
    const storage = {
      getItem: vi.fn((key: string) => {
        expect(key).toBe(CONSENT_STORAGE_KEY);
        return "nope";
      }),
    };

    expect(readConsentChoice(storage)).toBeNull();
    expect(readConsentChoice({ getItem: () => consentValues.accepted })).toBe(
      "accepted",
    );
    expect(readConsentChoice({ getItem: () => consentValues.declined })).toBe(
      "declined",
    );
  });

  it("remembers the visitor choice", () => {
    writeConsentChoice(consentValues.declined);
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("declined");
    expect(readConsentChoice()).toBe("declined");
  });
});

describe("consent gating", () => {
  it("does not init before Accept or after Decline", () => {
    const config = getPostHogConfig(configuredEnv);

    expect(shouldInitPostHog(null, config)).toBe(false);
    expect(shouldInitPostHog(consentValues.declined, config)).toBe(false);
    expect(shouldInitPostHog(consentValues.accepted, null)).toBe(false);
    expect(shouldInitPostHog(consentValues.accepted, config)).toBe(true);
  });

  it("never calls the SDK before Accept", async () => {
    const init = vi.fn();
    const config = getPostHogConfig(configuredEnv);

    await expect(
      initPostHogIfAllowed(null, config, async () => ({ init })),
    ).resolves.toBe(false);
    expect(init).not.toHaveBeenCalled();
  });

  it("never calls the SDK after Decline", async () => {
    const init = vi.fn();
    const config = getPostHogConfig(configuredEnv);

    await expect(
      initPostHogIfAllowed(consentValues.declined, config, async () => ({ init })),
    ).resolves.toBe(false);
    expect(init).not.toHaveBeenCalled();
  });

  it("inits once after Accept and masks typed input", async () => {
    const init = vi.fn();
    const config = getPostHogConfig(configuredEnv);

    await expect(
      initPostHogIfAllowed(consentValues.accepted, config, async () => ({ init })),
    ).resolves.toBe(true);
    await expect(
      initPostHogIfAllowed(consentValues.accepted, config, async () => ({ init })),
    ).resolves.toBe(false);

    expect(init).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledWith(
      "phc_test_key",
      createPostHogInitOptions("https://us.i.posthog.com"),
    );
    expect(createPostHogInitOptions("https://us.i.posthog.com").session_recording.maskAllInputs).toBe(
      true,
    );
  });

  it("does not throw when env vars are missing", async () => {
    const init = vi.fn();

    await expect(
      initPostHogIfAllowed(consentValues.accepted, getPostHogConfig({}), async () => ({
        init,
      })),
    ).resolves.toBe(false);
    expect(init).not.toHaveBeenCalled();
  });
});

describe("static homepage runtime injection", () => {
  it("fills placeholders, appends the consent script, and leaves secrets out of empty env", () => {
    const html =
      `<html><body><aside data-posthog-key="${POSTHOG_KEY_PLACEHOLDER}" data-posthog-host="${POSTHOG_HOST_PLACEHOLDER}"></aside></body></html>`;

    expect(injectPostHogRuntime(html, {})).toBe(
      '<html><body><aside data-posthog-key="" data-posthog-host=""></aside><script src="/posthog-consent.js" defer></script></body></html>',
    );
    expect(injectPostHogRuntime(html, configuredEnv)).toContain(
      'data-posthog-key="phc_test_key"',
    );
    expect(injectPostHogRuntime(html, configuredEnv)).toContain(
      'data-posthog-host="https://us.i.posthog.com"',
    );
  });

  it("adds PostHog hosts to CSP only when configured", () => {
    expect(getPostHogCspOrigins({})).toEqual([]);
    expect(buildStaticHomeContentSecurityPolicy({})).not.toContain("posthog.com");
    expect(getPostHogCspOrigins(configuredEnv)).toEqual([
      "https://us.i.posthog.com",
      "https://us-assets.i.posthog.com",
    ]);
    expect(buildStaticHomeContentSecurityPolicy(configuredEnv)).toContain(
      "connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com",
    );
  });
});

describe("homepage consent script", () => {
  it("shares the storage key and only loads PostHog from the accept path", () => {
    const script = readFileSync("public/posthog-consent.js", "utf8");

    expect(script).toContain(CONSENT_STORAGE_KEY);
    expect(script).toContain("maskAllInputs");
    expect(script.indexOf('choice === "declined"')).toBeLessThan(
      script.indexOf("loadAndInit"),
    );
    expect(script.indexOf("root.hidden = false")).toBeLessThan(
      script.indexOf("loadAndInit"),
    );
  });

  it("does not create the PostHog script before Accept or after Decline", () => {
    document.body.innerHTML =
      '<aside id="posthog-consent" hidden data-posthog-key="phc_test_key" data-posthog-host="https://us.i.posthog.com"><button type="button" data-consent="accept">Accept</button><button type="button" data-consent="decline">Decline</button></aside>';

    const scriptSources: string[] = [];
    const createElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, "createElement").mockImplementation((tagName) => {
      const element = createElement(tagName);
      if (tagName === "script") {
        Object.defineProperty(element, "src", {
          configurable: true,
          set(value: string) {
            scriptSources.push(value);
          },
          get() {
            return scriptSources.at(-1) ?? "";
          },
        });
      }
      return element;
    });

    try {
      new Function(readFileSync("public/posthog-consent.js", "utf8"))();
      expect(scriptSources).toEqual([]);
      expect(document.getElementById("posthog-consent")?.hidden).toBe(false);

      document.querySelector("[data-consent='decline']")?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
      expect(scriptSources).toEqual([]);
      expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("declined");

      resetPostHogInitForTests();
      new Function(readFileSync("public/posthog-consent.js", "utf8"))();
      expect(scriptSources).toEqual([]);
    } finally {
      createElementSpy.mockRestore();
    }
  });
});
