# Performance Optimization Rationale: Lazy Loading Project Iframes

## Optimization
`CachedIframe` in `src/components/ProjectCard.tsx` uses `loading="lazy"` for project preview iframes.

## Rationale
`ProjectCard` is rendered in project lists and may include multiple external iframes.

### Why this helps
1. Defers offscreen iframe network requests until closer to viewport.
2. Reduces initial CPU and memory cost from multiple browsing contexts.
3. Avoids downloading previews users never scroll to.

### Measurement note
No benchmark data is recorded in this repo; this rationale is based on expected browser behavior for native lazy-loaded iframes.

## Optimization: Cached Window Dimensions in ThreeScene
`ThreeScene` in `src/components/ThreeScene.tsx` now caches `window.innerWidth` and `window.innerHeight`.

## Rationale
The `mousemove` event handler was previously reading window dimensions directly from the `window` object on every event.

### Why this helps
1. **Prevents Layout Thrashing**: Accessing properties like `innerWidth` and `innerHeight` can force the browser to recalculate the layout (reflow) if there are pending style changes. Doing this on every mouse move (potentially 60+ times per second) is inefficient.
2. **Improved Performance**: Using cached local variables in the frequently-called `mousemove` handler reduces overhead and ensures smoother animations.

### Measurement note
Verified via `src/components/__tests__/ThreeScenePerformance.test.tsx` that `window` dimension properties are no longer accessed during `mousemove` events after the initial mount and are only updated on `resize`.

## Optimization: Priority Loading for Above-the-Fold Images
The `priority` prop has been added to the profile headshot `Image` components in `src/components/Sidebar.tsx`, `src/app/page.tsx`, and `src/app/about/page.tsx`.

## Rationale
Next.js `Image` components are lazy-loaded by default. For images that are visible "above-the-fold" (visible in the initial viewport on page load), this lazy-loading can delay the Largest Contentful Paint (LCP).

### Why this helps
1. **Improved LCP**: Adding `priority={true}` tells Next.js to prioritize loading these images, often by adding a `<link rel="preload">` tag to the document head.
2. **Reduced Layout Shift**: Prioritizing these images helps ensure they are loaded and rendered as early as possible, contributing to a better user experience and better Core Web Vitals scores.

### Measurement note
This is a standard Next.js performance optimization. While not directly benchmarked in this environment, it is a documented best practice for improving LCP by ensuring critical images are not deferred.
