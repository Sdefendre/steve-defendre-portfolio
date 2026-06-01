import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // We keep 'unsafe-inline' for styles as Next.js and Tailwind CSS v4
  // often require it for style injection, and noncing all styles
  // is complex. However, we've secured scripts by removing
  // 'unsafe-inline' and 'unsafe-eval' (except in development).
  const cspHeader = `
    default-src 'self';
    script-src 'nonce-${nonce}' 'strict-dynamic' 'self' ${
      process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""
    };
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: api.microlink.io;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
