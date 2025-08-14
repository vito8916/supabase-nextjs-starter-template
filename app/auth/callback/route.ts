import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

/**
 * Handle Supabase OAuth callback. Exchanges the `code` for a session
 * and then redirects the user to the desired `next` path or dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/dashboard";

  if (error || error_description) {
    redirect(`/auth/error?error=${encodeURIComponent(error_description || error || "OAuth error")}`);
  }

  if (!code) {
    redirect("/auth/error?error=Missing%20OAuth%20code");
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    redirect(`/auth/error?error=${encodeURIComponent(exchangeError.message)}`);
  }

  redirect(next);
}

