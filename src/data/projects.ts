export const projectCategories = ["Studio", "Client", "Product"] as const;

export type ProjectCategory = (typeof projectCategories)[number];
export type ProjectStatus = "Live" | "Prototype";

export interface Project {
  initials: string;
  title: string;
  description: string;
  role: string;
  outcome: string;
  category: ProjectCategory;
  year: number;
  status: ProjectStatus;
  caseStudy: { challenge: string; approach: string; impact: string };
  tags: string[];
  gradient: string;
  url: string;
  image?: string;
  priority?: boolean;
  ctaLabel?: string;
}

export const projects: Project[] = [
  {
    initials: "DS", title: "Defendre Solutions",
    description: "A veteran-owned software studio for small teams that need custom web apps, practical consulting, and production discipline without agency drag.",
    role: "Founder, product strategist, and full-stack engineer",
    outcome: "Established the studio brand, service positioning, and delivery home base for client software work.",
    category: "Studio", year: 2026, status: "Live",
    caseStudy: { challenge: "Present a broad software practice with enough clarity for small teams to understand where the studio fits.", approach: "Built a focused studio narrative around custom applications, practical consulting, and disciplined delivery.", impact: "Created a clear, public home for the studio's positioning, services, and client conversations." },
    tags: ["Next.js", "React", "TypeScript"], gradient: "from-slate-600 to-indigo-600", url: "https://defendresolutions.com", image: "/project-previews/defendre-solutions.jpg", ctaLabel: "Visit studio",
  },
  {
    initials: "FV", title: "FreeVoiceTranscribe",
    description: "Private, local hold-to-talk dictation for Apple Silicon Macs. Hold fn, speak, release to insert — on-device Whisper, no cloud accounts, no always-on mic.",
    role: "Solo product engineer (Python / macOS)",
    outcome: "Open-sourced an MIT-licensed menu-bar dictation app with local inference, hands-free mode, tests, and packaging scripts.",
    category: "Product", year: 2026, status: "Live",
    caseStudy: { challenge: "Make fast dictation private and practical for Apple Silicon users without a cloud account or always-on microphone.", approach: "Paired a hold-to-talk workflow with on-device Whisper inference, tests, packaging, and a native menu-bar experience.", impact: "Released an MIT-licensed local dictation app that keeps speech processing on-device." },
    tags: ["Python", "Whisper", "macOS", "MLX"], gradient: "from-violet-500 to-purple-700", url: "https://github.com/Sdefendre/freevoicetranscribe", image: "/project-previews/freevoicetranscribe.jpg", ctaLabel: "View on GitHub",
  },
  {
    initials: "BR", title: "BraidsbyRose",
    description: "Marketing site and booking flow for a Fall River braiding studio — services, gallery, policies, and appointment requests in one place.",
    role: "Full-stack web developer",
    outcome: "Replaced ad-hoc scheduling DMs with a live site clients can use to review styles and request bookings.",
    category: "Client", year: 2026, status: "Live",
    caseStudy: { challenge: "Make services easier to understand and reduce the friction of coordinating appointments manually.", approach: "Organized the experience around service discovery, policies, gallery context, and a direct booking workflow.", impact: "Gave clients a clearer route from choosing a service to requesting an appointment." },
    tags: ["Next.js", "React", "TypeScript"], gradient: "from-pink-500 to-rose-600", url: "https://braidsbyrose.com", image: "/project-previews/braidsbyrose.jpg", ctaLabel: "View booking site",
  },
  {
    initials: "TR", title: "Traces",
    description: "Local-first desktop knowledge workspace: markdown vault, 3D force graph of wiki-links, and multi-provider AI chat that can read and edit notes.",
    role: "Founder product and desktop engineer",
    outcome: "Built an Electron + Next.js app with CodeMirror editing, React Three Fiber graph views, and vault-aware AI tooling.",
    category: "Product", year: 2026, status: "Prototype",
    caseStudy: { challenge: "Keep a personal knowledge workspace local while making connections between notes easier to explore and work with.", approach: "Combined a markdown vault, graph visualization, rich editing, and vault-aware AI tools in a desktop application.", impact: "Produced a working local-first prototype for navigating and editing connected knowledge." },
    tags: ["Electron", "Next.js", "R3F", "TypeScript"], gradient: "from-indigo-500 to-sky-600", url: "https://github.com/Sdefendre/traces-app", image: "/project-previews/traces.jpg", ctaLabel: "View on GitHub",
  },
  {
    initials: "KS", title: "Krystin Sylvia",
    description: "Professional portfolio for an RN / BSN case manager — experience timeline, credentials, resume download, and contact paths.",
    role: "Frontend developer",
    outcome: "Delivered a clean personal brand site focused on clinical experience and healthcare leadership goals.",
    category: "Client", year: 2026, status: "Live",
    caseStudy: { challenge: "Bring clinical experience, credentials, and healthcare leadership goals into a concise professional story.", approach: "Structured a readable portfolio around the experience timeline, qualifications, resume access, and direct contact paths.", impact: "Delivered a calm live destination for presenting healthcare experience and professional direction." },
    tags: ["Next.js", "React", "TypeScript"], gradient: "from-teal-500 to-cyan-600", url: "https://krystinsylvia.com", image: "/project-previews/krystin-sylvia.jpg", ctaLabel: "View portfolio",
  },
  {
    initials: "VC", title: "Velocity Care LLC",
    description: "Healthcare practice web presence with services overview, provider bio, and contact paths for patients evaluating care.",
    role: "Website architecture and frontend delivery",
    outcome: "Gave the practice a polished public site patients can use to learn about care options and get in touch.",
    category: "Client", year: 2026, status: "Live",
    caseStudy: { challenge: "Help prospective patients quickly understand the practice, its services, and how to seek care.", approach: "Structured the site around readable service information, accessible navigation, provider context, and direct contact guidance.", impact: "Established a professional live presence that supports patients as they evaluate care options." },
    tags: ["Next.js", "Tailwind CSS", "Vercel"], gradient: "from-blue-500 to-cyan-600", url: "https://velocitycarellc.com", image: "/project-previews/velocity-care.jpg", ctaLabel: "Visit healthcare site",
  },
  {
    initials: "CA", title: "Command.AI",
    description: "Veteran-focused product for claim prep, benefits education, and financial readiness — mission-style planning instead of scattered checklists.",
    role: "Founder and full-stack product engineer",
    outcome: "Shipped a live web app with auth, structured learning paths, and ongoing product iteration for service members in transition.",
    category: "Product", year: 2026, status: "Live",
    caseStudy: { challenge: "Give service members a more coherent way to approach claims, benefits education, and financial readiness.", approach: "Built an authenticated product with structured learning paths and mission-style next steps instead of scattered checklists.", impact: "Shipped a live platform that continues to support service members through transition planning." },
    tags: ["Next.js", "TypeScript", "Convex"], gradient: "from-emerald-500 to-teal-600", url: "https://trycommand.vercel.app", image: "/project-previews/command-ai.jpg", ctaLabel: "Open platform",
  },
];
