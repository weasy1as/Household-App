"use client";

import { useActionState } from "react";
import { Check, LoaderCircle, UserRoundX } from "lucide-react";
import {
  updateMemberStatus,
  type MemberStatusState,
} from "@/lib/actions/member-status";

type MemberStatusButtonProps = {
  householdId: string;
  memberId: string;
  active: boolean;
};

const initialState: MemberStatusState = {};

export default function MemberStatusButton({
  householdId,
  memberId,
  active,
}: MemberStatusButtonProps) {
  const action = updateMemberStatus.bind(null, householdId, memberId, !active);

  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="flex max-w-32 shrink-0 flex-col items-end gap-1.5">
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          aria-label={active ? "Set member inactive" : "Set member active"}
          className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${
            active
              ? "border-[#E1E5DE] bg-white text-[#657064] hover:bg-[#F4F5F1] focus-visible:ring-[#8A9485]/20"
              : "border-[#CFE0CA] bg-[#EDF5E9] text-[#315B40] hover:bg-[#E1EEDD] focus-visible:ring-[#315B40]/20"
          }`}
        >
          {pending ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : active ? (
            <UserRoundX size={14} />
          ) : (
            <Check size={14} />
          )}

          <span>
            {pending ? "Updating" : active ? "Deactivate" : "Activate"}
          </span>
        </button>
      </form>

      {state.error && (
        <p role="alert" className="max-w-32 text-right text-xs text-red-600">
          {state.error}
        </p>
      )}

      {state.success && (
        <p role="status" className="max-w-32 text-right text-xs text-[#35643C]">
          {state.success}
        </p>
      )}
    </div>
  );
}
