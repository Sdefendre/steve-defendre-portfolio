// Shared by the Node static renderer and Next metadata routes. Keep defaults
// here so a build without deployment variables still has a public canonical.
const defaultSiteUrl = "https://steve-defendre-portfolio.vercel.app/";

/** @param {string | undefined} value */
function normalizeSiteUrl(value) {
  const trimmed = value?.trim();
  if (!trimmed || /[\s\\]/.test(trimmed)) return null;

  const base = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed.replace(/^\/\//, "")}`;
  try {
    const url = new URL(base);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return null;
    return new URL("/", url);
  } catch {
    return null;
  }
}

/**
 * Ignore blank/invalid candidates, prefer the public override and production
 * domain to a preview deployment, and strip paths, queries, and fragments.
 * @param {{ NEXT_PUBLIC_SITE_URL?: string, VERCEL_PROJECT_PRODUCTION_URL?: string, VERCEL_URL?: string }} [environment]
 */
export function resolveSiteUrl(environment = process.env) {
  return normalizeSiteUrl(environment.NEXT_PUBLIC_SITE_URL)
    ?? normalizeSiteUrl(environment.VERCEL_PROJECT_PRODUCTION_URL)
    ?? normalizeSiteUrl(environment.VERCEL_URL)
    ?? new URL(defaultSiteUrl);
}
