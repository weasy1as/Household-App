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

export default function MembersList({
  householdId,
  members,
  canManageStatus = false,
}: MembersListProps) {
  const sortedMembers = [...members].sort((a, b) => a.position - b.position);

  return (
    <section className="rounded-lg border p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Household members</h2>
          <p className="mt-1 text-sm text-gray-600">
            {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </div>
      </div>

      {sortedMembers.length === 0 ? (
        <p className="text-sm text-gray-600">No household members found.</p>
      ) : (
        <ul className="divide-y">
          {sortedMembers.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {member.displayName ?? `Member ${member.position}`}
                </p>

                <p className="text-sm text-gray-600">
                  Position {member.position}
                  {member.role === "owner" ? " · Owner" : ""}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    member.active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {member.active ? "Active" : "Inactive"}
                </span>

                {canManageStatus && (
                  <MemberStatusButton
                    householdId={householdId}
                    memberId={member.id}
                    active={member.active}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
