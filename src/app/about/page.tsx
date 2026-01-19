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
      {/* Header with headshot */}
      <div className="flex items-start gap-6 mb-8">
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
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Core Values</h2>
        <div className="grid gap-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex gap-4 p-5 bg-white rounded-xl border border-gray-200"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <value.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Technical Skills</h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
