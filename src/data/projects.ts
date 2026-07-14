export interface Project {
  initials: string;
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  url: string;
  image?: string;
  priority?: boolean;
}

export const projects: Project[] = [
  {
    initials: "DS",
    title: "Defendre Solutions",
    description:
      "My development studio transforming ideas into production-ready applications. Full-stack development, consulting, and custom software solutions.",
    tags: ["Next.js", "React", "TypeScript"],
    gradient: "from-slate-600 to-indigo-600",
    url: "https://defendresolutions.com",
    image: "/defendre-solutions.png",
    priority: true,
  },
  {
    initials: "BR",
    title: "BraidsbyRose",
    description:
      "A complete booking system that increased client bookings by 300%. Streamlined appointment management for a growing beauty business with automated reminders and calendar integration.",
    tags: ["React", "PostgreSQL", "Node.js"],
    gradient: "from-pink-500 to-rose-600",
    url: "https://braidsbyrose.com",
    image: "/project-previews/braidsbyrose.svg",
  },
  {
    initials: "VC",
    title: "Velocity Care LLC",
    description:
      "Professional medical services website designed for healthcare accessibility and patient engagement. Features include appointment scheduling, service information, and patient resources.",
    tags: ["Next.js", "Tailwindcss", "Vercel"],
    gradient: "from-blue-500 to-cyan-600",
    url: "https://velocitycarellc.com",
    image: "/velocity-care.png",
  },
  {
    initials: "CA",
    title: "Command.AI",
    description:
      "Veteran education platform helping service members transition to civilian careers through AI-powered learning paths. Personalized skill mapping and job matching capabilities.",
    tags: ["AI/ML", "AWS", "Python", "React"],
    gradient: "from-emerald-500 to-teal-600",
    url: "https://trycommand.vercel.app",
    image: "/project-previews/command-ai.svg",
  },
];
