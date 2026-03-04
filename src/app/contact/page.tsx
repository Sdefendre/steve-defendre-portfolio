import {
  EnvelopeIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";
import { GitHubIcon, LinkedInIcon, SupportIcon } from "@/components/SocialIcons";

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
    icon: LinkedInIcon,
    description: "Let's connect professionally"
  },
  {
    name: "GitHub",
    value: "View my code",
    href: "https://github.com/Sdefendre",
    icon: GitHubIcon,
    description: "Check out my projects"
  },
  {
    name: "Support",
    value: "Buy me a coffee",
    href: "https://buymeacoffee.com/defendresolutions",
    icon: SupportIcon,
    description: "Support my work"
  },
];

export default function Contact() {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 lg:mb-4">Get in Touch</h1>
      <p className="text-sm lg:text-base text-gray-600 mb-6 lg:mb-8">
        Have a project in mind? I&apos;d love to hear from you.
      </p>

      <div className="grid gap-3 lg:gap-4 mb-8 lg:mb-12">
        {contactLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target={link.href.startsWith("mailto") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
            className="flex items-center gap-3 lg:gap-4 p-4 lg:p-5 bg-white rounded-xl border border-gray-100 lg:border-gray-200 active:scale-[0.98] transition-transform group"
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white">
              <link.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{link.name}</h3>
                {!link.href.startsWith("mailto") && (
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400" />
                )}
              </div>
              <p className="text-xs lg:text-sm text-gray-500 truncate">{link.description}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Business Info */}
      <div className="p-5 lg:p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white">
        <h3 className="text-base lg:text-lg font-semibold mb-2">Defendre Solutions</h3>
        <p className="text-gray-300 text-xs lg:text-sm mb-4">
          Veteran-owned software development helping small businesses compete digitally.
        </p>
        <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-400">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Available for new projects
        </div>
      </div>
    </div>
  );
}
