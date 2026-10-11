import BottomNav from "@/components/household/bottom-nav";
import { getHousehold } from "@/lib/actions/households";

type Props = {
  children: React.ReactNode;
  params: Promise<{ householdId: string }>;
};

export default async function HouseholdLayout({ children, params }: Props) {
  const { householdId } = await params;

  await getHousehold(householdId);

  return (
    <div className="min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom))]">
      {children}

      <BottomNav householdId={householdId} />
    </div>
  );
}
