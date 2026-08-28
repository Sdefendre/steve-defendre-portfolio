import { aboutFacts } from "@/data/about";
import { primaryNavItems } from "@/data/navigation";
import {
  isProjectCategory,
  listPublicProjects,
  projectsFilterHref,
  filterProjectCatalog,
  projects,
} from "@/data/projects";
import { primaryContactEmail } from "@/data/socials";

export const portfolioToolNames = [
  "list-projects",
  "filter-projects",
  "navigate",
  "open-contact",
  "get-about",
] as const;

export type PortfolioToolName = (typeof portfolioToolNames)[number];

export const allowlistedPaths = ["/", "/about", "/projects", "/contact"] as const;
export type AllowlistedPath = (typeof allowlistedPaths)[number];

export interface PortfolioNavigate {
  (href: string): void;
}

export interface PortfolioToolDependencies {
  navigate: PortfolioNavigate;
}

export interface PortfolioTool {
  name: PortfolioToolName;
  title: string;
  description: string;
  inputSchema: object;
  execute: (input: object, options: { signal: AbortSignal }) => Promise<unknown>;
  annotations?: {
    readOnlyHint: boolean;
  };
}

export interface RegisterPortfolioToolsOptions {
  navigate: PortfolioNavigate;
  signal: AbortSignal;
}

const emptyInputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {},
} as const;

const filterProjectsInputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["category"],
  properties: {
    category: {
      type: "string",
      enum: ["Studio", "Client", "Product"],
      description: "Existing project category chips on /projects: Studio, Client, or Product.",
    },
  },
} as const;

const allowlistedPathValues = primaryNavItems.map((item) => item.href);

const navigateInputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["path"],
  properties: {
    path: {
      type: "string",
      enum: allowlistedPathValues,
      description: "Allowlisted portfolio path.",
    },
  },
} as const;

function throwIfAborted(signal: AbortSignal) {
  if (!signal.aborted) return;
  if (signal.reason !== undefined) throw signal.reason;
  throw new DOMException("Aborted", "AbortError");
}

function hasOwnKey(input: object, key: string) {
  return Object.prototype.hasOwnProperty.call(input, key);
}

function readRequiredString(input: object, key: string) {
  if (!hasOwnKey(input, key)) {
    throw new Error(`Missing ${key}.`);
  }

  const value = Reflect.get(input, key);
  if (typeof value !== "string") {
    throw new Error(`${key} must be a string.`);
  }

  return value;
}

function isAllowlistedPath(value: string): value is AllowlistedPath {
  for (const item of primaryNavItems) {
    if (item.href === value) return true;
  }
  return false;
}

export function getDocumentModelContext(): ModelContext | null {
  const fromDocument = typeof document === "undefined" ? undefined : document.modelContext;
  const fromNavigator = typeof navigator === "undefined" ? undefined : navigator.modelContext;
  const modelContext = fromDocument ?? fromNavigator;

  if (!modelContext || typeof modelContext.registerTool !== "function") {
    return null;
  }

  return modelContext;
}

export function createListProjectsTool(): PortfolioTool {
  return {
    name: "list-projects",
    title: "List projects",
    description:
      "Return the public project catalog from this portfolio: title, category, status, URL, and short description. Read-only.",
    inputSchema: emptyInputSchema,
    annotations: { readOnlyHint: true },
    async execute(_input, { signal }) {
      throwIfAborted(signal);
      return { projects: listPublicProjects(projects) };
    },
  };
}

export function createFilterProjectsTool({ navigate }: PortfolioToolDependencies): PortfolioTool {
  return {
    name: "filter-projects",
    title: "Filter projects",
    description:
      "Filter the same public catalog used by /projects, using the existing Studio / Client / Product chips, and open that filtered view.",
    inputSchema: filterProjectsInputSchema,
    async execute(input, { signal }) {
      throwIfAborted(signal);
      const category = readRequiredString(input, "category");
      if (!isProjectCategory(category)) {
        throw new Error("Unknown category. Use Studio, Client, or Product.");
      }

      const href = projectsFilterHref(category);
      const filtered = filterProjectCatalog(projects, category);
      navigate(href);
      return {
        category,
        href,
        projects: listPublicProjects(filtered),
      };
    },
  };
}

export function createNavigateTool({ navigate }: PortfolioToolDependencies): PortfolioTool {
  const paths = allowlistedPaths.join(", ");

  return {
    name: "navigate",
    title: "Navigate",
    description: `Open one allowlisted portfolio page: ${paths}.`,
    inputSchema: navigateInputSchema,
    async execute(input, { signal }) {
      throwIfAborted(signal);
      const path = readRequiredString(input, "path");
      if (!isAllowlistedPath(path)) {
        throw new Error("Path is not allowed. Use /, /about, /projects, or /contact.");
      }

      navigate(path);
      return { path };
    },
  };
}

export function createOpenContactTool({ navigate }: PortfolioToolDependencies): PortfolioTool {
  return {
    name: "open-contact",
    title: "Open contact",
    description:
      "Open /contact. Does not fill or send the mailto form. Returns the public studio email so a person can send the message.",
    inputSchema: emptyInputSchema,
    async execute(_input, { signal }) {
      throwIfAborted(signal);
      navigate("/contact");
      return {
        path: "/contact",
        email: primaryContactEmail,
        note: "A person still sends the message from their mail app. This tool does not fill or send the form.",
      };
    },
  };
}

export function createGetAboutTool(): PortfolioTool {
  return {
    name: "get-about",
    title: "Get about",
    description:
      "Return facts already published on /about. Does not invent biography or private details.",
    inputSchema: emptyInputSchema,
    annotations: { readOnlyHint: true },
    async execute(_input, { signal }) {
      throwIfAborted(signal);
      return aboutFacts;
    },
  };
}

export function createPortfolioTools(
  deps: PortfolioToolDependencies,
): Record<PortfolioToolName, PortfolioTool> {
  return {
    "list-projects": createListProjectsTool(),
    "filter-projects": createFilterProjectsTool(deps),
    navigate: createNavigateTool(deps),
    "open-contact": createOpenContactTool(deps),
    "get-about": createGetAboutTool(),
  };
}

export async function registerPortfolioTools({
  navigate,
  signal,
}: RegisterPortfolioToolsOptions) {
  const modelContext = getDocumentModelContext();
  if (!modelContext) return;

  throwIfAborted(signal);

  const tools = createPortfolioTools({ navigate });
  for (const name of portfolioToolNames) {
    await modelContext.registerTool(tools[name], { signal });
  }
}

