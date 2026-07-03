import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ActionButton, DataCard } from "./WorkspacePage";
import { Plus, Save, Trash2, Search } from "lucide-react";

export type FieldType = "text" | "textarea" | "number" | "money" | "date" | "select";

export type FieldDef<T> = {
  key: keyof T & string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: string[]; // for select
  placeholder?: string;
  hideInTable?: boolean;
  formatCell?: (v: unknown, row: T) => React.ReactNode;
};

type Row = { id: string; [k: string]: unknown };

export function SimpleCrud<T extends Row>({
  table,
  fields,
  orderBy = "created_at",
  ascending = false,
  searchKeys = [],
  addLabel = "Add",
  emptyLabel = "Nothing here yet.",
  defaults = {},
}: {
  table: string;
  fields: FieldDef<T>[];
  orderBy?: string;
  ascending?: boolean;
  searchKeys?: (keyof T & string)[];
  addLabel?: string;
  emptyLabel?: string;
  defaults?: Partial<T>;
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Partial<T> | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from(table as any) as any).select("*").order(orderBy, { ascending });
    setRows((data as T[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [table]);

  async function save() {
    if (!form) return;
    setBusy(true); setErr(null);
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const v = form[f.key];
      if (v === "" || v === undefined) payload[f.key] = null;
      else payload[f.key] = v;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = supabase.from(table as any) as any;
    const res = form.id
      ? await client.update(payload).eq("id", form.id)
      : await client.insert(payload);
    setBusy(false);
    if (res.error) { setErr(res.error.message); return; }
    setForm(null); load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this record?")) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from(table as any) as any).delete().eq("id", id);
    load();
  }

  const filtered = rows.filter((r) => {
    if (!q) return true;
    const hay = searchKeys.map((k) => String(r[k] ?? "")).join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  });
  const tableFields = fields.filter((f) => !f.hideInTable);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <ActionButton icon={Plus} label={addLabel} variant="primary" onClick={() => setForm({ ...defaults })} />
      </div>
      <DataCard>
        {searchKeys.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" />
          </div>
        )}
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{emptyLabel}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  {tableFields.map((f) => <th key={f.key} className="py-2 pr-3">{f.label}</th>)}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    {tableFields.map((f) => (
                      <td key={f.key} className="py-2 pr-3 align-top">
                        {f.formatCell ? f.formatCell(r[f.key], r) : formatDefault(r[f.key], f as unknown as FieldDef<Row>)}
                      </td>
                    ))}
                    <td className="whitespace-nowrap py-2 text-right">
                      <button onClick={() => setForm(r)} className="mr-3 text-xs text-rosewood hover:underline">Edit</button>
                      <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="inline h-3.5 w-3.5" strokeWidth={1.5} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>

      {form && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4" onClick={() => setForm(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-luxe max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-lg">{form.id ? "Edit" : "Add"}</h2>
            <div className="mt-4 grid gap-3">
              {fields.map((f) => (
                <label key={f.key} className="grid gap-1">
                  <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{f.label}{f.required ? " *" : ""}</span>
                  {renderInput(f, form, setForm)}
                </label>
              ))}
            </div>
            {err && <p className="mt-3 text-sm text-destructive">{err}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <ActionButton label="Cancel" onClick={() => setForm(null)} />
              <ActionButton icon={Save} label={busy ? "Saving…" : "Save"} variant="primary" onClick={save} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function formatDefault(v: unknown, f: FieldDef<Row>) {
  if (v === null || v === undefined || v === "") return <span className="text-muted-foreground">—</span>;
  if (f.type === "money") return `$${(Number(v) / 100).toFixed(2)}`;
  if (f.type === "date") return String(v).slice(0, 10);
  const s = String(v);
  return s.length > 60 ? s.slice(0, 60) + "…" : s;
}

const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";

function renderInput<T extends Row>(f: FieldDef<T>, form: Partial<T>, setForm: (v: Partial<T>) => void) {
  const v = form[f.key];
  const set = (val: unknown) => setForm({ ...form, [f.key]: val } as Partial<T>);
  if (f.type === "textarea")
    return <textarea rows={4} value={(v as string) ?? ""} onChange={(e) => set(e.target.value)} className={inp} placeholder={f.placeholder} />;
  if (f.type === "select")
    return (
      <select value={(v as string) ?? ""} onChange={(e) => set(e.target.value)} className={inp}>
        <option value="">Select…</option>
        {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  if (f.type === "number")
    return <input type="number" value={(v as number | string) ?? ""} onChange={(e) => set(e.target.value === "" ? null : Number(e.target.value))} className={inp} placeholder={f.placeholder} />;
  if (f.type === "money")
    return <input type="number" step="0.01" value={v ? Number(v) / 100 : ""} onChange={(e) => set(e.target.value === "" ? null : Math.round(Number(e.target.value) * 100))} className={inp} placeholder={f.placeholder} />;
  if (f.type === "date")
    return <input type="date" value={(v as string)?.slice(0, 10) ?? ""} onChange={(e) => set(e.target.value)} className={inp} />;
  return <input value={(v as string) ?? ""} onChange={(e) => set(e.target.value)} className={inp} placeholder={f.placeholder} required={f.required} />;
}
