import "jsr:@supabase/functions-js/edge-runtime.d.ts";
// @ts-expect-error - JSR module, works at runtime in Deno
import { createClient } from "jsr:@supabase/supabase-js@2.47.0";

// Deno environment interface
interface DenoEnv {
  get(key: string): string | undefined;
}

interface DenoNamespace {
  env: DenoEnv;
  serve(handler: (req: Request) => Promise<Response>): void;
}

declare const Deno: DenoNamespace;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SyncUserRequest {
  auth_user_id?: string;
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  avatar_url?: string;
}

interface SyncUserResponse {
  user_id: string;
  email: string;
  role: "admin" | "creator" | "viewer";
  is_active: boolean;
  created: boolean;
  permissions: Array<{
    resource: string;
    action: string;
    can_perform: boolean;
  }>;
}

export const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Verify the JWT token
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const body: SyncUserRequest = await req.json();

    // Validate required fields
    if (!body.email || !body.name) {
      return new Response(
        JSON.stringify({ error: "Email and name are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({ error: `Invalid email format: ${body.email}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Use the authenticated user's ID
    const authUserId = user.id;

    // Call the sync function
    const { data: syncResult, error: syncError } = await supabase.rpc(
      "sync_user_from_b2c",
      {
        p_auth_user_id: authUserId,
        p_email: body.email.trim(),
        p_name: body.name.trim(),
        p_given_name: body.given_name?.trim() || null,
        p_family_name: body.family_name?.trim() || null,
        p_avatar_url: body.avatar_url?.trim() || null,
      },
    );

    if (syncError) {
      console.error("Sync error:", syncError);
      return new Response(JSON.stringify({ error: syncError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user permissions
    const { data: permissions, error: permError } = await supabase.rpc(
      "get_user_permissions",
      {
        p_auth_user_id: authUserId,
      },
    );

    if (permError) {
      console.error("Permission error:", permError);
      return new Response(JSON.stringify({ error: permError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Format response
    const response: SyncUserResponse = {
      user_id: syncResult[0].user_id,
      email: syncResult[0].email,
      role: syncResult[0].role,
      is_active: syncResult[0].is_active,
      created: syncResult[0].created,
      permissions: permissions || [],
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
};

Deno.serve(handler);
