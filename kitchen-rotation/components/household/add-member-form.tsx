"use client";

import { LoaderCircle, UserPlus } from "lucide-react";
import { useActionState } from "react";
import {
  addHouseholdMember,
  type AddMemberState,
} from "@/lib/actions/members";

type AddMemberFormProps = {
  householdId: string;
};

const initialState: AddMemberState = {};

export default function AddMemberForm({
  householdId,
}: AddMemberFormProps) {
  const action = addHouseholdMember.bind(null, householdId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <section className="rounded-3xl border border-[#E7EAE2] bg-white p-5 shadow-[0_2px_12px_rgba(31,45,33,0.025)] sm:p-7">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F0F4EC] text-[#315B40]">
          <UserPlus size={21} />
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[#202A22]">
            Add a member
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#7B847A]">
            Enter the email address of someone who already has an account.
          </p>
        </div>
      </div>

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="member-email"
            className="block text-sm font-semibold text-[#354737]"
          >
            Email address
          </label>
          <input
            id="member-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="person@example.com"
            disabled={pending}
            className="min-h-12 w-full rounded-xl border border-[#DFE5DA] bg-[#FAFBF8] px-3 py-3 text-base text-[#263329] outline-none transition placeholder:text-[#9AA398] focus:border-[#63866A] focus:ring-4 focus:ring-[#244C3A]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {state.error && (
          <p role="alert" className="text-sm leading-5 text-red-600">
            {state.error}
          </p>
        )}

        {state.success && (
          <p role="status" className="text-sm leading-5 text-[#35643C]">
            {state.success}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#315B40] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#244C3A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#315B40]/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {pending && <LoaderCircle size={16} className="animate-spin" />}
          {pending ? "Adding member..." : "Add member"}
        </button>
      </form>
    </section>
  );
}
