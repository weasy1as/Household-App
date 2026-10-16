"use client";

import { useActionState } from "react";
import { LoaderCircle, Trash2 } from "lucide-react";
import {
  deleteHouseholdMember,
  type DeleteMemberState,
} from "@/lib/actions/members";

type MemberDeleteButtonProps = {
  householdId: string;
  memberId: string;
};

const initialState: DeleteMemberState = {};

export default function MemberDeleteButton({
  householdId,
  memberId,
}: MemberDeleteButtonProps) {
  const action = deleteHouseholdMember.bind(null, householdId, memberId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="flex max-w-32 shrink-0 flex-col items-end gap-1.5">
      <form
        action={formAction}
        onSubmit={(event) => {
          if (
            !window.confirm(
              "Are you sure you want to delete this household member?",
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          disabled={pending}
          aria-label="Delete household member"
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-[#F0D2D0] bg-white px-3 py-2 text-xs font-semibold text-[#A0443F] transition hover:bg-[#FFF5F4] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#A0443F]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
          <span>{pending ? "Deleting" : "Delete"}</span>
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
