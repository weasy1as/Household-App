import { Suspense } from "react";
import CleaningSchedule from "@/components/household/cleaning-schedule";
import HouseholdHeader from "@/components/household/household-header";
import ResponsibilitySummary from "@/components/household/responsibility-summary";
import { getCleaningSchedule } from "@/lib/actions/cleaning-schedule";
import { getHousehold } from "@/lib/actions/households";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ householdId: string }>;
};

export default function HouseholdPage({ params }: Props) {
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
      <HouseholdContent params={params} />
    </Suspense>
  );
}

async function HouseholdContent({ params }: Props) {
  const { householdId } = await params;

  const [household, schedule] = await Promise.all([
    getHousehold(householdId),
    getCleaningSchedule(householdId, 7),
  ]);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          currentUserId={user?.id}
        />

        <CleaningSchedule schedule={schedule} currentUserId={user?.id} />
      </div>
    </main>
  );
}
