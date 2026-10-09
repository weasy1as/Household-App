"use client";

import {
  createHousehold,
  CreateHouseholdState,
} from "@/lib/actions/households";
import { useActionState } from "react";

const initialState: CreateHouseholdState = {};

export default function NewHouseholdPage() {
  const [state, formAction, pending] = useActionState(
    createHousehold,
    initialState,
  );

  return (
    <main className="mx-auto w-full max-w-lg p-6">
      <h1 className="mb-2 text-2xl font-bold">Create a household</h1>

      <p className="mb-6 text-sm text-gray-600">
        Set up a household to start organizing your kitchen rotation.
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Household name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            placeholder="e.g. Our household"
            className="rounded-md border px-3 py-2"
            disabled={pending}
          />
        </div>

        {state.error && (
          <p role="alert" className="text-sm text-red-600">
            {state.error}
          </p>
        )}

        {state.success && (
          <p role="status" className="text-sm text-green-700">
            {state.success}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
        >
          {pending ? "Creating..." : "Create household"}
        </button>
      </form>
    </main>
  );
}
