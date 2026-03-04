# Performance Optimization Rationale: Lazy Loading Mobile Iframes

## Optimization
Changed `loading="eager"` to `loading="lazy"` in the `CachedIframe` component within `src/components/MobileProjectCard.tsx`.

## Rationale
The `MobileProjectCard` component renders multiple project entries, each potentially containing an `iframe` that loads an external URL.

### Why this is an improvement:
1. **Deferred Network Usage:** By default, `loading="eager"` forces the browser to fetch the iframe content immediately upon page load. In a portfolio with many projects, this results in a high number of simultaneous network requests for content that may not even be visible on the initial screen. Changing this to `lazy` defers these requests until the user scrolls near the component.
2. **Reduced CPU & Memory Pressure:** Each iframe initializes its own browsing context, which consumes significant CPU and memory. Loading multiple iframes eagerly on mobile devices can lead to "jank" and slow down the main thread, degrading the user experience during initial interaction.
3. **Bandwidth Savings:** For users on metered connections (common for mobile), `lazy` loading ensures they only download the data for projects they actually view.

### Impact Measurement Note:
Direct benchmarking (e.g., using Lighthouse or Chrome DevTools Protocol) is currently impractical in this restricted environment due to network limitations and missing dependencies. However, switching to `loading="lazy"` for offscreen content is a well-established web performance best practice (supported by Chromium, WebKit, and Gecko) that directly addresses the "Eager loading of heavy iframes on mobile" issue.
