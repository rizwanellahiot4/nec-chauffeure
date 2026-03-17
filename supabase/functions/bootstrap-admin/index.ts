import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const adminEmail = Deno.env.get("ADMIN_BOOTSTRAP_EMAIL") ?? "";
    const adminPassword = Deno.env.get("ADMIN_BOOTSTRAP_PASSWORD") ?? "";

    if (!supabaseUrl || !serviceRoleKey || !adminEmail || !adminPassword) {
      return new Response(JSON.stringify({ error: "Missing bootstrap configuration" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    let userId: string | null = null;
    const existingUsers = await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const existingUser = existingUsers.data.users.find((user) => user.email?.toLowerCase() === adminEmail.toLowerCase());

    if (existingUser) {
      userId = existingUser.id;
      const updateResult = await adminClient.auth.admin.updateUserById(existingUser.id, {
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });

      if (updateResult.error) {
        throw updateResult.error;
      }
    } else {
      const createResult = await adminClient.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      });

      if (createResult.error) {
        throw createResult.error;
      }

      userId = createResult.data.user.id;
    }

    if (!userId) {
      throw new Error("Unable to resolve admin user");
    }

    const roleResult = await adminClient
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

    if (roleResult.error) {
      throw roleResult.error;
    }

    return new Response(JSON.stringify({ success: true, email: adminEmail }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});