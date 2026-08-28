import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WebMcpRegistrar } from "../WebMcpRegistrar";

const registerPortfolioTools = vi.hoisted(() => vi.fn());
const push = vi.hoisted(() => vi.fn());

vi.mock("@/lib/webmcp", () => ({
  registerPortfolioTools,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

describe("WebMcpRegistrar", () => {
  afterEach(() => {
    registerPortfolioTools.mockReset();
    push.mockReset();
  });

  it("registers tools with the router and aborts on unmount", async () => {
    registerPortfolioTools.mockResolvedValue(undefined);

    const view = render(<WebMcpRegistrar />);

    expect(registerPortfolioTools).toHaveBeenCalledTimes(1);
    const options = registerPortfolioTools.mock.calls[0]?.[0] as {
      navigate: (href: string) => void;
      signal: AbortSignal;
    };

    expect(options.signal.aborted).toBe(false);
    options.navigate("/projects?category=Product");
    expect(push).toHaveBeenCalledWith("/projects?category=Product");

    view.unmount();
    expect(options.signal.aborted).toBe(true);
  });
});
