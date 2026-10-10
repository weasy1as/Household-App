import MembersList from "@/components/household/members-list";
import RotationSettingsForm from "@/components/household/rotation-settings-form";
import { getHousehold } from "@/lib/actions/households";
import { createClient } from "@/lib/supabase/server";
import React, { Suspense } from "react";

type Props = {
  params: Promise<{ householdId: string }>;
};

export default async function MembersPage({ params }: Props) {
  const { householdId } = await params;

  return (
    <Suspense fallback={<div className="p-6">Loading household...</div>}>
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
    <div>
      <MembersList
        householdId={householdId}
        members={household.members}
        canManageStatus={isOwner}
      />

      <RotationSettingsForm
        householdId={household.id}
        members={household.members}
        rotationStartDate={household.rotationStartDate}
        rotationStartMemberId={household.rotationStartMemberId}
      />
    </div>
  );
}
