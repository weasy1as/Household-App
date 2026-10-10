"use client";

import { House, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BottomNavProps = {
  householdId: string;
  isOwner: boolean;
};

export default function BottomNav({ householdId, isOwner }: BottomNavProps) {
  const pathname = usePathname();
  const householdPath = `/households/${householdId}`;

  const items = [
    {
      href: householdPath,
      label: "Schedule",
      icon: House,
      isVisible: true,
      isActive: (path: string) => path === householdPath,
    },
    {
      href: `${householdPath}/members`,
      label: "Members",
      icon: Users,
      isVisible: isOwner,
      isActive: (path: string) =>
        path === `${householdPath}/members` ||
        path.startsWith(`${householdPath}/members/`),
    },
  ];

  const visibleItems = items.filter((item) => item.isVisible);

  return (
    <nav
      aria-label="Household navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E9E1] bg-[#F7F8F4]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#F7F8F4]/85"
    >
      <div className="mx-auto max-w-lg px-4">
        <div
          className={`grid ${
            visibleItems.length === 1 ? "grid-cols-1" : "grid-cols-2"
          } gap-2 py-2`}
        >
          {visibleItems.map(({ href, label, icon: Icon, isActive }) => {
            const active = isActive(pathname);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`group flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315B40] focus-visible:ring-offset-2 ${
                  active
                    ? "bg-[#E5EEE1] text-[#244C3A]"
                    : "text-[#858D82] hover:bg-[#EEF0E9] hover:text-[#354737]"
                }`}
              >
                <Icon
                  aria-hidden="true"
                  size={21}
                  strokeWidth={active ? 2.4 : 1.8}
                  className="transition-transform duration-200 group-active:scale-90"
                />

                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
