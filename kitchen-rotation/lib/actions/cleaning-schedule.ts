import { backendFetch } from "@/lib/backend";

export type CleaningDay = {
  date: string;
  memberId: string;
  userId: string;
  displayName: string;
  position: number;
};

export async function getCleaningSchedule(
  householdId: string,
  days = 7,
): Promise<CleaningDay[]> {
  const response = await backendFetch(
    `/api/households/${householdId}/schedule?days=${days}`,
  );

  if (!response.ok) {
    const details = await response.text();

    console.error("Cleaning schedule request failed:", {
      status: response.status,
      details,
    });

    throw new Error(`Failed to load cleaning schedule (${response.status}).`);
  }

  return response.json();
}
