import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import AnimatedBackground from "../AnimatedBackground";

describe("AnimatedBackground", () => {
  it("renders the ambient spatial environment", () => {
    render(<AnimatedBackground />);

    const backdrop = screen.getByTestId("animated-background");
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
    expect(backdrop).toHaveClass("spatial-environment");
    expect(backdrop.className).toContain("bg-[var(--background)]");
    expect(backdrop.querySelectorAll(".spatial-orb")).toHaveLength(3);
    expect(backdrop.querySelector(".spatial-horizon")).toBeInTheDocument();
  });

  it("can render on the server without window access", () => {
    expect(renderToString(<AnimatedBackground />)).toContain(
      "animated-background"
    );
  });
});
