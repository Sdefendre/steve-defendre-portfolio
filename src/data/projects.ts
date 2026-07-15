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
      "A personal brand portfolio that keeps the presentation clean, fast, and focused on the person behind the work.",
    role: "Portfolio design and implementation",
    outcome:
      "Created a live portfolio presence with fast browsing, clear presentation, and room for creative work to lead.",
    tags: ["React", "Docker", "TypeScript"],
    gradient: "from-violet-500 to-purple-600",
    url: "https://krystinsylvia.com",
    image: "/project-previews/krystin-sylvia.svg",
    ctaLabel: "View portfolio",
  },
  {
    initials: "NP",
    title: "Nayka's Portfolio",
    description:
      "A responsive portfolio site shaped around scannable work samples, professional presentation, and a clean browsing path.",
    role: "Portfolio build and deployment",
    outcome:
      "Delivered a live personal site that makes the owner's work and story easier to navigate.",
    tags: ["Portfolio", "Vercel", "Responsive Design"],
    gradient: "from-amber-500 to-orange-600",
    url: "https://nayka-portfolio.vercel.app/",
    image: "/nayka-portfolio.png",
    ctaLabel: "View portfolio",
  },
];
