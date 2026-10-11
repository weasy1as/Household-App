import { Suspense } from "react";
import { redirect } from "next/navigation";
import { backendFetch } from "@/lib/backend";

async function DashboardContent() {
  let response: Response;

  try {
    response = await backendFetch("/api/households/me");
  } catch {
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
    const errorBody = await response.text();

    console.error("Household membership check failed:", {
      status: response.status,
      statusText: response.statusText,
      body: errorBody,
    });

    throw new Error(
      `Failed to check household membership: ${response.status} ${response.statusText}`,
    );
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

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="p-6">
          <p className="text-sm text-muted-foreground">
            Loading your dashboard...
          </p>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
