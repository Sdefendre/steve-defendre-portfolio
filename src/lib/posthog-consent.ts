export const CONSENT_STORAGE_KEY = "portfolio-analytics-consent";

export const POSTHOG_KEY_PLACEHOLDER = "__POSTHOG_KEY__";
export const POSTHOG_HOST_PLACEHOLDER = "__POSTHOG_HOST__";

export const consentValues = {
  accepted: "accepted",
  declined: "declined",
} as const;

export type ConsentChoice = (typeof consentValues)[keyof typeof consentValues];

export interface PostHogConfig {
  key: string;
  host: string;
}

export function getPostHogConfig(
  env: Record<string, string | undefined> = process.env,
): PostHogConfig | null {
  const key = env.NEXT_PUBLIC_POSTHOG_KEY?.trim() ?? "";
  const host = env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ?? "";
  if (!key || !host) return null;

  try {
    const url = new URL(host);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return { key, host: url.origin };
  } catch {
    return null;
  }
}

export function readConsentChoice(
  storage: Pick<Storage, "getItem"> | null = getBrowserStorage(),
): ConsentChoice | null {
  const value = storage?.getItem(CONSENT_STORAGE_KEY);
  if (value === consentValues.accepted || value === consentValues.declined) return value;
  return null;
}

export function writeConsentChoice(
  choice: ConsentChoice,
  storage: Pick<Storage, "setItem"> | null = getBrowserStorage(),
): void {
  storage?.setItem(CONSENT_STORAGE_KEY, choice);
}

export function shouldInitPostHog(
  choice: ConsentChoice | null,
  config: PostHogConfig | null,
): boolean {
  return choice === consentValues.accepted && config !== null;
}

export function getPostHogCspOrigins(
  env: Record<string, string | undefined> = process.env,
): string[] {
  const host = env.NEXT_PUBLIC_POSTHOG_HOST?.trim() ?? "";
  if (!host) return [];

  try {
    const url = new URL(host);
    if (url.protocol !== "http:" && url.protocol !== "https:") return [];

    const origins = [url.origin];
    const assetsOrigin = url.origin.replace(".i.posthog.com", "-assets.i.posthog.com");
    if (assetsOrigin !== url.origin) origins.push(assetsOrigin);
    return origins;
  } catch {
    return [];
  }
}

export function createPostHogInitOptions(host: string) {
  return {
    api_host: host,
    defaults: "2026-01-30" as const,
    session_recording: {
      maskAllInputs: true,
    },
  };
}

export function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function injectPostHogRuntime(
  html: string,
  env: Record<string, string | undefined> = process.env,
): string {
  const config = getPostHogConfig(env);
  const withConfig = html
    .replaceAll(POSTHOG_KEY_PLACEHOLDER, escapeHtmlAttribute(config?.key ?? ""))
    .replaceAll(POSTHOG_HOST_PLACEHOLDER, escapeHtmlAttribute(config?.host ?? ""));

  if (withConfig.includes('src="/posthog-consent.js"')) return withConfig;

  return withConfig.replace(
    "</body>",
    '<script src="/posthog-consent.js" defer></script></body>',
  );
}

export function buildStaticHomeContentSecurityPolicy(
  env: Record<string, string | undefined> = process.env,
): string {
  const origins = getPostHogCspOrigins(env);
  const extraScript = origins.length > 0 ? ` ${origins.join(" ")}` : "";
  const connect = origins.length > 0 ? ` connect-src 'self' ${origins.join(" ")};` : "";

  return `default-src 'self'; script-src 'self'${extraScript}; style-src 'self'; img-src 'self' blob: data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';${connect} upgrade-insecure-requests`;
}

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

