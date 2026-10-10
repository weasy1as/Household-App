"use server";

import { revalidatePath } from "next/cache";
import { backendFetch } from "@/lib/backend";

export type RotationSettingsState = {
  error?: string;
  success?: string;
};

export async function updateRotationSettings(
  householdId: string,
  _prevState: RotationSettingsState,
  formData: FormData,
): Promise<RotationSettingsState> {
  const startDate = formData.get("startDate");
  const startingMemberId = formData.get("startingMemberId");

  if (typeof startDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return { error: "Please choose a valid start date." };
  }

  if (typeof startingMemberId !== "string" || !startingMemberId.trim()) {
    return { error: "Please select the starting member." };
  }

  let response: Response;

  try {
    response = await backendFetch(
      `/api/households/${householdId}/rotation-settings`,
      {
        method: "PUT",
        body: JSON.stringify({
          startDate,
          startingMemberId,
        }),
      },
    );
  } catch {
    return {
      error: "Could not connect to the backend. Please try again.",
    };
  }

  if (!response.ok) {
    if (response.status === 401) {
      return { error: "Please sign in again." };
    }

    if (response.status === 403) {
      return { error: "Only the household owner can change these settings." };
    }

    if (response.status === 400) {
      return {
        error: "Invalid settings. Choose an active household member.",
      };
    }

    console.error("Updating rotation settings failed:", response.status);

    return {
      error: "Could not save rotation settings. Please try again.",
    };
  }

  revalidatePath(`/households/${householdId}`);

  return { success: "Rotation settings saved." };
}
