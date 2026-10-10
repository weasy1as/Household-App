"use client";

import { useActionState } from "react";
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
    <section className="rounded-lg border p-5">
      <h2 className="text-lg font-semibold">Rotation settings</h2>

      <p className="mt-1 text-sm text-gray-600">
        Choose when the cooking rotation starts and who cooks first.
      </p>

      {activeMembers.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600">
          You need an active household member to configure the rotation.
        </p>
      ) : (
        <form action={formAction} className="mt-4 space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Start date
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              defaultValue={rotationStartDate ?? ""}
              disabled={pending}
              className="rounded-md border px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="startingMemberId" className="text-sm font-medium">
              Starting member
            </label>

            <select
              id="startingMemberId"
              name="startingMemberId"
              required
              defaultValue={rotationStartMemberId ?? ""}
              disabled={pending}
              className="rounded-md border px-3 py-2"
            >
              <option value="" disabled>
                Choose a member
              </option>

              {activeMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.displayName ?? `Member ${member.position}`}
                </option>
              ))}
            </select>
          </div>

          {state.error && (
            <p role="alert" className="text-sm text-red-600">
              {state.error}
            </p>
          )}

          {state.success && (
            <p role="status" className="text-sm text-green-700">
              {state.success}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save settings"}
          </button>
        </form>
      )}
    </section>
  );
}
