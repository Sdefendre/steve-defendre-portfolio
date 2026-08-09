import { track } from "@vercel/analytics";

type AnalyticsPrimitive = string | number | boolean;

export type AnalyticsPropertyValue = AnalyticsPrimitive | null | undefined;

export type AnalyticsProperties = Record<string, AnalyticsPropertyValue>;
type TrackableAnalyticsProperties = Record<string, AnalyticsPrimitive>;

const isTestEnvironment = process.env.NODE_ENV === "test";

export function trackAnalyticsEvent(eventName: string, properties: AnalyticsProperties = {}): void {
  if (isTestEnvironment || typeof window === "undefined") {
    return;
  }

  try {
    const sanitizedProperties = sanitizeAnalyticsProperties(properties);
    track(eventName, sanitizedProperties);
  } catch {
    // Fail closed when the analytics runtime is unavailable.
  }
}

function sanitizeAnalyticsProperties(properties: AnalyticsProperties): TrackableAnalyticsProperties {
  const sanitized: TrackableAnalyticsProperties = {};

  for (const [key, value] of Object.entries(properties)) {
    if (value === null || value === undefined) {
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
}
