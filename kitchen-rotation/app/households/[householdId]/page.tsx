import { Suspense } from "react";
import CleaningSchedule from "@/components/household/cleaning-schedule";
import HouseholdHeader from "@/components/household/household-header";
import ResponsibilitySummary from "@/components/household/responsibility-summary";
import { getCleaningSchedule } from "@/lib/actions/cleaning-schedule";
import { getHousehold } from "@/lib/actions/households";

type Props = {
  params: Promise<{ householdId: string }>;
};

export default async function HouseholdPage({ params }: Props) {
  const { householdId } = await params;

  return (
    <Suspense
      fallback={
        <main className="mx-auto min-h-screen max-w-5xl bg-[#F7F8F4] p-4 sm:p-6">
          <div className="animate-pulse space-y-5">
            <div className="h-40 rounded-3xl bg-gray-200" />
            <div className="h-52 rounded-3xl bg-gray-200" />
            <div className="h-72 rounded-3xl bg-gray-200" />
          </div>
        </main>
      }
    >
      <HouseholdContent householdId={householdId} />
    </Suspense>
  );
}

async function HouseholdContent({ householdId }: { householdId: string }) {
  const [household, schedule] = await Promise.all([
    getHousehold(householdId),
    getCleaningSchedule(householdId, 7),
  ]);

  return (
    <main className="min-h-screen bg-[#F7F8F4] px-4 py-5 text-[#202A22] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-5 sm:space-y-7">
        <HouseholdHeader
          name={household.name}
          memberCount={household.members.length}
          rotationStartDate={household.rotationStartDate}
        />

        <ResponsibilitySummary
          members={household.members}
          rotationStartDate={household.rotationStartDate}
          rotationStartMemberId={household.rotationStartMemberId}
        />

        <CleaningSchedule schedule={schedule} />

        <footer className="pb-4 pt-1 text-center">
          <p className="text-xs text-[#8A9288]">
            A happier home starts with sharing the work.
          </p>
        </footer>
      </div>
    </main>
  );
}
