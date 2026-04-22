import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdminAuth, requireServiceRoleConfigured } from "../_utils";

export async function GET(request: Request) {
  const unauthorized = await requireAdminAuth(request);
  if (unauthorized) return unauthorized;
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const { data, error } = await getSupabaseAdmin()
    .from("interviews")
    .select("*")
    .order("scheduled_date", { ascending: false });

  if (error) {
    console.error("[admin/interviews] list failed", error);
    return NextResponse.json({ interviews: [] });
  }

  return NextResponse.json({ interviews: data ?? [] });
}

