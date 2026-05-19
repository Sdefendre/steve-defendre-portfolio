/**
 * Validates if a URL or href is safe to use in an anchor tag.
 * Allows http, https, mailto, and tel protocols, as well as relative paths and anchors.
 */
export function isSafeHref(href: string | undefined | null): boolean {
  if (!href) return false;

  const trimmed = href.trim();

  // Allow relative paths and anchors
  if ((trimmed.startsWith("/") && !trimmed.startsWith("//")) || trimmed.startsWith("#")) {
    return true;
  }

  // Allow specific safe protocols
  const safeProtocolRegex = /^(https?|mailto|tel):/i;
  return safeProtocolRegex.test(trimmed);
}
