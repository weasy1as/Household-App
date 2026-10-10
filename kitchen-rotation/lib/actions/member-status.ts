"use server";

import { revalidatePath } from "next/cache";
import { backendFetch } from "@/lib/backend";

export type MemberStatusState = {
  error?: string;
  success?: string;
};

export async function updateMemberStatus(
  householdId: string,
  memberId: string,
  active: boolean,
  _previousState: MemberStatusState,
): Promise<MemberStatusState> {
  if (typeof active !== "boolean") {
    return { error: "Member status must be active or inactive." };
  }

  let response: Response;

  try {
    response = await backendFetch(
      `/api/households/${householdId}/members/${memberId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ active }),
      },
    );
  } catch (error) {
    console.error("Updating member status request failed:", error);
    return {
      error: "Could not connect to the backend. Please try again.",
    };
  }

  if (!response.ok) {
    if (response.status === 400) {
      return { error: "Member status must be active or inactive." };
    }

    if (response.status === 401) {
      return { error: "Please sign in again." };
    }

    if (response.status === 404) {
      return { error: "Household member not found." };
    }

    console.error("Updating member status failed:", response.status);
    return { error: "Could not update member status. Please try again." };
  }

  revalidatePath(`/households/${householdId}`);
  revalidatePath(`/households/${householdId}/members`);

  return { success: `Member marked ${active ? "active" : "inactive"}.` };
}
