import { getProfile } from "@/lib/actions/profile";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const profile = await getProfile();

  console.log("profile:", profile);

  return <div>hello</div>;
}
