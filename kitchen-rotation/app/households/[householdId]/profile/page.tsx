import { redirect } from "next/navigation";
import { getProfile } from "@/lib/actions/profile";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

type Props = {
  params: Promise<{ householdId: string }>;
};

export default async function ProfilePage({ params }: Props) {
  await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const result = await getProfile();

  if (!result.success || !result.profile) {
    throw new Error(result.error ?? "Could not load your profile.");
  }

  return (
    <main className="min-h-screen bg-[#F7F8F4] px-4 py-5 text-[#202A22] sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl space-y-5 sm:space-y-7">
        <header className="rounded-3xl bg-gradient-to-br from-[#244C3A] to-[#163729] p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm font-medium text-emerald-100">Your account</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Profile
          </h1>
          <p className="mt-2 text-sm leading-6 text-emerald-100/80">
            View your account details and manage your session.
          </p>
        </header>

        <section
          aria-labelledby="profile-details-heading"
          className="rounded-3xl border border-[#E5E9E1] bg-white p-6 shadow-sm sm:p-8"
        >
          <h2
            id="profile-details-heading"
            className="text-lg font-semibold text-[#244C3A]"
          >
            Account details
          </h2>

          <dl className="mt-5 divide-y divide-[#E5E9E1]">
            <div className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-sm font-medium text-[#858D82]">Name</dt>
              <dd className="text-sm font-semibold text-[#202A22]">
                {result.profile.displayName}
              </dd>
            </div>
            <div className="flex flex-col gap-1 py-4 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <dt className="text-sm font-medium text-[#858D82]">Email</dt>
              <dd className="break-all text-sm font-semibold text-[#202A22]">
                {user.email}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-[#E5E9E1] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-[#244C3A]">Session</h2>
          <p className="mt-2 text-sm leading-6 text-[#687267]">
            Sign out of this account on this device.
          </p>
          <div className="mt-5">
            <LogoutButton />
          </div>
        </section>
      </div>
    </main>
  );
}
