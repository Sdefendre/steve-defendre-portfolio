export interface Project {
  initials: string;
  title: string;
  description: string;
  role: string;
  outcome: string;
  tags: string[];
  gradient: string;
  url: string;
  image?: string;
  priority?: boolean;
  ctaLabel?: string;
}

export const projects: Project[] = [
  {
    initials: "DS",
    title: "Defendre Solutions",
    description:
      "A veteran-owned software studio for small teams that need custom web apps, practical consulting, and production discipline without agency drag.",
    role: "Founder, product strategist, and full-stack engineer",
    outcome:
      "Established the studio brand, service positioning, and delivery home base for client software work.",
    tags: ["Next.js", "React", "TypeScript"],
    gradient: "from-slate-600 to-indigo-600",
    url: "https://defendresolutions.com",
    image: "/defendre-solutions.png",
    priority: true,
    ctaLabel: "Visit studio",
  },
  {
    initials: "FV",
    title: "FreeVoiceTranscribe",
    description:
      "Private, local hold-to-talk dictation for Apple Silicon Macs. Hold fn, speak, release to insert — on-device Whisper, no cloud accounts, no always-on mic.",
    role: "Solo product engineer (Python / macOS)",
    outcome:
      "Open-sourced an MIT-licensed menu-bar dictation app with local inference, hands-free mode, tests, and packaging scripts.",
    tags: ["Python", "Whisper", "macOS", "MLX"],
    gradient: "from-violet-500 to-purple-700",
    url: "https://github.com/Sdefendre/freevoicetranscribe",
    image: "/project-previews/freevoicetranscribe.svg",
    ctaLabel: "View on GitHub",
  },
  {
    initials: "BR",
    title: "BraidsbyRose",
    description:
      "Marketing site and booking flow for a Fall River braiding studio — services, gallery, policies, and appointment requests in one place.",
    role: "Full-stack web developer",
    outcome:
      "Replaced ad-hoc scheduling DMs with a live site clients can use to review styles and request bookings.",
    tags: ["Next.js", "React", "TypeScript"],
    gradient: "from-pink-500 to-rose-600",
    url: "https://braidsbyrose.com",
    image: "/project-previews/braidsbyrose.svg",
    ctaLabel: "View booking site",
  },
  {
    initials: "TR",
    title: "Traces",
    description:
      "Local-first desktop knowledge workspace: markdown vault, 3D force graph of wiki-links, and multi-provider AI chat that can read and edit notes.",
    role: "Founder product and desktop engineer",
    outcome:
      "Built an Electron + Next.js app with CodeMirror editing, React Three Fiber graph views, and vault-aware AI tooling.",
    tags: ["Electron", "Next.js", "R3F", "TypeScript"],
    gradient: "from-indigo-500 to-sky-600",
    url: "https://github.com/Sdefendre/traces-app",
    image: "/project-previews/traces.svg",
    ctaLabel: "View on GitHub",
  },
  {
    initials: "KS",
    title: "Krystin Sylvia",
    description:
      "Professional portfolio for an RN / BSN case manager — experience timeline, credentials, resume download, and contact paths.",
    role: "Frontend developer",
    outcome:
      "Delivered a clean personal brand site focused on clinical experience and healthcare leadership goals.",
    tags: ["Next.js", "React", "TypeScript"],
    gradient: "from-teal-500 to-cyan-600",
    url: "https://krystinsylvia.com",
    ctaLabel: "View portfolio",
  },
  {
    initials: "VC",
    title: "Velocity Care LLC",
    description:
      "Healthcare practice web presence with services overview, provider bio, and contact paths for patients evaluating care.",
    role: "Website architecture and frontend delivery",
    outcome:
      "Gave the practice a polished public site patients can use to learn about care options and get in touch.",
    tags: ["Next.js", "Tailwind CSS", "Vercel"],
    gradient: "from-blue-500 to-cyan-600",
    url: "https://velocitycarellc.com",
    image: "/velocity-care.png",
    ctaLabel: "Visit healthcare site",
  },
  {
    initials: "CA",
    title: "Command.AI",
    description:
      "Veteran-focused product for claim prep, benefits education, and financial readiness — mission-style planning instead of scattered checklists.",
    role: "Founder and full-stack product engineer",
    outcome:
      "Shipped a live web app with auth, structured learning paths, and ongoing product iteration for service members in transition.",
    tags: ["Next.js", "TypeScript", "Convex"],
    gradient: "from-emerald-500 to-teal-600",
    url: "https://trycommand.vercel.app",
    image: "/project-previews/command-ai.svg",
    ctaLabel: "Open platform",
  },
];
