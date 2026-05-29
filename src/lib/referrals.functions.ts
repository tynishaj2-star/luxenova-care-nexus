import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const referralInput = z.object({
  household: z.string().trim().min(2).max(200),
  primary_barrier: z.string().trim().min(2).max(200),
  zip: z.string().trim().max(20).optional().default(""),
  urgency: z.enum(["Routine", "Priority", "Urgent"]),
  submitter_name: z.string().trim().max(200).optional().default(""),
  submitter_org: z.string().trim().max(200).optional().default(""),
  notes_intake: z.string().trim().max(4000).optional().default(""),
});

const statusEnum = z.enum([
  "New",
  "In Review",
  "Awaiting Documents",
  "Navigator Assigned",
  "Relief Delivered",
  "Closed",
  "Missing Documents",
  "Partner Referral Needed",
  "Food / Essentials Support",
  "Sponsor Match Needed",
  "Completed",
]);

export const listReferrals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("referrals")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getReferral = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const [{ data: referral, error: rErr }, { data: notes, error: nErr }] = await Promise.all([
      supabase.from("referrals").select("*").eq("id", data.id).maybeSingle(),
      supabase
        .from("referral_notes")
        .select("*")
        .eq("referral_id", data.id)
        .order("created_at", { ascending: false }),
    ]);
    if (rErr) throw new Error(rErr.message);
    if (nErr) throw new Error(nErr.message);
    if (!referral) throw new Error("Referral not found");
    return { referral, notes: notes ?? [] };
  });

export const createReferral = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => referralInput.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("referrals")
      .insert({
        created_by: userId,
        household: data.household,
        primary_barrier: data.primary_barrier,
        zip: data.zip || null,
        urgency: data.urgency,
        submitter_name: data.submitter_name || null,
        submitter_org: data.submitter_org || null,
        notes_intake: data.notes_intake || null,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    if (data.notes_intake?.trim()) {
      await supabase.from("referral_notes").insert({
        referral_id: row.id,
        author_id: userId,
        body: data.notes_intake.trim(),
      });
    }
    return row;
  });

export const updateReferralStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), status: statusEnum }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Server-side authorization: only staff or admin can change referral status.
    // The UI hides controls, but partners could otherwise POST directly here and
    // mark their own referrals as "Relief Delivered" / "Completed".
    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .in("role", ["staff", "admin"])
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden: staff or admin role required");

    const { error } = await supabase
      .from("referrals")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    await supabase.from("referral_notes").insert({
      referral_id: data.id,
      author_id: userId,
      body: `Status changed to "${data.status}".`,
      is_system: true,
    });
    return { ok: true };
  });

export const addReferralNote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({ id: z.string().uuid(), body: z.string().trim().min(1).max(4000) })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row, error } = await supabase
      .from("referral_notes")
      .insert({ referral_id: data.id, author_id: userId, body: data.body })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    // bump referral updated_at
    await supabase
      .from("referrals")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", data.id);

    return row;
  });

export const getCurrentProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    const roleList = roles?.map((r) => r.role) ?? [];
    return {
      profile,
      isStaff: roleList.includes("staff"),
      isAdmin: roleList.includes("admin"),
      roles: roleList,
    };
  });
