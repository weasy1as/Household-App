"use client";

import {
  createHousehold,
  type CreateHouseholdState,
} from "@/lib/actions/households";
import { useActionState, useEffect } from "react";
import { House, Users, Clock, ArrowRight, Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

const initialState: CreateHouseholdState = {};

type NewHouseholdClientProps = {
  displayName: string;
};

export default function NewHouseholdClient({
  displayName,
}: NewHouseholdClientProps) {
  const router = useRouter();

  const [state, formAction, pending] = useActionState(
    createHousehold,
    initialState,
  );

  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state.redirectTo, router]);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Page introduction and account actions */}
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#244C3A]/10 text-[#244C3A]">
              <House size={22} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="truncate text-sm font-semibold text-foreground">
                {displayName}
              </p>
            </div>
          </div>

          <div className="flex  justify-center  items-center gap-4 mt-5">
            <LogOut size={16} />
            <LogoutButton />
          </div>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Find your household
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
          Create a shared space for your household, or wait for someone to add
          you to theirs. You can get started either way.
        </p>
      </div>

      <div className="space-y-5">
        {/* Create household */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#244C3A] to-[#163729] p-6 text-white shadow-sm sm:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/[0.06]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/[0.04]"
          />

          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <Plus size={24} strokeWidth={2} />
              </div>

              <div>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  Create a household
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-emerald-100/80">
                  Start your own household, organize your cleaning rotation, and
                  invite the people you live with.
                </p>
              </div>
            </div>

            <form action={formAction} className="mt-7 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-emerald-50"
                >
                  Household name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="e.g. Our household"
                  disabled={pending}
                  className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-emerald-100/50 focus:border-emerald-200 focus:ring-2 focus:ring-emerald-200/20 disabled:opacity-50"
                />
              </div>

              {state.error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-200/20 bg-red-500/10 p-3 text-sm text-red-100"
                >
                  {state.error}
                </p>
              )}

              {state.success && (
                <p
                  role="status"
                  className="rounded-xl border border-emerald-200/20 bg-emerald-500/10 p-3 text-sm text-emerald-50"
                >
                  {state.success}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#244C3A] transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#244C3A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? "Creating household..." : "Create household"}
                {!pending && <ArrowRight size={17} />}
              </button>
            </form>
          </div>
        </section>

        {/* Wait to be added */}
        <section className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-[#244C3A]/30 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#244C3A]/10 text-[#244C3A]">
              <Clock size={23} strokeWidth={1.8} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Wait to be added
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Someone else is setting up your household? You don't need to
                create another one. Wait until they invite you to join their
                shared space.
              </p>

              <div className="mt-4 flex items-start gap-3 rounded-xl bg-muted/60 p-3.5">
                <Users size={18} className="mt-0.5 shrink-0 text-[#244C3A]" />

                <p className="text-sm leading-5 text-muted-foreground">
                  Once you're invited, you can join their household and take
                  part in the cleaning rotation.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#244C3A] sm:w-auto"
              >
                I'll wait for an invitation
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
        No pressure. Choose the option that works best for you.
      </p>
    </main>
  );
}
