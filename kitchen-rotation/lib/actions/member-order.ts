"use server";

import { revalidatePath } from "next/cache";
import { backendFetch } from "@/lib/backend";

export type ReorderMembersState = {
  error?: string;
  success?: string;
};

export async function reorderHouseholdMembers(
  householdId: string,
  _previousState: ReorderMembersState,
  formData: FormData,
): Promise<ReorderMembersState> {
  const memberIdsValue = formData.get("memberIds");

  if (typeof memberIdsValue !== "string") {
    return { error: "Please provide a valid member order." };
  }

  let memberIds: unknown;

  try {
    memberIds = JSON.parse(memberIdsValue);
  } catch {
    return { error: "Please provide a valid member order." };
  }

  if (
    !Array.isArray(memberIds) ||
    memberIds.length === 0 ||
    memberIds.some(
      (memberId): memberId is unknown =>
        typeof memberId !== "string" || !memberId.trim(),
    )
  ) {
    return { error: "Please provide a valid member order." };
  }

  let response: Response;

  try {
    response = await backendFetch(
      `/api/households/${householdId}/members/order`,
      {
        method: "PUT",
        body: JSON.stringify({ memberIds }),
      },
    );
  } catch (error) {
    console.error("Reordering household members request failed:", error);
    return {
      error: "Could not connect to the backend. Please try again.",
    };
  }

  if (!response.ok) {
    if (response.status === 400) {
      return {
        error: "The order must include every household member exactly once.",
      };
    }

    if (response.status === 401) {
      return { error: "Please sign in again." };
    }

    if (response.status === 403) {
      return { error: "Only the household owner can reorder members." };
    }

    if (response.status === 404) {
      return { error: "Household not found." };
    }

    console.error("Reordering household members failed:", response.status);
    return { error: "Could not update rotation order. Please try again." };
  }

  revalidatePath(`/households/${householdId}`);
  revalidatePath(`/households/${householdId}/members`);
  revalidatePath(`/households/${householdId}/members/reorder`);

  return { success: "Rotation order updated." };
}
