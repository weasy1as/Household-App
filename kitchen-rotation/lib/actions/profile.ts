"use server";

import { backendFetch } from "../backend";
import { createClient } from "../supabase/server";

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      success: false,
      error: "You must be logged in.",
      profile: null,
    };
  }

  try {
    const response = await backendFetch(`/api/profiles/${user.id}`);

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to get profile (${response.status}).`,
        profile: null,
      };
    }

    const profile = await response.json();

    return {
      success: true,
      error: null,
      profile,
    };
  } catch {
    return {
      success: false,
      error: "Could not connect to the backend.",
      profile: null,
    };
  }
}
