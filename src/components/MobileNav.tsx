"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UserIcon,
  FolderIcon,
  DocumentTextIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  FolderIcon as FolderIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
} from "@heroicons/react/24/solid";

const navItems = [
  { name: "Home", href: "/", icon: HomeIcon, activeIcon: HomeIconSolid },
  { name: "About", href: "/about", icon: UserIcon, activeIcon: UserIconSolid },
  { name: "Projects", href: "/projects", icon: FolderIcon, activeIcon: FolderIconSolid },
  { name: "Services", href: "/services", icon: DocumentTextIcon, activeIcon: DocumentTextIconSolid },
  { name: "Contact", href: "/contact", icon: EnvelopeIcon, activeIcon: EnvelopeIconSolid },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.activeIcon : item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-500"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
