import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Params = Promise<{ id: string }>;

export async function PUT(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const input = await request.json();
  const db = getSupabaseAdmin();

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.title !== undefined) patch.title = input.title;
  if (input.description !== undefined) patch.description = input.description;
  if (input.provider !== undefined) patch.provider = input.provider;
  if (input.category !== undefined) patch.category = input.category;
  if (input.tags !== undefined) patch.tags = input.tags;
  if (input.serviceCategory !== undefined) patch.service_category = input.serviceCategory;
  if (input.serviceAvailability !== undefined) patch.service_availability = input.serviceAvailability;
  if (input.serviceReadiness !== undefined) patch.service_readiness = input.serviceReadiness;
  if (input.duration !== undefined) patch.duration = input.duration;
  if (input.overview !== undefined) patch.overview = input.overview;
  if (input.deliveryStages !== undefined) patch.delivery_stages = input.deliveryStages;
  if (input.deliverables !== undefined) patch.deliverables = input.deliverables;
  if (input.requiredInputs !== undefined) patch.required_inputs = input.requiredInputs;
  if (input.isPublished !== undefined) patch.is_published = input.isPublished;
  if (input.sortOrder !== undefined) patch.sort_order = input.sortOrder;

  const { data, error } = await db
    .from("services")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await getSupabaseAdmin().from("services").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
