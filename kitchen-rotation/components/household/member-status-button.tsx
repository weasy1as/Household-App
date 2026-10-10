"use client";

import { useActionState } from "react";
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
    <div className="flex shrink-0 flex-col items-end gap-2">
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            active
              ? "border-gray-300 text-gray-700 hover:bg-gray-100"
              : "border-green-300 text-green-700 hover:bg-green-50"
          }`}
        >
          {pending ? "Updating..." : active ? "Set inactive" : "Set active"}
        </button>
      </form>

      {state.error && (
        <p role="alert" className="max-w-40 text-right text-xs text-red-600">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="max-w-40 text-right text-xs text-green-700">
          {state.success}
        </p>
      )}
    </div>
  );
}
