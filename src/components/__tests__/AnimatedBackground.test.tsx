import { render, screen, act } from "@testing-library/react";
import AnimatedBackground from "../AnimatedBackground";

vi.mock("../ThreeScene", () => ({
  default: () => <div data-testid="three-scene">Three Scene</div>,
}));

describe("AnimatedBackground", () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  const setWidth = (width: number) => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: width,
    });
    window.dispatchEvent(new Event("resize"));
  };

  it("renders mobile fallback when width is less than 1024", () => {
    setWidth(375);

    render(<AnimatedBackground />);

    expect(screen.queryByTestId("three-scene")).not.toBeInTheDocument();
    expect(document.querySelector(".bg-gray-50")).toBeInTheDocument();
  });

  it("renders ThreeScene when width is 1024 or greater", async () => {
    setWidth(1200);

    render(<AnimatedBackground />);

    expect(await screen.findByTestId("three-scene")).toBeInTheDocument();
  });

  it("responds to window resize events", async () => {
    setWidth(375);

    render(<AnimatedBackground />);
    expect(screen.queryByTestId("three-scene")).not.toBeInTheDocument();

    await act(async () => {
      setWidth(1200);
    });
    expect(await screen.findByTestId("three-scene")).toBeInTheDocument();

    await act(async () => {
      setWidth(800);
    });
    expect(screen.queryByTestId("three-scene")).not.toBeInTheDocument();
  });

  it("cleans up resize event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<AnimatedBackground />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function)
    );
  });
});
