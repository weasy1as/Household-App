"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  GripVertical,
  LoaderCircle,
} from "lucide-react";
import { useActionState, useState } from "react";
import {
  reorderHouseholdMembers,
  type ReorderMembersState,
} from "@/lib/actions/member-order";
import type { Member } from "@/components/household/members-list";

type MemberReorderFormProps = {
  householdId: string;
  members: Member[];
};

const initialState: ReorderMembersState = {};

export default function MemberReorderForm({
  householdId,
  members,
}: MemberReorderFormProps) {
  const initialMembers = [...members].sort(
    (a, b) => a.position - b.position,
  );
  const [orderedMembers, setOrderedMembers] = useState(initialMembers);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(
    reorderHouseholdMembers.bind(null, householdId),
    initialState,
  );

  const hasChanged = orderedMembers.some(
    (member, index) => member.id !== initialMembers[index]?.id,
  );

  function moveMember(memberId: string, direction: -1 | 1) {
    setOrderedMembers((currentMembers) => {
      const index = currentMembers.findIndex(
        (member) => member.id === memberId,
      );
      const nextIndex = index + direction;

      if (
        index < 0 ||
        nextIndex < 0 ||
        nextIndex >= currentMembers.length
      ) {
        return currentMembers;
      }

      const nextMembers = [...currentMembers];
      [nextMembers[index], nextMembers[nextIndex]] = [
        nextMembers[nextIndex],
        nextMembers[index],
      ];
      return nextMembers;
    });
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    setOrderedMembers((currentMembers) => {
      const sourceIndex = currentMembers.findIndex(
        (member) => member.id === draggedId,
      );
      const targetIndex = currentMembers.findIndex(
        (member) => member.id === targetId,
      );

      if (sourceIndex < 0 || targetIndex < 0) {
        return currentMembers;
      }

      const nextMembers = [...currentMembers];
      const [movedMember] = nextMembers.splice(sourceIndex, 1);
      nextMembers.splice(targetIndex, 0, movedMember);
      return nextMembers;
    });
    setDraggedId(null);
  }

  return (
    <form action={formAction} className="space-y-5">
      <input
        type="hidden"
        name="memberIds"
        value={JSON.stringify(orderedMembers.map((member) => member.id))}
      />

      <div className="rounded-3xl border border-[#E7EAE2] bg-white p-3 shadow-[0_2px_12px_rgba(31,45,33,0.025)] sm:p-5">
        <ol className="space-y-2">
          {orderedMembers.map((member, index) => {
            const name =
              member.displayName?.trim() || `Member ${member.position}`;

            return (
              <li
                key={member.id}
                draggable
                onDragStart={() => setDraggedId(member.id)}
                onDragEnd={() => setDraggedId(null)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => handleDrop(member.id)}
                className={`flex min-h-20 items-center gap-3 rounded-2xl border p-3 transition sm:gap-4 sm:p-4 ${
                  draggedId === member.id
                    ? "border-[#315B40] bg-[#EDF5E9] opacity-60"
                    : "border-[#E7EAE2] bg-[#FAFBF8]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8EFE5] text-sm font-semibold text-[#315B40]"
                >
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#263329] sm:text-base">
                    {name}
                  </p>
                  <p className="mt-1 text-xs text-[#879084]">
                    {member.active ? "Active" : "Inactive"} member
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveMember(member.id, -1)}
                    disabled={index === 0 || pending}
                    aria-label={`Move ${name} up`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#637064] transition hover:bg-[#EAF1E7] hover:text-[#315B40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315B40] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowUp size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveMember(member.id, 1)}
                    disabled={index === orderedMembers.length - 1 || pending}
                    aria-label={`Move ${name} down`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#637064] transition hover:bg-[#EAF1E7] hover:text-[#315B40] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315B40] disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ArrowDown size={18} />
                  </button>
                  <span
                    title="Drag to reorder"
                    aria-label={`Drag ${name} to reorder`}
                    className="flex h-10 w-10 cursor-grab items-center justify-center rounded-xl text-[#879084] active:cursor-grabbing"
                  >
                    <GripVertical size={20} />
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {state.error && (
        <p role="alert" className="text-sm leading-5 text-red-600">
          {state.error}
        </p>
      )}

      {state.success && (
        <div
          role="status"
          className="rounded-2xl border border-[#CFE0CA] bg-[#EDF5E9] p-4 text-sm text-[#35643C]"
        >
          <p>{state.success}</p>
          <Link
            href={`/households/${householdId}/members`}
            className="mt-2 inline-flex items-center gap-1 font-semibold underline underline-offset-2"
          >
            <ArrowLeft size={15} />
            Back to manage members
          </Link>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link
          href={`/households/${householdId}/members`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#DFE5DA] px-4 py-2.5 text-sm font-semibold text-[#526254] transition hover:bg-[#F4F6F1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315B40]"
        >
          <ArrowLeft size={16} />
          Manage members
        </Link>
        <button
          type="submit"
          disabled={!hasChanged || pending}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#315B40] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#244C3A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#315B40]/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending && <LoaderCircle size={16} className="animate-spin" />}
          {pending ? "Saving..." : "Save order"}
        </button>
      </div>
    </form>
  );
}
