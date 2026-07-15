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
    value: "steve.defendre12@gmail.com",
    href: "mailto:steve.defendre12@gmail.com",
    icon: EnvelopeIcon,
    description: "Best for project inquiries and availability",
    priority: "primary",
  },
  {
    name: "GitHub",
    value: "github.com/Sdefendre",
    href: "https://github.com/Sdefendre",
    icon: GitHubIcon,
    description: "Review shipped projects and source work",
    priority: "secondary",
  },
  {
    name: "LinkedIn",
    value: "linkedin.com/in/joseph-m-defendre-a11a47225",
    mobileValue: "LinkedIn profile",
    href: "https://www.linkedin.com/in/joseph-m-defendre-a11a47225/",
    icon: LinkedInIcon,
    description: "Connect professionally",
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
