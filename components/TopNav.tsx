import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";

export default async function TopNav() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <nav className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            AbodexOS
          </Link>
          <Link 
            href="/login?next=/deals" 
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Log in
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">
          AbodexOS
        </Link>
        <div className="flex items-center space-x-6">
          <Link 
            href="/deals" 
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Deals
          </Link>
          <Link 
            href="/settings/integrations" 
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            Settings
          </Link>
          <form action="/auth/signout" method="post">
            <button 
              type="submit"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
