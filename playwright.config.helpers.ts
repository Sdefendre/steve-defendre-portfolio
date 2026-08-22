const localHosts = new Set(["127.0.0.1", "localhost", "::1"]);

export function getLocalPlaywrightHost(baseURL: string): string | undefined {
  // URL.hostname preserves brackets for IPv6 literals in Node.js.
  const hostname = new URL(baseURL).hostname.replace(/^\[|\]$/g, "");

  return localHosts.has(hostname) ? hostname : undefined;
}
