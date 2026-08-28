import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const layoutSource = readFileSync("src/app/layout.tsx", "utf8");

describe("root layout WebMCP registrar", () => {
  it("mounts the client registrar so page-level tools wrap existing routes", () => {
    expect(layoutSource).toContain('import { WebMcpRegistrar } from "@/components/WebMcpRegistrar"');
    expect(layoutSource).toContain("<WebMcpRegistrar />");
  });
});
