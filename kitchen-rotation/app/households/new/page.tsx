import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/actions/profile";
import NewHouseholdClient from "./NewHouseholdClient";

async function HouseholdPageContent() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <NewHouseholdClient
      displayName={profile.profile.displayName?.trim() || "Household member"}
    />
  );
}

export default function NewHouseholdPage() {
  return (
    <Suspense
      fallback={
        <main className="flex h-screen items-center justify-center bg-[#FAFBF8] px-5">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8EFE5] border-t-[#244C3A]" />
            <p className="mt-4 text-sm text-[#63806A]">
              Getting your account ready...
            </p>
          </div>
        </main>
      }
    >
      <HouseholdPageContent />
    </Suspense>
  );
}
