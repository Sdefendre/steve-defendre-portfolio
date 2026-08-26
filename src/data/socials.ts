import { BuildingOffice2Icon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { GitHubIcon, LinkedInIcon, SupportIcon } from "@/components/SocialIcons";

export const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/Sdefendre",
    icon: GitHubIcon,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/joseph-m-defendre-a11a47225/",
    icon: LinkedInIcon,
  },
  {
    name: "Defendre Solutions",
    href: "https://defendresolutions.com",
    icon: BuildingOffice2Icon,
  },
];

export const primaryContactEmail = "steve@defendresolutions.com";

export const supportLink = {
  name: "Support",
  value: "buymeacoffee.com/defendresolutions",
  href: "https://buymeacoffee.com/defendresolutions",
  icon: SupportIcon,
  description: "Optional support link",
  priority: "footer",
} as const;

export const contactLinks = [
  {
    name: "Email",
    value: primaryContactEmail,
    href: `mailto:${primaryContactEmail}`,
    icon: EnvelopeIcon,
    description: "Best for new work and scheduling",
    priority: "primary",
  },
  {
    name: "GitHub",
    value: "github.com/Sdefendre",
    href: "https://github.com/Sdefendre",
    icon: GitHubIcon,
    description: "Code and public repos",
    priority: "secondary",
  },
  {
    name: "LinkedIn",
    value: "linkedin.com/in/joseph-m-defendre-a11a47225",
    mobileValue: "LinkedIn profile",
    href: "https://www.linkedin.com/in/joseph-m-defendre-a11a47225/",
    icon: LinkedInIcon,
    description: "Work history and messages",
    priority: "secondary",
  },
  {
    name: "Defendre Solutions",
    value: "defendresolutions.com",
    href: "https://defendresolutions.com",
    icon: BuildingOffice2Icon,
    description: "Veteran-owned software studio",
    priority: "secondary",
  },
  supportLink,
];
