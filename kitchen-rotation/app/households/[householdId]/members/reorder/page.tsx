import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ListOrdered } from "lucide-react";
import MemberReorderForm from "@/components/household/member-reorder-form";
import { getHousehold } from "@/lib/actions/households";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ householdId: string }>;
};

export default async function ReorderMembersPage({ params }: Props) {
  const { householdId } = await params;
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

  if (!isOwner) {
    redirect(`/households/${householdId}/members`);
  }

  return (
    <main className="min-h-screen bg-[#F7F8F4] px-4 py-5 text-[#202A22] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl space-y-5 sm:space-y-7">
        <header className="rounded-3xl bg-gradient-to-br from-[#244C3A] to-[#163729] p-6 text-white shadow-sm sm:p-8">
          <Link
            href={`/households/${householdId}/members`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-100 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeft size={16} />
            Manage members
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
              <ListOrdered size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-100">
                Household settings
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Reorder rotation
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-emerald-100/80">
            Arrange every household member in the order they should appear in
            the rotation. Drag a row or use the move controls.
          </p>
        </header>

        <MemberReorderForm
          householdId={householdId}
          members={household.members}
        />
      </div>
    </main>
  );
}
