import {
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline";

const skills = [
  "React", "Next.js", "TypeScript", "Node.js",
  "PostgreSQL", "AWS", "Docker", "Python",
  "Tailwind CSS", "GraphQL", "REST APIs", "Git"
];

const values = [
  {
    icon: ShieldCheckIcon,
    title: "Military Foundation",
    description: "Discipline, precision, and a mission-first mentality guide every project I undertake."
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "Builder",
    description: "Creating solutions designed to endure and expand, not just quick fixes."
  },
  {
    icon: LightBulbIcon,
    title: "Consultant",
    description: "Providing strategic guidance grounded in real-world expertise and experience."
  }
];

export default function About() {
  return (
    <div>
      {/* Mobile Header */}
      <div className="lg:hidden text-center mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/headshot.jpg"
          alt="Steve Defendre"
          className="w-24 h-24 rounded-full object-cover object-top mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">About Me</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Military veteran turned full-stack engineer. Founder of Defendre Solutions, combining military discipline with modern technology.
        </p>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-start gap-6 mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/headshot.jpg"
          alt="Steve Defendre"
          className="w-32 h-32 rounded-xl object-cover flex-shrink-0"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">About Me</h1>
          <p className="text-base text-gray-600 leading-relaxed">
            I&apos;m Steve Defendre, a military veteran turned full-stack engineer. As the
            founder of Defendre Solutions, I combine military discipline with modern
            technology to help small businesses compete digitally.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <section className="mb-8 lg:mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Core Values</h2>
        <div className="grid gap-3 lg:gap-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex gap-3 lg:gap-4 p-4 lg:p-5 bg-white rounded-xl border border-gray-100 lg:border-gray-200"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <value.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base">{value.title}</h3>
                <p className="text-xs lg:text-sm text-gray-600">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 lg:px-4 lg:py-2 bg-white border border-gray-100 lg:border-gray-200 rounded-full lg:rounded-lg text-xs lg:text-sm text-gray-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
