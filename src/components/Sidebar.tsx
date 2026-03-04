"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserIcon,
  FolderIcon,
  EnvelopeIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { GitHubIcon, LinkedInIcon, SupportIcon } from "@/components/SocialIcons";

const navItems = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "About", href: "/about", icon: UserIcon },
  { name: "Projects", href: "/projects", icon: FolderIcon },
  { name: "Contact", href: "/contact", icon: EnvelopeIcon },
];

const socialLinks = [
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
    name: "Support",
    href: "https://buymeacoffee.com/defendresolutions",
    icon: SupportIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[200px] bg-white border-r border-gray-200 p-6 fixed h-screen flex-col">
      {/* Profile */}
      <div className="flex items-center gap-3 mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/headshot.jpg"
          alt="Steve Defendre"
          className="w-10 h-10 rounded-full object-cover object-top"
        />
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Steve Defendre</h2>
          <p className="text-xs text-gray-500">Developer</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mb-8" aria-label="Primary navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Socials */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 px-3">
        Socials
      </p>
      <div className="mb-8">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <link.icon className="w-[18px] h-[18px]" />
            {link.name}
          </a>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <Link
          href="/contact"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Contact Me
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
}
