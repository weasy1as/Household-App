import BottomNav from "@/components/household/bottom-nav";
import { getHousehold } from "@/lib/actions/households";
import { Suspense } from "react";

type Props = {
  children: React.ReactNode;
  params: Promise<{ householdId: string }>;
};

export default function HouseholdLayout({ children, params }: Props) {
  return (
    <Suspense
      fallback={<div className="min-h-screen animate-pulse bg-[#F7F8F4]" />}
    >
      <HouseholdLayoutContent params={params}>
        {children}
      </HouseholdLayoutContent>
    </Suspense>
  );
}

async function HouseholdLayoutContent({ children, params }: Props) {
  const { householdId } = await params;

  await getHousehold(householdId);

  return (
    <div className="min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))]">
      {children}
      <BottomNav householdId={householdId} />
    </div>
  );
}
