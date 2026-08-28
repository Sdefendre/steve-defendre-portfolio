import { afterEach, describe, expect, it, vi } from "vitest";
import { aboutFacts } from "@/data/about";
import { primaryNavItems } from "@/data/navigation";
import { primaryContactEmail } from "@/data/socials";
import { projectCategories, projects } from "@/data/projects";
import {
  allowlistedPaths,
  createPortfolioTools,
  getDocumentModelContext,
  portfolioToolNames,
  registerPortfolioTools,
} from "./webmcp";

const TOOL_NAME_PATTERN = /^[A-Za-z0-9_.-]{1,128}$/;

interface RegisteredTool {
  name: string;
  title?: string;
  description: string;
  inputSchema?: object;
  execute: (input: object, options: { signal: AbortSignal }) => Promise<unknown>;
  annotations?: { readOnlyHint?: boolean };
}

function createMockModelContext() {
  const tools = new Map<string, RegisteredTool>();

  const modelContext = {
    registerTool: vi.fn(async (tool: RegisteredTool, options?: { signal?: AbortSignal }) => {
      if (options?.signal?.aborted) {
        throw options.signal.reason ?? new DOMException("Aborted", "AbortError");
      }

      tools.set(tool.name, tool);

      options?.signal?.addEventListener("abort", () => {
        tools.delete(tool.name);
      });
    }),
  };

  return { modelContext, tools };
}

function toolNames(tools: Map<string, RegisteredTool>) {
  return [...tools.keys()].sort();
}

afterEach(() => {
  Reflect.deleteProperty(document, "modelContext");
  Reflect.deleteProperty(navigator, "modelContext");
});

describe("portfolio tool names and paths", () => {
  it("keeps navigate allowlisted to the existing primary nav", () => {
    expect([...allowlistedPaths]).toEqual(primaryNavItems.map((item) => item.href));
  });
});

describe("getDocumentModelContext", () => {
  it("returns null when no modelContext exists", () => {
    expect(getDocumentModelContext()).toBeNull();
  });

  it("uses document.modelContext when registerTool is present", () => {
    const { modelContext } = createMockModelContext();
    Object.defineProperty(document, "modelContext", {
      configurable: true,
      value: modelContext,
    });

    expect(getDocumentModelContext()).toBe(modelContext);
  });

  it("falls back to navigator.modelContext when document has none", () => {
    const { modelContext } = createMockModelContext();
    Object.defineProperty(navigator, "modelContext", {
      configurable: true,
      value: modelContext,
    });

    expect(getDocumentModelContext()).toBe(modelContext);
  });

  it("returns null when modelContext has no registerTool", () => {
    Object.defineProperty(document, "modelContext", {
      configurable: true,
      value: {},
    });

    expect(getDocumentModelContext()).toBeNull();
  });
});

describe("registerPortfolioTools", () => {
  it("registers the page-level portfolio tools with names and schemas", async () => {
    const { modelContext, tools } = createMockModelContext();
    Object.defineProperty(document, "modelContext", {
      configurable: true,
      value: modelContext,
    });

    await registerPortfolioTools({
      navigate: vi.fn(),
      signal: new AbortController().signal,
    });

    expect(toolNames(tools)).toEqual([...portfolioToolNames].sort());
    expect(modelContext.registerTool).toHaveBeenCalledTimes(portfolioToolNames.length);

    for (const tool of tools.values()) {
      expect(tool.name).toMatch(TOOL_NAME_PATTERN);
      expect(tool.description.trim().length).toBeGreaterThan(0);
      expect(tool.inputSchema).toEqual(expect.any(Object));
    }

    expect(tools.get("list-projects")?.inputSchema).toEqual({
      type: "object",
      additionalProperties: false,
      properties: {},
    });
    expect(tools.get("filter-projects")?.inputSchema).toEqual({
      type: "object",
      additionalProperties: false,
      required: ["category"],
      properties: {
        category: {
          type: "string",
          enum: [...projectCategories],
          description: "Existing project category chips on /projects: Studio, Client, or Product.",
        },
      },
    });
    expect(tools.get("navigate")?.inputSchema).toEqual({
      type: "object",
      additionalProperties: false,
      required: ["path"],
      properties: {
        path: {
          type: "string",
          enum: ["/", "/about", "/projects", "/contact"],
          description: "Allowlisted portfolio path.",
        },
      },
    });
    expect(tools.get("list-projects")?.annotations?.readOnlyHint).toBe(true);
    expect(tools.get("get-about")?.annotations?.readOnlyHint).toBe(true);
    expect(tools.get("navigate")?.inputSchema).toMatchObject({
      properties: {
        path: {
          enum: ["/", "/about", "/projects", "/contact"],
        },
      },
    });
  });

  it("unregisters tools when the registration signal aborts", async () => {
    const { modelContext, tools } = createMockModelContext();
    Object.defineProperty(document, "modelContext", {
      configurable: true,
      value: modelContext,
    });
    const controller = new AbortController();

    await registerPortfolioTools({
      navigate: vi.fn(),
      signal: controller.signal,
    });

    expect(tools.size).toBe(portfolioToolNames.length);

    controller.abort();

    expect(tools.size).toBe(0);
  });

  it("does nothing when WebMCP is not available", async () => {
    await expect(
      registerPortfolioTools({
        navigate: vi.fn(),
        signal: new AbortController().signal,
      }),
    ).resolves.toBeUndefined();
  });
});

