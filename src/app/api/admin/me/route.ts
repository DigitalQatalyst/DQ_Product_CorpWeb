import { NextRequest, NextResponse } from "next/server";
import { getAdminUserId } from "@/lib/api-admin-auth";

/**
 * GET /api/admin/me
 * Used by LoginPage to verify the signed-in user has admin role.
 * Accepts both cookie session and Bearer token.
 */
export async function GET(request: NextRequest) {
  const userId = await getAdminUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
