import BottomNav from "@/components/household/bottom-nav";
import { getHousehold } from "@/lib/actions/households";
import { createClient } from "@/lib/supabase/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ householdId: string }>;
};

export default async function HouseholdLayout({ children, params }: Props) {
  const { householdId } = await params;
  const [household, supabase] = await Promise.all([
    getHousehold(householdId),
    createClient(),
  ]);
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
    <div className="min-h-screen pb-20">
      {children}
      <BottomNav householdId={householdId} isOwner={isOwner} />
    </div>
  );
}
