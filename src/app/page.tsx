import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* Mobile Header */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Image
            src="/headshot.jpg"
            alt="Steve Defendre"
            width={56}
            height={56}
            className="rounded-full object-cover object-top"
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
