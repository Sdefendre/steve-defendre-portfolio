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
