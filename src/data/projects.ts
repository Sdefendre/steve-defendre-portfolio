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
      "Private, local hold-to-talk dictation for Apple Silicon Macs. Hold fn, speak, release to insert — no cloud accounts, no always-on mic.",
    role: "Product designer and Python systems engineer",
    outcome:
      "Shipped an MIT-licensed menu-bar app with local Whisper inference, hands-free mode, and a clean install path for real daily use.",
    tags: ["Python", "Whisper", "macOS", "MLX"],
    gradient: "from-violet-500 to-purple-700",
    url: "https://github.com/Sdefendre/freevoicetranscribe",
    image: "/project-previews/freevoicetranscribe.svg",
    ctaLabel: "View on GitHub",
  },
  {
    initials: "TR",
    title: "Traces",
    description:
      "A local-first knowledge workspace with a 3D force-directed graph, markdown vault, and multi-provider AI assistant that can read and edit notes.",
    role: "Founder product and full-stack desktop engineer",
    outcome:
      "Built a Defendre Solutions desktop app combining Electron, Next.js, React Three Fiber, and multi-provider AI chat in one vault-native surface.",
    tags: ["Electron", "Next.js", "R3F", "TypeScript"],
    gradient: "from-indigo-500 to-sky-600",
    url: "https://github.com/Sdefendre/traces-app",
    image: "/project-previews/traces.svg",
    ctaLabel: "View on GitHub",
  },
  {
    initials: "SM",
    title: "Social Media Manager Agent",
    description:
      "An AI content ops console that turns one topic into a blog post, X copy, LinkedIn copy, and hero image with calendar and publish flows.",
    role: "AI product builder and full-stack engineer",
    outcome:
      "Compressed multi-channel content production into a single generation pipeline with history, scheduling, and one-click publish paths.",
    tags: ["AI Agents", "Next.js", "TypeScript", "Gemini"],
    gradient: "from-amber-500 to-orange-600",
    url: "https://social-media-manager-agent.vercel.app",
    image: "/project-previews/social-media-manager-agent.svg",
    ctaLabel: "Open agent",
  },
  {
    initials: "BR",
    title: "BraidsbyRose",
    description:
      "A booking-focused site and client workflow for a growing beauty business, built to reduce manual scheduling and make services easier to book.",
    role: "Full-stack booking system lead",
    outcome:
      "Moved the business from manual coordination toward a live booking experience with clearer service discovery.",
    tags: ["React", "PostgreSQL", "Node.js"],
    gradient: "from-pink-500 to-rose-600",
    url: "https://braidsbyrose.com",
    image: "/project-previews/braidsbyrose.svg",
    ctaLabel: "View booking site",
  },
  {
    initials: "VC",
    title: "Velocity Care LLC",
    description:
      "A professional healthcare web presence designed around clear services, patient confidence, and direct access to appointment information.",
    role: "Website architecture and frontend delivery",
    outcome:
      "Gave the practice a polished, accessible live site for patients evaluating care options.",
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
      "An education and career-transition concept helping service members translate military experience into clearer civilian learning paths.",
    role: "Product builder for veteran transition tooling",
    outcome:
      "Prototyped a focused AI-guided experience around skills mapping, learning direction, and next-step clarity.",
    tags: ["AI/ML", "AWS", "Python", "React"],
    gradient: "from-emerald-500 to-teal-600",
    url: "https://trycommand.vercel.app",
    image: "/project-previews/command-ai.svg",
    ctaLabel: "Open platform",
  },
  {
    initials: "KS",
    title: "Krystin Sylvia",
    description:
      "Personal brand portfolio showcasing creative work with elegant design and seamless user experience.",
    role: "Portfolio frontend developer",
    outcome:
      "Delivered a clean portfolio site with seamless layout transitions.",
    tags: ["React", "Docker", "TypeScript"],
    gradient: "from-violet-500 to-purple-600",
    url: "https://krystinsylvia.com",
    ctaLabel: "View portfolio",
  },
];
