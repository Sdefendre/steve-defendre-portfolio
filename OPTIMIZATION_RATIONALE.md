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
The profile headshot `Image` components in `src/components/Sidebar.tsx`, `src/app/page.tsx`, and `src/app/about/page.tsx` use `priority` because they can render in the initial viewport.

## Rationale
Next.js image components are lazy-loaded by default. Prioritizing these visible profile images lets Next.js preload them earlier and avoids delaying the initial visual presentation.

### Measurement note
This is a standard Next.js LCP optimization for above-the-fold images. No benchmark data is recorded in this repo.
