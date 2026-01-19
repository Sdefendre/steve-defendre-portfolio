import {
  EnvelopeIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";

const contactLinks = [
  {
    name: "Email",
    value: "steve.defendre12@gmail.com",
    href: "mailto:steve.defendre12@gmail.com",
    icon: EnvelopeIcon,
    description: "Best for project inquiries"
  },
  {
    name: "LinkedIn",
    value: "Connect with me",
    href: "https://www.linkedin.com/in/joseph-m-defendre-a11a47225/",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    description: "Let's connect professionally"
  },
  {
    name: "GitHub",
    value: "View my code",
    href: "https://github.com/Sdefendre",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    description: "Check out my projects"
  },
  {
    name: "Support",
    value: "Buy me a coffee",
    href: "https://buymeacoffee.com/defendresolutions",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364z"/>
      </svg>
    ),
    description: "Support my work"
  },
];

export default function Contact() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h1>
      <p className="text-base text-gray-600 mb-8 max-w-xl">
        Have a project in mind or want to discuss how I can help your business?
        I&apos;d love to hear from you.
      </p>

      <div className="grid gap-4 mb-12">
        {contactLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target={link.href.startsWith("mailto") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
            className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white">
              <link.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{link.name}</h3>
                {!link.href.startsWith("mailto") && (
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                )}
              </div>
              <p className="text-sm text-gray-500">{link.description}</p>
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              {link.value}
            </span>
          </a>
        ))}
      </div>

      {/* Business Info */}
      <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white">
        <h3 className="text-lg font-semibold mb-2">Defendre Solutions</h3>
        <p className="text-gray-300 text-sm mb-4">
          Veteran-owned software development helping small businesses compete digitally
          through modern technology and military-grade discipline.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Available for new projects
        </div>
      </div>
    </div>
  );
}