describe("portfolio tool execute", () => {
  it("list-projects returns the public catalog from projects.ts", async () => {
    const navigate = vi.fn();
    const tools = createPortfolioTools({ navigate });
    const result = await tools["list-projects"].execute({}, { signal: new AbortController().signal });

    expect(result).toEqual({
      projects: projects.map((project) => ({
        title: project.title,
        category: project.category,
        status: project.status,
        url: project.url,
        description: project.description,
      })),
    });
    expect(JSON.stringify(result)).not.toMatch(/github\.com\/Sdefendre\/Wealthwise/i);
    expect(JSON.stringify(result)).toContain("https://sdefendre.github.io/Wealthwise/");
    expect(JSON.stringify(result)).toMatch(/No Plaid/);
    expect(JSON.stringify(result)).toMatch(/No live bank login/);
    expect(JSON.stringify(result)).not.toMatch(/Plaid connects/i);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("filter-projects filters the same catalog and navigates to the matching chip", async () => {
    const navigate = vi.fn();
    const tools = createPortfolioTools({ navigate });
    const result = await tools["filter-projects"].execute(
      { category: "Product" },
      { signal: new AbortController().signal },
    );

    expect(result).toEqual({
      category: "Product",
      href: "/projects?category=Product",
      projects: projects
        .filter((project) => project.category === "Product")
        .map((project) => ({
          title: project.title,
          category: project.category,
          status: project.status,
          url: project.url,
          description: project.description,
        })),
    });
    expect((result as { projects: Array<{ title: string }> }).projects.map((project) => project.title)).toEqual([
      "FreeVoiceTranscribe",
      "Traces",
      "WealthWise",
      "Command.AI",
    ]);
    expect(navigate).toHaveBeenCalledWith("/projects?category=Product");
  });

  it("filter-projects rejects a category that is not on the chips", async () => {
    const navigate = vi.fn();
    const tools = createPortfolioTools({ navigate });

    await expect(
      tools["filter-projects"].execute(
        { category: "Booking" },
        { signal: new AbortController().signal },
      ),
    ).rejects.toThrow(/Studio, Client, or Product/);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("navigate only allows the public portfolio paths", async () => {
    const navigate = vi.fn();
    const tools = createPortfolioTools({ navigate });
    const result = await tools.navigate.execute(
      { path: "/about" },
      { signal: new AbortController().signal },
    );

    expect(result).toEqual({ path: "/about" });
    expect(navigate).toHaveBeenCalledWith("/about");

    await expect(
      tools.navigate.execute({ path: "/admin" }, { signal: new AbortController().signal }),
    ).rejects.toThrow(/\/, \/about, \/projects, or \/contact/);
  });

  it("open-contact goes to /contact and leaves sending to a person", async () => {
    const navigate = vi.fn();
    const tools = createPortfolioTools({ navigate });
    const result = await tools["open-contact"].execute({}, { signal: new AbortController().signal });

    expect(result).toEqual({
      path: "/contact",
      email: primaryContactEmail,
      note: "A person still sends the message from their mail app. This tool does not fill or send the form.",
    });
    expect(navigate).toHaveBeenCalledWith("/contact");
    expect(JSON.stringify(result)).not.toMatch(/sent|booking/i);
  });

  it("get-about returns facts already published on /about", async () => {
    const navigate = vi.fn();
    const tools = createPortfolioTools({ navigate });
    const result = await tools["get-about"].execute({}, { signal: new AbortController().signal });

    expect(result).toEqual(aboutFacts);
    expect(JSON.stringify(result)).toContain("military veteran");
    expect(JSON.stringify(result)).toContain("Founder of Defendre Solutions");
    expect(JSON.stringify(result)).not.toMatch(/invented|secret clearance|Plaid/i);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("stops an execute when the tool signal is already aborted", async () => {
    const navigate = vi.fn();
    const tools = createPortfolioTools({ navigate });
    const controller = new AbortController();
    controller.abort();

    await expect(
      tools["list-projects"].execute({}, { signal: controller.signal }),
    ).rejects.toMatchObject({ name: "AbortError" });
    expect(navigate).not.toHaveBeenCalled();
  });
});
