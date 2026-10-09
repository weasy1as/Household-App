import { redirect } from "next/navigation";
import { InfoIcon } from "lucide-react";
import { Suspense } from "react";

import { createClient } from "@/lib/supabase/server";
import { backendFetch } from "@/lib/backend";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";

async function UserDetails() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
      {JSON.stringify(data.claims, null, 2)}
    </pre>
  );
}

async function BackendUserDetails() {
  const response = await backendFetch("/api/auth/me");

  if (response.status === 401) {
    return <p>Backend rejected the access token (401).</p>;
  }

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  const user = await response.json();

  return <p>Backend authenticated user ID: {user.userId}</p>;
}

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user.
        </div>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Your user details</h2>
        <Suspense fallback={<p>Loading user details...</p>}>
          <UserDetails />
        </Suspense>
      </div>

      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-bold text-2xl mb-4">Spring Boot connection</h2>
        <Suspense fallback={<p>Connecting to backend...</p>}>
          <BackendUserDetails />
        </Suspense>
      </div>

      <FetchDataSteps />
    </div>
  );
}
