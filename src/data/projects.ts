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
    outcome: "The studio site now carries the offer, the work, and a place for clients to start.",
    category: "Studio", year: 2026, status: "Live",
    caseStudy: { challenge: "Small teams could not tell what the studio actually builds or whether it was a fit.", approach: "I wrote the site around custom apps, consulting, and how delivery works.", impact: "There is a public home for services and new client conversations." },
    tags: ["Next.js", "React", "TypeScript"], gradient: "from-slate-600 to-indigo-600", url: "https://defendresolutions.com", image: "/project-previews/defendre-solutions.jpg", ctaLabel: "Visit studio",
  },
  {
    initials: "FV", title: "FreeVoiceTranscribe",
    description: "Private, local hold-to-talk dictation for Apple Silicon Macs. Hold fn, speak, then release to insert. On-device Whisper, no cloud accounts, no always-on mic.",
    role: "Solo product engineer (Python / macOS)",
    outcome: "Open-sourced an MIT-licensed menu-bar dictation app with local inference, hands-free mode, tests, and packaging scripts.",
    category: "Product", year: 2026, status: "Live",
    caseStudy: { challenge: "Make fast dictation private and practical for Apple Silicon users without a cloud account or always-on microphone.", approach: "Paired a hold-to-talk workflow with on-device Whisper inference, tests, packaging, and a native menu-bar experience.", impact: "Released an MIT-licensed local dictation app that keeps speech processing on-device." },
    tags: ["Python", "Whisper", "macOS", "MLX"], gradient: "from-violet-500 to-purple-700", url: "https://github.com/Sdefendre/freevoicetranscribe", image: "/project-previews/freevoicetranscribe.jpg", ctaLabel: "View on GitHub",
  },
  {
    initials: "BR", title: "BraidsbyRose",
    description: "Marketing site and booking flow for a Fall River braiding studio. Services, gallery, policies, and appointment requests in one place.",
    role: "Full-stack web developer",
    outcome: "Replaced ad-hoc scheduling DMs with a live site clients can use to review styles and request bookings.",
    category: "Client", year: 2026, status: "Live",
    caseStudy: { challenge: "Clients had to ask about services and book through DMs.", approach: "I put services, policies, the gallery, and booking requests on one site.", impact: "Clients can pick a style and request an appointment without a back-and-forth in messages." },
    tags: ["Next.js", "React", "TypeScript"], gradient: "from-pink-500 to-rose-600", url: "https://braidsbyrose.com", image: "/project-previews/braidsbyrose.jpg", ctaLabel: "View booking site",
  },
  {
    initials: "TR", title: "Traces",
    description: "Local-first desktop knowledge workspace: markdown vault, 3D force graph of wiki-links, and multi-provider AI chat that can read and edit notes.",
    role: "Founder product and desktop engineer",
    outcome: "Built an Electron + Next.js app with CodeMirror editing, React Three Fiber graph views, and vault-aware AI tooling.",
    category: "Product", year: 2026, status: "Prototype",
    caseStudy: { challenge: "Keep a personal knowledge workspace on the machine, and still make note links easy to follow and edit.", approach: "I combined a markdown vault, a graph view, rich editing, and vault-aware AI tools in a desktop app.", impact: "The prototype lets you navigate and edit connected notes without sending the vault to a host." },
    tags: ["Electron", "Next.js", "R3F", "TypeScript"], gradient: "from-indigo-500 to-sky-600", url: "https://github.com/Sdefendre/traces-app", image: "/project-previews/traces.jpg", ctaLabel: "View on GitHub",
  },
  {
    initials: "KS", title: "Krystin Sylvia",
    description: "Professional portfolio for an RN / BSN case manager. Experience timeline, credentials, resume download, and contact paths.",
    role: "Frontend developer",
    outcome: "A live site for her clinical experience, credentials, resume, and contact paths.",
    category: "Client", year: 2026, status: "Live",
    caseStudy: { challenge: "She needed clinical experience, credentials, and leadership goals in one readable site.", approach: "I built the page around her timeline, qualifications, resume download, and contact links.", impact: "She has a live site for healthcare experience and next-step conversations." },
    tags: ["Next.js", "React", "TypeScript"], gradient: "from-teal-500 to-cyan-600", url: "https://krystinsylvia.com", image: "/project-previews/krystin-sylvia.jpg", ctaLabel: "View portfolio",
  },
  {
    initials: "VC", title: "Velocity Care LLC",
    description: "Healthcare practice web presence with services overview, provider bio, and contact paths for patients evaluating care.",
    role: "Website architecture and frontend delivery",
    outcome: "Patients can read about care options and get in touch on a live site.",
    category: "Client", year: 2026, status: "Live",
    caseStudy: { challenge: "Prospective patients needed a fast way to understand the practice, its services, and how to seek care.", approach: "I structured the site around services, the provider, and how to contact the practice.", impact: "Patients can evaluate care and reach the practice without calling first." },
    tags: ["Next.js", "Tailwind CSS", "Vercel"], gradient: "from-blue-500 to-cyan-600", url: "https://velocitycarellc.com", image: "/project-previews/velocity-care.jpg", ctaLabel: "Visit healthcare site",
  },
  {
    initials: "CA", title: "Command.AI",
    description: "Veteran-focused product for claim prep, benefits education, and financial readiness. Mission-style planning instead of scattered checklists.",
    role: "Founder and full-stack product engineer",
    outcome: "Shipped a live web app with auth, structured learning paths, and ongoing product iteration for service members in transition.",
    category: "Product", year: 2026, status: "Live",
    caseStudy: { challenge: "Claims, benefits, and money prep for service members lived in scattered checklists.", approach: "I built an authenticated product with learning paths and mission-style next steps.", impact: "Service members can work a live plan instead of hunting through disconnected lists." },
    tags: ["Next.js", "TypeScript", "Convex"], gradient: "from-emerald-500 to-teal-600", url: "https://trycommand.vercel.app", image: "/project-previews/command-ai.jpg", ctaLabel: "Open platform",
  },
];
