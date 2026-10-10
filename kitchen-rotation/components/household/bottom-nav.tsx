"use client";

import { House, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BottomNavProps = {
  householdId: string;
  isOwner: boolean;
};

export default function BottomNav({
  householdId,
  isOwner,
}: BottomNavProps) {
  const pathname = usePathname();
  const householdPath = `/households/${householdId}`;
  const items = [
    {
      href: householdPath,
      label: "Schedule",
      icon: House,
      isVisible: true,
    },
    {
      href: `${householdPath}/members`,
      label: "Members",
      icon: Users,
      isVisible: isOwner,
    },
  ];

  return (
    <nav
      aria-label="Household navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div
        className={`mx-auto grid max-w-4xl ${
          isOwner ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {items
          .filter((item) => item.isVisible)
          .map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 px-3 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon aria-hidden="true" className="size-5" />
                <span>{label}</span>
              </Link>
            );
          })}
      </div>
    </nav>
  );
}
