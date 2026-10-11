import { Suspense } from "react";
import AddMemberForm from "@/components/household/add-member-form";
import MembersList from "@/components/household/members-list";
import RotationSettingsForm from "@/components/household/rotation-settings-form";
import { getHousehold } from "@/lib/actions/households";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ householdId: string }>;
};

export default async function MembersPage({ params }: Props) {
  const { householdId } = await params;

  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F7F8F4] p-4 sm:p-6">
          <div className="mx-auto max-w-3xl animate-pulse space-y-5">
            <div className="h-28 rounded-3xl bg-gray-200" />
            <div className="h-64 rounded-3xl bg-gray-200" />
            <div className="h-72 rounded-3xl bg-gray-200" />
          </div>
        </main>
      }
    >
      <MembersContent householdId={householdId} />
    </Suspense>
  );
}

async function MembersContent({ householdId }: { householdId: string }) {
  const household = await getHousehold(householdId);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = Boolean(
    user &&
    household.members.some(
      (member: { userId: string; role: string }) =>
        member.userId === user.id && member.role === "owner",
    ),
  );

  return (
    <main className="min-h-screen bg-[#F7F8F4] px-4 py-5 text-[#202A22] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl space-y-5 sm:space-y-7">
        <header className="rounded-3xl bg-gradient-to-br from-[#244C3A] to-[#163729] p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm font-medium text-emerald-100">
            Household settings
          </p>

          <h1 className="mt-3 break-words text-3xl font-semibold tracking-tight sm:text-4xl">
            Members & rotation
          </h1>

          <p className="mt-2 text-sm leading-6 text-emerald-100/80">
            Manage your household members and keep daily responsibilities
            organised.
          </p>

          <div className="mt-5 inline-flex items-center rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm">
            {household.members.length}{" "}
            {household.members.length === 1 ? "member" : "members"}
          </div>
        </header>

        {isOwner && <AddMemberForm householdId={householdId} />}

        <MembersList
          householdId={householdId}
          members={household.members}
          canManageStatus={isOwner}
        />

        {isOwner && (
          <RotationSettingsForm
            householdId={household.id}
            members={household.members}
            rotationStartDate={household.rotationStartDate}
            rotationStartMemberId={household.rotationStartMemberId}
          />
        )}
      </div>
    </main>
  );
}
