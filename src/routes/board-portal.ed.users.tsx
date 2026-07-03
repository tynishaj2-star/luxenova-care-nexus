import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { Search, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/board-portal/ed/users")({
  head: () => ({ meta: [{ title: "User Management — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: UsersPage,
});

type Profile = { id: string; full_name: string | null; organization: string | null };
type Role = { user_id: string; role: string };
const ALL_ROLES = ["admin", "staff", "board", "partner"] as const;

function UsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [q, setQ] = useState("");
  const [pending, setPending] = useState<{ user_id: string; role: string } | null>(null);

  async function load() {
    const [p, r] = await Promise.all([
      supabase.from("profiles").select("id,full_name,organization"),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    setProfiles((p.data as Profile[]) ?? []);
    setRoles((r.data as Role[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function addRole(user_id: string, role: string) {
    await supabase.from("user_roles").insert({ user_id, role });
    load();
  }
  async function removeRole(user_id: string, role: string) {
    if (!confirm(`Remove role "${role}"?`)) return;
    await supabase.from("user_roles").delete().eq("user_id", user_id).eq("role", role);
    load();
  }

  const rolesByUser = roles.reduce<Record<string, string[]>>((acc, r) => {
    (acc[r.user_id] ??= []).push(r.role); return acc;
  }, {});

  const filtered = profiles.filter((p) => !q || (p.full_name ?? "").toLowerCase().includes(q.toLowerCase()));

  return (
    <WorkspacePage title="User Management" subtitle="Assign or revoke portal roles for every registered user.">
      <DataCard>
        <div className="mb-4 flex items-center gap-2"><Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" /></div>
        {filtered.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No users found.</p> : (
          <ul className="divide-y divide-border/60">
            {filtered.map((p) => {
              const userRoles = rolesByUser[p.id] ?? [];
              const missing = ALL_ROLES.filter((r) => !userRoles.includes(r));
              return (
                <li key={p.id} className="py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{p.full_name ?? "Unnamed"}</p>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{p.id}</p>
                      {p.organization && <p className="text-xs text-muted-foreground">{p.organization}</p>}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {userRoles.map((r) => (
                        <span key={r} className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-1 text-xs">
                          {r}
                          <button onClick={() => removeRole(p.id, r)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" strokeWidth={1.5} /></button>
                        </span>
                      ))}
                      {missing.length > 0 && (
                        pending?.user_id === p.id ? (
                          <>
                            <select value={pending.role} onChange={(e) => setPending({ ...pending, role: e.target.value })} className="rounded-full border border-border bg-background px-2 py-1 text-xs">
                              {missing.map((r) => <option key={r}>{r}</option>)}
                            </select>
                            <ActionButton label="Add" variant="primary" onClick={() => { addRole(pending.user_id, pending.role); setPending(null); }} />
                            <ActionButton label="Cancel" onClick={() => setPending(null)} />
                          </>
                        ) : (
                          <button onClick={() => setPending({ user_id: p.id, role: missing[0] })} className="inline-flex items-center gap-1 text-xs text-rosewood hover:underline"><Plus className="h-3 w-3" strokeWidth={1.5} /> role</button>
                        )
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </DataCard>
    </WorkspacePage>
  );
}
