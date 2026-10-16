"use client";

import { useState } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { LoaderCircle, Trash2 } from "lucide-react";
import { deleteHousehold } from "@/lib/actions/households";

type DeleteHouseholdButtonProps = {
  householdId: string;
};

export default function DeleteHouseholdButton({
  householdId,
}: DeleteHouseholdButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function handleDelete() {
    setPending(true);
    setError(undefined);

    try {
      const result = await deleteHousehold(householdId, {});

      if (result.error) {
        setError(result.error);
        setPending(false);
        return;
      }

      window.location.assign("/dashboard");
    } catch (error) {
      console.error("Deleting household from the client failed:", error);
      setError("Could not delete household. Please try again.");
      setPending(false);
    }
  }

  return (
    <section className="rounded-3xl border border-[#F0D2D0] bg-[#FFF9F8] p-5 shadow-[0_2px_12px_rgba(31,45,33,0.025)] sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-[#7F302C]">Delete household</h2>
          <p className="mt-1 text-sm leading-6 text-[#8C5B57]">
            Permanently remove this household and its members. This action
            cannot be undone.
          </p>
        </div>

        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button
              type="button"
              disabled={pending}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#DFA6A2] bg-white px-4 py-2.5 text-sm font-semibold text-[#A0443F] transition hover:bg-[#FFF1EF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#A0443F]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
              Delete household
            </button>
          </AlertDialog.Trigger>

          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 z-50 bg-[#202A22]/45 backdrop-blur-[2px]" />
            <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#E7EAE2] bg-white p-6 shadow-2xl focus:outline-none sm:p-7">
              <AlertDialog.Title className="text-lg font-semibold text-[#202A22]">
                Delete this household?
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-2 text-sm leading-6 text-[#657064]">
                The household, its members, and rotation settings will be
                permanently deleted. This action cannot be undone.
              </AlertDialog.Description>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <AlertDialog.Cancel className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[#E1E5DE] bg-white px-4 py-2 text-sm font-semibold text-[#657064] transition hover:bg-[#F4F5F1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8A9485]/20">
                  Cancel
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={pending}
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-[#A0443F] bg-[#A0443F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#893A36] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#A0443F]/25 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {pending ? "Deleting..." : "Delete household"}
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}
