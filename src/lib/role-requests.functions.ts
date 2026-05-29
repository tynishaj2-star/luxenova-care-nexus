import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Signed-in user requests an elevated role (typically "staff"). */
export const requestRoleElevation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        requested_role: z.enum(["staff", "admin"]),
        message: z.string().trim().max(1000).optional().default(""),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Already has the role? bail.
    const { data: existingRole } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", data.requested_role)
      .maybeSingle();
    if (existingRole) throw new Error("You already have this role.");

    const { data: row, error } = await supabase
      .from("role_requests")
      .insert({
        user_id: userId,
        requested_role: data.requested_role,
        message: data.message || null,
      })
      .select("*")
      .single();
    if (error) {
      if (error.code === "23505") throw new Error("You already have a pending request for this role.");
      throw new Error(error.message);
    }
    return row;
  });

/** Current user's own role requests. */
export const listMyRoleRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("role_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
