import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from("departments")
    .select("*")
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await request.json();
  const cleaned = (name ?? "").trim();
  if (!cleaned) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const db = getSupabaseAdmin();

  const { data, error } = await db
    .from("departments")
    .upsert({ name: cleaned }, { onConflict: "name" })
    .select("*")
    .single();

  if (!error) return NextResponse.json(data, { status: 201 });

  // Fallback: fetch existing by name
  const { data: existing, error: fetchErr } = await db
    .from("departments")
    .select("*")
    .eq("name", cleaned)
    .maybeSingle();

  if (!fetchErr && existing) return NextResponse.json(existing, { status: 200 });

  return NextResponse.json({ error: error.message }, { status: 500 });
}
