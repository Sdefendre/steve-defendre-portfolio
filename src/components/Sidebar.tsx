"use client";

import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { primaryNavItems } from "@/data/navigation";
import { socialLinks } from "@/data/socials";
import { NavLink } from "./NavLink";

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-[200px] bg-white border-r border-gray-200 p-6 fixed h-screen flex-col">
      {/* Profile */}
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/headshot.jpg"
          alt="Steve Defendre"
          width={40}
          height={40}
          className="rounded-full object-cover object-top"
          priority
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">Steve Defendre</p>
          <p className="text-xs text-gray-500">Developer</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mb-8" aria-label="Primary navigation">
        {primaryNavItems.map((item) => (
          <NavLink
            key={item.name}
            href={item.href}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="w-[18px] h-[18px]" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Socials */}
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 px-3">
        Socials
      </p>
      <div className="mb-8">
        {socialLinks.map((link) => (
          <NavLink
            key={link.name}
            href={link.href}
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <link.icon className="w-[18px] h-[18px]" />
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <NavLink
          href="/contact"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Contact Me
          <ArrowRightIcon className="w-4 h-4" />
        </NavLink>
      </div>
    </aside>
  );
}
