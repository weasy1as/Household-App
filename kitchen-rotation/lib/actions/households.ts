"use server";
import { backendFetch } from "@/lib/backend";
import { revalidatePath } from "next/cache";

export type CreateHouseholdState = {
  error?: string;
  success?: string;
  redirectTo?: string;
};

export async function createHousehold(
  _prevState: CreateHouseholdState,
  formData: FormData,
): Promise<CreateHouseholdState> {
  const name = formData.get("name");

  if (typeof name !== "string" || !name.trim()) {
    return { error: "Please enter a household name." };
  }

  if (name.trim().length > 100) {
    return { error: "Household name must be 100 characters or fewer." };
  }

  try {
    const response = await backendFetch("/api/households", {
      method: "POST",
      body: JSON.stringify({ name: name.trim() }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { error: "Your session has expired. Please sign in again." };
      }

      const message = await response.text();
      console.error("Household creation failed:", response.status, message);

      return { error: "Could not create household. Please try again." };
    }

    return {
      success: "Household created successfully!",
      redirectTo: "/dashboard",
    };
  } catch (error) {
    console.error("Household creation request failed:", error);
    return {
      error: "Could not connect to the backend. Please try again.",
    };
  }
}

export async function getHousehold(householdId: string) {
  const response = await backendFetch(`/api/households/${householdId}`);
  if (!response.ok) {
    throw new Error("Failed to load the household.");
  }
  return response.json();
}

export type DeleteHouseholdState = {
  error?: string;
  success?: boolean;
};

export async function deleteHousehold(
  householdId: string,
  _previousState: DeleteHouseholdState,
): Promise<DeleteHouseholdState> {
  void _previousState;

  let response: Response;

  try {
    response = await backendFetch(`/api/households/${householdId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Deleting household request failed:", error);
    return {
      error: "Could not connect to the backend. Please try again.",
    };
  }

  if (!response.ok) {
    if (response.status === 401) {
      return { error: "Please sign in again." };
    }

    if (response.status === 403) {
      return { error: "Only the household owner can delete this household." };
    }

    if (response.status === 404) {
      return { error: "Household not found." };
    }

    console.error("Deleting household failed:", response.status);
    return { error: "Could not delete household. Please try again." };
  }

  revalidatePath("/households/new");

  return { success: true };
}
