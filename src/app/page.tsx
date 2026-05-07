import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* Header */}
      <header className="mb-8 lg:mb-12">
        <div className="flex items-center gap-3 mb-4 lg:block lg:mb-0">
          <Image
            src="/headshot.jpg"
            alt="Steve Defendre"
            width={56}
            height={56}
            className="rounded-full object-cover object-top lg:hidden"
          />
          <div className="hidden lg:block text-4xl mb-2">👋</div>
          <div>
            <h1 className="text-xl lg:text-3xl font-bold text-gray-900 lg:mb-4">
              <span className="lg:hidden">Steve Defendre</span>
              <span className="hidden lg:inline">Hello there! I&apos;m Steve</span>
            </h1>
            <p className="text-sm text-gray-500 lg:hidden">Full-Stack Developer</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="hidden lg:block text-base text-gray-600 mb-3">
            I&apos;m a full-stack developer that loves building products and web apps that
            can impact millions of lives.
          </p>
          <p className="text-sm lg:text-[15px] text-gray-600 lg:text-gray-500 leading-relaxed">
            <span className="lg:hidden">Veteran & founder of </span>
            <span className="hidden lg:inline">I&apos;m a veteran and founder of </span>
            <a
              href="https://defendresolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-2 font-medium"
            >
              Defendre Solutions
            </a>
            <span className="lg:hidden">. Transforming ideas into production-ready applications.</span>
            <span className="hidden lg:inline">
              , transforming ideas into production-ready applications that drive real
              business results. Military discipline meets modern technology.
            </span>
          </p>
        </div>
      </header>

      {/* Projects Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">
          Projects
        </h2>

        {/* Responsive Projects Container */}
        <div className="grid grid-cols-1 gap-4 lg:flex lg:flex-col lg:gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>
    </div>
  );
}
