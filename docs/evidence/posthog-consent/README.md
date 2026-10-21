# PostHog consent bar evidence

Homepage at 1280x800, Playwright Chromium, `deviceScaleFactor: 1`.

| File | What it shows |
| --- | --- |
| `before.png` | Current `main` homepage, no consent bar |
| `after.png` | This branch, bar visible, desktop dock still clickable |

Captured from local `next start` after `npm run build`. `/` is the committed static homepage.
