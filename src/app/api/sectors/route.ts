import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: groups, error: groupsError } = await supabase
    .from("sector_groups")
    .select("*")
    .order("sort_order", { ascending: true });

  if (groupsError) return NextResponse.json({ error: groupsError.message }, { status: 500 });

  const { data: sectors, error: sectorsError } = await supabase
    .from("sectors")
    .select("id, slug, name, subtitle, icon_name, sector_group_id, sort_order")
    .order("sort_order", { ascending: true });

  if (sectorsError) return NextResponse.json({ error: sectorsError.message }, { status: 500 });

  const result = (groups ?? []).map((group) => ({
    ...group,
    items: (sectors ?? []).filter((s) => s.sector_group_id === group.id),
  }));

  return NextResponse.json(result);
}
