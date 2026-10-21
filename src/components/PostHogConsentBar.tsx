interface PostHogConsentBarProps {
  isHidden?: boolean;
  posthogKey?: string;
  posthogHost?: string;
}

// Stay outside overflow-x-clip wrappers so position:fixed tracks the viewport.
// Keep spatial-glass on the inner panel so it cannot override position:fixed.
export function PostHogConsentBar({
  isHidden = true,
  posthogKey,
  posthogHost,
}: PostHogConsentBarProps) {
  return (
    <aside
      id="posthog-consent"
      hidden={isHidden}
      aria-label="Analytics consent"
      data-posthog-key={posthogKey}
      data-posthog-host={posthogHost}
      className="pointer-events-auto fixed inset-x-3 z-30 max-w-lg bottom-[calc(var(--mobile-nav-clearance)+0.75rem)] sm:left-1/2 sm:right-auto sm:w-[min(32rem,calc(100%-1.5rem))] sm:-translate-x-1/2 md:bottom-6"
    >
      <div className="spatial-glass flex flex-col gap-3 rounded-[1.25rem] p-4">
        <p className="text-sm leading-6 text-[var(--muted-foreground)]">
          Optional analytics (PostHog) help me see how this site is used. Typed
          input is masked in session recordings.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            data-consent="accept"
            className="focus-ring min-h-11 rounded-full bg-[var(--accent-strong)] px-4 text-sm font-bold text-[var(--accent-foreground)]"
          >
            Accept
          </button>
          <button
            type="button"
            data-consent="decline"
            className="focus-ring min-h-11 rounded-full border border-[var(--border)] px-4 text-sm font-bold text-[var(--foreground)]"
          >
            Decline
          </button>
        </div>
      </div>
    </aside>
  );
}
