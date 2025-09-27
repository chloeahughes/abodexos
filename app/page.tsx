// app/page.tsx
import { redirect } from "next/navigation";

// simplest: always send people to login (or integrations)
export default function Home() {
  // change to "/settings/integrations" if you prefer
  redirect("/login");
}


// If you prefer auth-aware redirect, use this version instead:
// tsx // import { redirect } from "next/navigation"; // import { cookies } from "next/headers"; // import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"; // // export const dynamic = "force-dynamic"; // // export default async function Home() { // const supabase = createServerComponentClient({ cookies }); // const { data: { user } } = await supabase.auth.getUser(); // if (!user) redirect("/login"); // redirect("/settings/integrations"); // } //