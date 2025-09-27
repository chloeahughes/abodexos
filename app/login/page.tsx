import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import LoginForm from "./signin-client";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams?: { next?: string }}) {
  const nextPath = searchParams?.next || "/settings/integrations";
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect(nextPath);
  return <LoginForm nextPath={nextPath} />;
}