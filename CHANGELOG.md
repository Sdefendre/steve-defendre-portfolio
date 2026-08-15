# Changelog

All notable user-visible changes to this portfolio are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Fixed
- Contact inquiry actions now stack on phones so “Copy email” stays on one line.
- Invalid contact-form fields now get a visible error border to match the
  “highlighted fields” status message.

### Added
- Portfolio projects for FreeVoiceTranscribe and Traces, with matching SVG
  previews under `public/project-previews/`.

### Changed
- Reorganized the `/projects` archive into a clean equal-height two-column
  grid with numbered rows, replacing the staggered constellation layout.
- Replaced stylized SVG project previews and older root PNGs with fresh
  1440×900 JPEG live captures under `public/project-previews/` for every
  project card (FreeVoice uses the product marketing page; Traces uses the
  public GitHub repo page when no hosted demo exists).
- Tightened project copy after a public readiness audit (accurate roles,
  outcomes, and stack tags; Social Media Manager Agent held back until the
  live demo is not key-gated).
- Refreshed BraidsbyRose, Krystin Sylvia, Velocity Care, and Command.AI blurbs
  so they match what the public sites actually show.
- Updated the public contact email from the personal Gmail address to
  `steve@defendresolutions.com` across the contact page, copy-email button,
  and metadata. The studio address is now the single public contact point.
- Refreshed README to match the current stack, routes, content model, and
  contact email policy.
- About page delivery-range and core-stack copy now reflect local AI, desktop,
  and agent work alongside client delivery.

### Removed
- Deleted leftover assets from previously removed portfolio projects
  (`nayka-portfolio.png`, `project-previews/krystin-sylvia.svg`).
- Removed obsolete root project PNGs and SVG mock previews superseded by
  live JPEG captures.
- Deleted the merged `codex/visionos-portfolio-redesign` remote branch.

## [2026-07-15]

### Added
- VisionOS-inspired spatial redesign (PR #73): layered translucent surfaces,
  atmospheric depth and lighting, floating desktop navigation and a mobile dock,
  cinematic page composition, richer project cards, a branded spatial 404,
  a copy-email interaction, `robots.txt` and `sitemap.xml` routes, refreshed
  metadata, and updated security proxy behavior.
- Accessibility and hardening: `aria-current` on active navigation, announced
  contact copy feedback, visible focus states, motion/transparency preference
  support, safe external URL handling, and responsive layout across desktop,
  tablet, and mobile.

### Fixed
- Three.js lifecycle cleanup now captures the initialized scene before returning
  effect cleanup and cleans partial initialization against that scene; added a
  regression test for a replaced ref. Removed a remaining lint warning and applied
  safe Vitest/PostCSS dependency remediation.

## [2026-07-14]

### Changed
- Removed two portfolio projects to keep the showcased work current (PR #72).

## [2026-06-02]

### Security
- Hardened the Content Security Policy with per-request nonces (PR #71), replacing
  the previously insecure CSP configuration.
