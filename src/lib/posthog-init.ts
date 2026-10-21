import {
  createPostHogInitOptions,
  shouldInitPostHog,
  type ConsentChoice,
  type PostHogConfig,
} from "./posthog-consent";

export interface PostHogClient {
  init: (key: string, options: ReturnType<typeof createPostHogInitOptions>) => void;
}

let hasInitialized = false;

export function resetPostHogInitForTests(): void {
  hasInitialized = false;
}

export async function initPostHogIfAllowed(
  choice: ConsentChoice | null,
  config: PostHogConfig | null,
  loadClient: () => Promise<PostHogClient> = loadPostHogClient,
): Promise<boolean> {
  if (!shouldInitPostHog(choice, config) || !config || hasInitialized) return false;

  hasInitialized = true;
  try {
    const posthog = await loadClient();
    posthog.init(config.key, createPostHogInitOptions(config.host));
    return true;
  } catch {
    hasInitialized = false;
    return false;
  }
}

function loadPostHogClient(): Promise<PostHogClient> {
  // Dynamic import keeps the SDK out of the first page load until Accept.
  return import("posthog-js").then((module) => module.default);
}
