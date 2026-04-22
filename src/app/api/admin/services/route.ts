import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const input = await request.json();
  const { data, error } = await getSupabaseAdmin()
    .from("services")
    .insert({
      id: input.id,
      title: input.title,
      description: input.description,
      provider: input.provider,
      category: input.category,
      tags: input.tags,
      service_category: input.serviceCategory,
      service_availability: input.serviceAvailability,
      service_readiness: input.serviceReadiness,
      duration: input.duration,
      overview: input.overview,
      delivery_stages: input.deliveryStages,
      deliverables: input.deliverables,
      required_inputs: input.requiredInputs,
      is_published: input.isPublished,
      sort_order: input.sortOrder ?? 0,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
