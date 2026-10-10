import { Suspense } from "react";
import CleaningSchedule from "@/components/household/cleaning-schedule";
import HouseholdHeader from "@/components/household/household-header";
import { getCleaningSchedule } from "@/lib/actions/cleaning-schedule";
import { getHousehold } from "@/lib/actions/households";

type Props = {
  params: Promise<{ householdId: string }>;
};

export default async function HouseholdPage({ params }: Props) {
  const { householdId } = await params;

  return (
    <Suspense fallback={<div className="p-6">Loading household...</div>}>
      <HouseholdContent householdId={householdId} />
    </Suspense>
  );
}

async function HouseholdContent({ householdId }: { householdId: string }) {
  const household = await getHousehold(householdId);
  const schedule = await getCleaningSchedule(householdId, 7);

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      <HouseholdHeader
        name={household.name}
        memberCount={household.members.length}
        rotationStartDate={household.rotationStartDate}
      />

      <CleaningSchedule schedule={schedule} />
    </main>
  );
}
