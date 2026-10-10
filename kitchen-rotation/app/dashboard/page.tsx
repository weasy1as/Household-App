import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/backend";

export default async function DashboardPage() {
  let response: Response;

  try {
    response = await backendFetch("/api/households/me");
  } catch {
    // Do not assume the user is signed out just because
    // the backend could not be reached.
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">Unable to load your dashboard</h1>
        <p className="mt-2">Please try again in a moment.</p>
      </main>
    );
  }

  if (response.status === 401) {
    redirect("/auth/login");
  }

  if (!response.ok && response.status !== 204) {
    throw new Error("Failed to check household membership.");
  }

  if (response.status === 204) {
    redirect("/households/new");
  }

  const { householdId } = await response.json();

  if (!householdId) {
    throw new Error("The backend did not return a household ID.");
  }

  redirect(`/households/${householdId}`);
}
