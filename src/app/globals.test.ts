import { readFileSync } from "node:fs";

const css = readFileSync("src/app/globals.css", "utf8");

function section(start: string, end: string) {
  return css.slice(css.indexOf(start), css.indexOf(end));
}

describe("global spatial CSS contracts", () => {
  it("defines the shared shadow and spatial reveal/glow treatments", () => {
    expect(css).toMatch(/--shadow-warm:\s*rgba\(/);
    expect(css).toMatch(/\.spatial-reveal\s*\{[\s\S]*?animation:/);
    expect(css).toContain("@keyframes spatial-reveal");
    expect(css).toMatch(
      /\.spatial-glow\s*\{[\s\S]*?radial-gradient[\s\S]*?box-shadow:/,
    );
  });

  it("removes redesigned motion while keeping reveal content visible", () => {
    const reducedMotion = section(
      "@media (prefers-reduced-motion: reduce)",
      "@media (prefers-reduced-transparency: reduce)",
    );

    expect(reducedMotion).toContain("animation: none !important");
    expect(reducedMotion).toContain("transition: none !important");
    expect(reducedMotion).toMatch(
      /\.spatial-reveal\s*\{[\s\S]*?opacity:\s*1/,
    );
    expect(reducedMotion).toContain('[class*="group-hover:scale-"]');
    expect(reducedMotion).toContain("translate: none !important");
    expect(reducedMotion).toContain("scale: none !important");
  });

  it("makes nested Tailwind blur overlays opaque for reduced transparency", () => {
    const reducedTransparency = section(
      "@media (prefers-reduced-transparency: reduce)",
      "@supports not",
    );

    expect(reducedTransparency).toContain('[class*="backdrop-blur-"]');
    expect(reducedTransparency).toContain(
      "background: var(--surface-opaque) !important",
    );
    expect(reducedTransparency).toContain("backdrop-filter: none !important");
  });
});
