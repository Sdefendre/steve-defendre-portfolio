export interface AboutProofPoint {
  label: string;
  value: string;
}

export type AboutPrincipleTitle =
  | "Start with the outcome"
  | "Ship the next usable version"
  | "Own it after launch";

export interface AboutPrinciple {
  title: AboutPrincipleTitle;
  description: string;
}

export interface AboutCapability {
  name: string;
  description: string;
  skills: readonly string[];
}

export interface AboutFacts {
  name: string;
  headline: string;
  summary: string;
  studioName: string;
  studioUrl: string;
  proofPoints: readonly AboutProofPoint[];
  principles: readonly AboutPrinciple[];
  capabilities: readonly AboutCapability[];
}

// Facts already shown on /about. get-about must not invent biography.
export const aboutFacts: AboutFacts = {
  name: "Steve Defendre",
  headline: "Veteran, CS graduate, product engineer",
  summary:
    "I'm Steve Defendre, a military veteran, CS graduate, and founder of Defendre Solutions. I build for founders and small businesses that need someone who can take a messy request and ship a product they can use.",
  studioName: "Defendre Solutions",
  studioUrl: "https://defendresolutions.com",
  proofPoints: [
    {
      label: "Studio",
      value: "Founder of Defendre Solutions",
    },
    {
      label: "What I ship",
      value: "Client sites, local AI tools, desktop apps, and agent workflows",
    },
    {
      label: "Stack",
      value: "Next.js, React, TypeScript, Python, Electron, PostgreSQL, AWS",
    },
  ],
  principles: [
    {
      title: "Start with the outcome",
      description:
        "I begin with the job the software has to do, who uses it, and which decision it should make easier.",
    },
    {
      title: "Ship the next usable version",
      description:
        "I still work the way I did in the service. Name the objective, cut the fog, ship something you can use, then improve it.",
    },
    {
      title: "Own it after launch",
      description:
        "As the founder of Defendre Solutions, I stay with operations, maintenance, and whether the thing still fits the business next quarter.",
    },
  ],
  capabilities: [
    {
      name: "Interface",
      description: "React and Next.js UIs where the next click is obvious.",
      skills: ["React", "Next.js", "Tailwind CSS"],
    },
    {
      name: "Systems",
      description: "TypeScript backends and APIs that match how the work runs.",
      skills: ["TypeScript", "Node.js", "REST APIs", "GraphQL"],
    },
    {
      name: "Delivery",
      description: "Git, Docker, and AWS so a release still ships after the first launch.",
      skills: ["Git", "Docker", "AWS"],
    },
    {
      name: "Infrastructure",
      description: "PostgreSQL and Python when the data and jobs have to last.",
      skills: ["PostgreSQL", "Python"],
    },
  ],
};
