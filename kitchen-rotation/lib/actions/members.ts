"use server";

import { revalidatePath } from "next/cache";
import { backendFetch } from "@/lib/backend";

export type AddMemberState = {
  error?: string;
  success?: string;
};

export type DeleteMemberState = {
  error?: string;
  success?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function addHouseholdMember(
  householdId: string,
  _previousState: AddMemberState,
  formData: FormData,
): Promise<AddMemberState> {
  const email = formData.get("email");

  if (
    typeof email !== "string" ||
    !email.trim() ||
    !emailPattern.test(email.trim())
  ) {
    return { error: "Please enter a valid email address." };
  }

  let response: Response;

  try {
    response = await backendFetch(`/api/households/${householdId}/members`, {
      method: "POST",
      body: JSON.stringify({ email: email.trim() }),
    });
  } catch (error) {
    console.error("Adding household member request failed:", error);
    return {
      error: "Could not connect to the backend. Please try again.",
    };
  }

  if (!response.ok) {
    if (response.status === 400) {
      return { error: "Please enter a valid email address." };
    }

    if (response.status === 401) {
      return { error: "Please sign in again." };
    }

    if (response.status === 404) {
      return {
        error: "We could not find a registered user with that email address.",
      };
    }

    if (response.status === 409) {
      return { error: "That user already belongs to a household." };
    }

    console.error("Adding household member failed:", response.status);
    return { error: "Could not add household member. Please try again." };
  }

  revalidatePath(`/households/${householdId}`);
  revalidatePath(`/households/${householdId}/members`);

  return { success: "Member added successfully." };
}

export async function deleteHouseholdMember(
  householdId: string,
  memberId: string,
  _previousState: DeleteMemberState,
): Promise<DeleteMemberState> {
  let response: Response;

  try {
    response = await backendFetch(
      `/api/households/${householdId}/members/${memberId}`,
      {
        method: "DELETE",
      },
    );
  } catch (error) {
    console.error("Deleting household member request failed:", error);
    return {
      error: "Could not connect to the backend. Please try again.",
    };
  }

  if (!response.ok) {
    if (response.status === 401) {
      return { error: "Please sign in again." };
    }

    if (response.status === 404) {
      return { error: "Household member not found." };
    }

    console.error("Deleting household member failed:", response.status);
    return { error: "Could not delete household member. Please try again." };
  }

  revalidatePath(`/households/${householdId}`);
  revalidatePath(`/households/${householdId}/members`);

  return { success: "Member deleted successfully." };
}
