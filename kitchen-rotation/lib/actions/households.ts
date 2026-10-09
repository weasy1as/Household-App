"use server";

import { backendFetch } from "@/lib/backend";

export type CreateHouseholdState = {
  error?: string;
  success?: string;
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

    return { success: "Household created successfully!" };
  } catch (error) {
    console.error("Household creation request failed:", error);
    return {
      error: "Could not connect to the backend. Please try again.",
    };
  }
}
