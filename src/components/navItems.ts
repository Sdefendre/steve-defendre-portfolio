import {
  HomeIcon,
  UserIcon,
  FolderIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  FolderIcon as FolderIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
} from "@heroicons/react/24/solid";

export const primaryNavItems = [
  { name: "Home", href: "/", icon: HomeIcon, activeIcon: HomeIconSolid },
  { name: "About", href: "/about", icon: UserIcon, activeIcon: UserIconSolid },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderIcon,
    activeIcon: FolderIconSolid,
  },
  {
    name: "Contact",
    href: "/contact",
    icon: EnvelopeIcon,
    activeIcon: EnvelopeIconSolid,
  },
];
