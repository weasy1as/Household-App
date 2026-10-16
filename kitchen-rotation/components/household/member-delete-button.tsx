"use client";

import { useActionState, useRef } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
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
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex max-w-32 shrink-0 flex-col items-end gap-1.5">
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <button
            type="button"
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
        </AlertDialog.Trigger>

        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-50 bg-[#202A22]/45 backdrop-blur-[2px]" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#E7EAE2] bg-white p-6 shadow-2xl focus:outline-none sm:p-7">
            <AlertDialog.Title className="text-lg font-semibold text-[#202A22]">
              Delete household member?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm leading-6 text-[#657064]">
              This member will be removed from the household. This action
              cannot be undone.
            </AlertDialog.Description>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AlertDialog.Cancel className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[#E1E5DE] bg-white px-4 py-2 text-sm font-semibold text-[#657064] transition hover:bg-[#F4F5F1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8A9485]/20">
                Cancel
              </AlertDialog.Cancel>
              <form ref={formRef} action={formAction}>
                <AlertDialog.Action asChild>
                  <button
                    type="button"
                    onClick={() => formRef.current?.requestSubmit()}
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-[#A0443F] bg-[#A0443F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#893A36] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#A0443F]/25 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    disabled={pending}
                  >
                    {pending ? "Deleting..." : "Delete member"}
                  </button>
                </AlertDialog.Action>
              </form>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

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
