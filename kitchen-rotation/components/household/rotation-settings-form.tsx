"use client";

import { useActionState } from "react";
import { CalendarDays, CheckCircle2, Settings2, Users } from "lucide-react";
import {
  updateRotationSettings,
  type RotationSettingsState,
} from "@/lib/actions/rotation-settings";

type Member = {
  id: string;
  position: number;
  active: boolean;
  displayName?: string;
};

type RotationSettingsFormProps = {
  householdId: string;
  members: Member[];
  rotationStartDate: string | null;
  rotationStartMemberId: string | null;
};

const initialState: RotationSettingsState = {};

export default function RotationSettingsForm({
  householdId,
  members,
  rotationStartDate,
  rotationStartMemberId,
}: RotationSettingsFormProps) {
  const action = updateRotationSettings.bind(null, householdId);

  const [state, formAction, pending] = useActionState(action, initialState);

  const activeMembers = members
    .filter((member) => member.active)
    .sort((a, b) => a.position - b.position);

  return (
    <section className="rounded-3xl border border-[#E7EAE2] bg-white p-5 shadow-[0_2px_12px_rgba(31,45,33,0.025)] sm:p-7">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F0F4EC] text-[#315B40]">
          <Settings2 size={21} />
        </div>

        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[#202A22]">
            Rotation settings
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#7B847A]">
            Choose when your rotation begins and who takes the first turn.
          </p>
        </div>
      </div>

      {activeMembers.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-[#DCE3D8] bg-[#FAFBF8] p-5">
          <Users size={23} className="text-[#879487]" />

          <p className="mt-3 font-semibold text-[#354737]">No active members</p>

          <p className="mt-1 text-sm leading-6 text-[#7B847A]">
            Activate at least one household member before configuring the
            rotation.
          </p>
        </div>
      ) : (
        <form action={formAction} className="mt-6 space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="startDate"
              className="block text-sm font-semibold text-[#354737]"
            >
              Rotation start date
            </label>

            <div className="relative">
              <CalendarDays
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B8B79]"
              />

              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                defaultValue={rotationStartDate?.slice(0, 10) ?? ""}
                disabled={pending}
                className="min-h-12 w-full rounded-xl border border-[#DFE5DA] bg-[#FAFBF8] py-3 pl-11 pr-3 text-base text-[#263329] outline-none transition focus:border-[#63866A] focus:ring-4 focus:ring-[#244C3A]/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <p className="text-xs leading-5 text-[#879084]">
              The first day of your repeating household rotation.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="startingMemberId"
              className="block text-sm font-semibold text-[#354737]"
            >
              Who goes first?
            </label>

            <div className="relative">
              <Users
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7B8B79]"
              />

              <select
                id="startingMemberId"
                name="startingMemberId"
                required
                defaultValue={rotationStartMemberId ?? ""}
                disabled={pending}
                className="min-h-12 w-full appearance-none rounded-xl border border-[#DFE5DA] bg-[#FAFBF8] py-3 pl-11 pr-10 text-base text-[#263329] outline-none transition focus:border-[#63866A] focus:ring-4 focus:ring-[#244C3A]/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" disabled>
                  Choose a household member
                </option>

                {activeMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.displayName?.trim() || `Member ${member.position}`}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs leading-5 text-[#879084]">
              Only active household members can be selected.
            </p>
          </div>

          {state.error && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-5 text-red-700"
            >
              {state.error}
            </div>
          )}

          {state.success && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl border border-[#D6E5D3] bg-[#F0F5EC] p-3 text-sm leading-5 text-[#315B40]"
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>{state.success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#244C3A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1B3D2D] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#244C3A]/20 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {pending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Saving settings...
              </>
            ) : (
              <>
                <CheckCircle2 size={17} />
                Save rotation
              </>
            )}
          </button>
        </form>
      )}
    </section>
  );
}
