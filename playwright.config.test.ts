import { describe, expect, it } from "vitest";

import {
  browserProjectNames,
  getLocalPlaywrightHost,
} from "./playwright.config.helpers";

describe("getLocalPlaywrightHost", () => {
  it.each([
    ["http://localhost:3100", "localhost"],
    ["http://127.0.0.1:3100", "127.0.0.1"],
    ["http://[::1]:3100", "::1"],
    ["https://portfolio.example.com", undefined],
  ])("classifies %s", (baseURL, expectedHost) => {
    expect(getLocalPlaywrightHost(baseURL)).toBe(expectedHost);
  });
});

describe("browserProjectNames", () => {
  it("keeps focused accessibility coverage on all supported engines", () => {
    expect(browserProjectNames).toEqual(["chromium", "firefox", "webkit"]);
  });
});
