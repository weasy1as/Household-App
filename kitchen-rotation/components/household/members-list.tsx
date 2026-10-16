import { ShieldCheck, Users, UserRound } from "lucide-react";
import MemberDeleteButton from "@/components/household/member-delete-button";
import MemberStatusButton from "@/components/household/member-status-button";

export type Member = {
  id: string;
  userId: string;
  displayName?: string;
  role: string;
  position: number;
  active: boolean;
};

type MembersListProps = {
  householdId: string;
  members: Member[];
  canManageStatus?: boolean;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function MembersList({
  householdId,
  members,
  canManageStatus = false,
}: MembersListProps) {
  const sortedMembers = [...members].sort((a, b) => a.position - b.position);

  return (
    <section className="overflow-hidden rounded-3xl border border-[#E7EAE2] bg-white shadow-[0_2px_12px_rgba(31,45,33,0.025)]">
      <div className="flex items-center justify-between gap-3 p-5 sm:p-7">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#63806A]">
            <Users size={16} />
            <span>Your household</span>
          </div>

          <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#202A22] sm:text-2xl">
            Members
          </h2>

          <p className="mt-1 text-sm text-[#7B847A]">
            {members.length}{" "}
            {members.length === 1 ? "person belongs" : "people belong"} to this
            household.
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F0F4EC] text-[#315B40]">
          <Users size={21} />
        </div>
      </div>

      {sortedMembers.length === 0 ? (
        <div className="px-5 pb-7 sm:px-7">
          <div className="rounded-2xl border border-dashed border-[#DCE3D8] bg-[#FAFBF8] px-4 py-8 text-center">
            <UserRound size={28} className="mx-auto text-[#879487]" />
            <p className="mt-3 font-medium text-[#354737]">No members yet</p>
            <p className="mt-1 text-sm text-[#7B847A]">
              Household members will appear here.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-1 px-3 pb-3 sm:px-5 sm:pb-5">
          {sortedMembers.map((member) => {
            const name =
              member.displayName?.trim() || `Member ${member.position}`;

            return (
              <li
                key={member.id}
                className="flex min-w-0 flex-wrap items-start gap-3 rounded-2xl border border-transparent p-3 transition-colors hover:border-[#E9ECE5] hover:bg-[#FAFBF8] sm:flex-nowrap sm:items-center sm:gap-4 sm:p-4"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold ${
                    member.active
                      ? "bg-[#E8EFE5] text-[#315B40]"
                      : "bg-[#F0F0ED] text-[#858A82]"
                  }`}
                >
                  {getInitials(name)}
                </div>

                <div className="min-w-0 flex-1 basis-[calc(100%-3.75rem)] sm:basis-auto">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className="min-w-0 break-words text-sm font-semibold text-[#263329] sm:text-base">
                      {name}
                    </p>

                    {member.role === "owner" && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#E8EFE5] px-2 py-1 text-[10px] font-semibold text-[#315B40]">
                        <ShieldCheck size={12} />
                        Owner
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-xs text-[#879084]">
                    Member #{member.position}
                  </p>

                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        member.active
                          ? "bg-[#EAF4E8] text-[#35643C]"
                          : "bg-[#F0F0ED] text-[#737970]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          member.active ? "bg-[#4D8A52]" : "bg-[#92978F]"
                        }`}
                      />
                      {member.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {canManageStatus && (
                  <div className="flex w-full shrink-0 justify-end gap-2 border-t border-[#EEF0EB] pt-3 sm:w-auto sm:border-t-0 sm:pt-0">
                    <MemberStatusButton
                      householdId={householdId}
                      memberId={member.id}
                      active={member.active}
                    />
                    {member.role !== "owner" && (
                      <MemberDeleteButton
                        householdId={householdId}
                        memberId={member.id}
                      />
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
