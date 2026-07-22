# Changelog

All notable user-visible changes to this portfolio are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Changed
- Updated the public contact email from the personal Gmail address to
  `steve@defendresolutions.com` across the contact page, copy-email button,
  and metadata. The studio address is now the single public contact point.
- Refreshed README to match the current stack, routes, content model, and
  contact email policy.

### Removed
- Deleted leftover assets from previously removed portfolio projects
  (`nayka-portfolio.png`, `project-previews/krystin-sylvia.svg`).
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
