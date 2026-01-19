import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    initials: "BR",
    title: "BraidsbyRose",
    description: "A complete booking system that increased client bookings by 300%. Streamlined appointment management for a growing beauty business.",
    tags: ["React", "PostgreSQL"],
    gradient: "from-pink-500 to-rose-600",
    url: "https://braidsbyrose.com"
  },
  {
    initials: "VC",
    title: "Velocity Care LLC",
    description: "Professional medical services website designed for healthcare accessibility and patient engagement.",
    tags: ["Next.js", "Tailwindcss"],
    gradient: "from-blue-500 to-cyan-600",
    url: "https://velocitycarellc.com",
    image: "/velocity-care.png"
  },
  {
    initials: "CA",
    title: "Command.AI",
    description: "Veteran education platform helping service members transition to civilian careers through AI-powered learning paths.",
    tags: ["AI/ML", "AWS"],
    gradient: "from-emerald-500 to-teal-600",
    url: "https://trycommand.vercel.app"
  },
  {
    initials: "KS",
    title: "Krystin Sylvia",
    description: "Personal brand portfolio showcasing creative work with elegant design and seamless user experience.",
    tags: ["React", "Docker"],
    gradient: "from-violet-500 to-purple-600",
    url: "https://krystinsylvia.com"
  },
];

export default function Home() {
  return (
    <div>
      <div className="text-4xl mb-2">👋</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Hello there! I&apos;m Steve
      </h1>
      <p className="text-base text-gray-600 mb-3 max-w-xl">
        I&apos;m a full-stack developer that loves building products and web apps that
        can impact millions of lives.
      </p>
      <p className="text-[15px] text-gray-500 mb-12 max-w-xl">
        I&apos;m a veteran and founder of Defendre Solutions, transforming ideas into
        production-ready applications that drive real business results. Military
        discipline meets modern technology.
      </p>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          What I&apos;ve been working on
        </h2>
        <div className="flex flex-col gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>
    </div>
  );
}
