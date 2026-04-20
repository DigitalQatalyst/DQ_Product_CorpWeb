import { NextResponse } from "next/server";
import { authenticateAdminRequest, requireServiceRoleConfigured } from "../_utils";

/**
 * Used by the admin shell to confirm the signed-in user is allowlisted before showing the dashboard.
 */
export async function GET(request: Request) {
  const missingKey = requireServiceRoleConfigured();
  if (missingKey) return missingKey;

  const result = await authenticateAdminRequest(request);
  if (!result.ok) return result.response;

  return NextResponse.json({ ok: true as const });
}
