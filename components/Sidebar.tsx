"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentType } from "react";
import { Home, Mail, BarChart3, Settings, User } from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
};

const navigation: NavItem[] = [
  { name: "Active Deals", href: "/", icon: Home },
  { name: "Connect Accounts", href: "/#connect", icon: Mail },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "User Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r bg-gray-50 p-4">
      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const selected =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={selected ? "page" : undefined}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                selected
                  ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200"
                  : "text-gray-700 hover:bg-gray-100",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}