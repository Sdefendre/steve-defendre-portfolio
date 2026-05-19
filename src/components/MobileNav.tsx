"use client";

import { primaryNavItems } from "@/data/navigation";
import { NavLink } from "./NavLink";

const mobileNavSafeAreaStyle = {
  paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
};

export default function MobileNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2"
      aria-label="Primary navigation"
      style={mobileNavSafeAreaStyle}
    >
      <div className="flex items-center justify-around">
        {primaryNavItems.map((item) => (
          <NavLink
            key={item.name}
            href={item.href}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                isActive ? "text-indigo-600" : "text-gray-500"
              }`
            }
          >
            {({ isActive }) => {
              const Icon = isActive ? item.activeIcon : item.icon;
              return (
                <>
                  <Icon className="w-6 h-6" />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </>
              );
            }}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
