import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getSafeInternalPath } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  if (!hasSupabaseEnv()) {
    return NextResponse.redirect(new URL("/?auth=1", requestUrl.origin));
  }

  const code = requestUrl.searchParams.get("code");
  const next = getSafeInternalPath(requestUrl.searchParams.get("next"));
  const intent = requestUrl.searchParams.get("intent");

  const resumeUrl = new URL(next, requestUrl.origin);
  resumeUrl.searchParams.set("auth", "1");
  if (intent) {
    resumeUrl.searchParams.set("intent", intent);
  }

  if (!code) {
    return NextResponse.redirect(new URL(`/?auth=1&next=${encodeURIComponent(next)}${intent ? `&intent=${encodeURIComponent(intent)}` : ""}`, requestUrl.origin));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL(`/?auth=1&next=${encodeURIComponent(next)}${intent ? `&intent=${encodeURIComponent(intent)}` : ""}`, requestUrl.origin));
  }

  return NextResponse.redirect(resumeUrl);
}
