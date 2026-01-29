import ProjectCard from "@/components/ProjectCard";
import MobileProjectCard from "@/components/MobileProjectCard";

const projects = [
  {
    initials: "DS",
    title: "Defendre Solutions",
    description: "My development studio transforming ideas into production-ready applications. Full-stack development, consulting, and custom software solutions.",
    tags: ["Next.js", "React", "TypeScript"],
    gradient: "from-slate-600 to-indigo-600",
    url: "https://defendresolutions.com"
  },
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
      {/* Mobile Header */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center gap-3 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/headshot.jpg"
            alt="Steve Defendre"
            className="w-14 h-14 rounded-full object-cover object-top"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Steve Defendre</h1>
            <p className="text-sm text-gray-500">Full-Stack Developer</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Veteran & founder of{" "}
          <a
            href="https://defendresolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline underline-offset-2 font-medium"
          >
            Defendre Solutions
          </a>
          . Transforming ideas into production-ready applications.
        </p>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="text-4xl mb-2">👋</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Hello there! I&apos;m Steve
        </h1>
        <p className="text-base text-gray-600 mb-3 max-w-xl">
          I&apos;m a full-stack developer that loves building products and web apps that
          can impact millions of lives.
        </p>
        <p className="text-[15px] text-gray-500 mb-12 max-w-xl">
          I&apos;m a veteran and founder of{" "}
          <a
            href="https://defendresolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline underline-offset-2 font-medium"
          >
            Defendre Solutions
          </a>
          , transforming ideas into production-ready applications that drive real
          business results. Military discipline meets modern technology.
        </p>
      </div>

      {/* Projects Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">
          Projects
        </h2>

        {/* Mobile Projects */}
        <div className="lg:hidden grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <MobileProjectCard key={project.title} {...project} />
          ))}
        </div>

        {/* Desktop Projects */}
        <div className="hidden lg:flex flex-col gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>
    </div>
  );
}
