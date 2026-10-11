import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export const instant = false;

export default async function HomePage(): Promise<never> {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!error && user) {
    redirect("/dashboard");
  }

  redirect("/auth/login");
}
