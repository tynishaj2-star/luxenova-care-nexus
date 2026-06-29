import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const roleEnum = z.enum(["partner", "staff", "admin"]);

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: admin role required");
}

/** Admin invites a new partner/staff by email — uses Supabase admin API. */
export const inviteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        email: z.string().trim().email().max(255),
        full_name: z.string().trim().max(120).optional().default(""),
        organization: z.string().trim().max(120).optional().default(""),
        role: roleEnum.default("partner"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const redirectTo = `${process.env.SITE_URL ?? ""}/reset-password`;
    const { data: invited, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      data.email,
      {
        data: { full_name: data.full_name, organization: data.organization },
        redirectTo: redirectTo || undefined,
      },
    );
    if (error) throw new Error(error.message);

    // If admin/staff requested, upsert that role (the trigger always adds 'partner').
    if (invited?.user && data.role !== "partner") {
      await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: invited.user.id, role: data.role })
        .select();
    }
    return { ok: true, email: data.email };
  });

/**
 * Admin creates an employee account directly with a temporary password.
 * Returns the temp password ONCE so the admin can hand it to the employee.
 * The employee is forced to change it on first login.
 */
export const createEmployeeAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        email: z.string().trim().email().max(255),
        full_name: z.string().trim().max(120).optional().default(""),
        organization: z.string().trim().max(120).optional().default("LuxeNova Community Wellness, Inc."),
        role: z.enum(["staff", "admin"]).default("staff"),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    // Generate a cryptographically random temp password (16 chars, mixed)
    const alphabet =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const tempPassword = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: data.full_name,
        organization: data.organization,
      },
    });
    if (error) throw new Error(error.message);
    const newUser = created?.user;
    if (!newUser) throw new Error("Account could not be created.");

    // Grant requested role (trigger always adds 'partner' — we add the elevated one too)
    await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newUser.id, role: data.role })
      .select();

    // Force password change on first login
    await supabaseAdmin
      .from("profiles")
      .update({ must_change_password: true })
      .eq("id", newUser.id);

    return {
      ok: true,
      email: data.email,
      temp_password: tempPassword,
      role: data.role,
    };
  });

/** Called by the user after they successfully update their password client-side. */
export const markPasswordChanged = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ must_change_password: false })
      .eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Admin: list pending + recent role-elevation requests with submitter info. */
export const listRoleRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: reqs, error } = await supabaseAdmin
      .from("role_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);

    const userIds = Array.from(new Set((reqs ?? []).map((r) => r.user_id)));
    const { data: profiles } = userIds.length
      ? await supabaseAdmin.from("profiles").select("id, full_name, organization").in("id", userIds)
      : { data: [] as any[] };
    const map = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    return (reqs ?? []).map((r) => ({ ...r, profile: map.get(r.user_id) ?? null }));
  });

/** Admin: approve or deny a role request. Approval grants the requested role. */
export const decideRoleRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        decision: z.enum(["approved", "denied"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);

    const { data: req, error: rErr } = await supabaseAdmin
      .from("role_requests")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (rErr) throw new Error(rErr.message);
    if (!req) throw new Error("Request not found");
    if (req.status !== "pending") throw new Error("Request already decided");

    if (data.decision === "approved") {
      await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: req.user_id, role: req.requested_role })
        .select();
    }

    const { error: uErr } = await supabaseAdmin
      .from("role_requests")
      .update({
        status: data.decision,
        decided_by: context.userId,
        decided_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (uErr) throw new Error(uErr.message);

    return { ok: true };
  });
