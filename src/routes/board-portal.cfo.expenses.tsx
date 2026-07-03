import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { exportCsv, printCurrentView } from "@/lib/export-csv";
import { Plus, Download, Printer, Search, Trash2, Save, Paperclip, FileText, X } from "lucide-react";

export const Route = createFileRoute("/board-portal/cfo/expenses")({
  head: () => ({ meta: [{ title: "Expense Entry — Treasurer" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: ExpensesPage,
});

type Expense = {
  id: string; category: string; vendor: string | null; amount: number;
  paid_at: string | null; method: string | null; notes: string | null;
  receipt_path: string | null; created_at: string;
};

const CATEGORIES = ["Programs", "Fundraising", "Administration", "Payroll", "Rent", "Utilities", "Insurance", "Supplies", "Travel", "Professional services", "Other"];
const BUCKET = "expense-receipts";
const MAX_MB = 10;

function ExpensesPage() {
  const [rows, setRows] = useState<Expense[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Partial<Expense> | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [pendingReceipt, setPendingReceipt] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const { data } = await supabase.from("expenses").select("*").order("paid_at", { ascending: false });
    setRows((data as Expense[]) ?? []);
  }
  useEffect(() => { supabase.auth.getSession().then(({ data }) => setUid(data.session?.user.id ?? null)); load(); }, []);

  function openForm(next: Partial<Expense> | null) {
    setPendingReceipt(null);
    setReceiptError(null);
    setForm(next);
  }

  async function uploadReceipt(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const key = `${uid ?? "unknown"}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(key, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });
    if (error) { setReceiptError(error.message); return null; }
    return key;
  }

  async function save() {
    if (!form || !form.category || form.amount == null) return;
    setUploading(true);
    let receipt_path: string | null | undefined = form.receipt_path ?? null;
    if (pendingReceipt) {
      // Remove previous receipt when replacing
      if (form.id && form.receipt_path) {
        await supabase.storage.from(BUCKET).remove([form.receipt_path]);
      }
      const key = await uploadReceipt(pendingReceipt);
      if (!key) { setUploading(false); return; }
      receipt_path = key;
    }
    const payload = {
      category: form.category,
      vendor: form.vendor ?? null,
      amount: form.amount,
      paid_at: form.paid_at ?? null,
      method: form.method ?? null,
      notes: form.notes ?? null,
      receipt_path: receipt_path ?? null,
      created_by: uid,
    };
    if (form.id) await supabase.from("expenses").update(payload).eq("id", form.id);
    else await supabase.from("expenses").insert(payload);
    setUploading(false);
    openForm(null); load();
  }
  async function remove(id: string) {
    if (!confirm("Delete expense?")) return;
    const row = rows.find((r) => r.id === id);
    if (row?.receipt_path) await supabase.storage.from(BUCKET).remove([row.receipt_path]);
    await supabase.from("expenses").delete().eq("id", id); load();
  }
  async function viewReceipt(path: string) {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60);
    if (error || !data) { alert("Could not open receipt: " + (error?.message ?? "unknown error")); return; }
    window.open(data.signedUrl, "_blank", "noopener");
  }
  async function clearReceipt() {
    if (!form?.receipt_path) { setPendingReceipt(null); return; }
    if (!confirm("Remove attached receipt?")) return;
    await supabase.storage.from(BUCKET).remove([form.receipt_path]);
    setForm({ ...form, receipt_path: null });
    setPendingReceipt(null);
    if (fileRef.current) fileRef.current.value = "";
  }
  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setReceiptError(null);
    if (f && f.size > MAX_MB * 1024 * 1024) {
      setReceiptError(`File exceeds ${MAX_MB} MB limit.`);
      setPendingReceipt(null);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setPendingReceipt(f);
  }

  const filtered = rows.filter((r) => !q || `${r.category} ${r.vendor ?? ""} ${r.notes ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  const total = filtered.reduce((s, r) => s + Number(r.amount), 0);

  return (
    <WorkspacePage
      title="Expense Entry"
      subtitle="Enter bills, receipts, and reimbursements. Attach method and category for reporting."
      backTo="/board-portal/cfo"
      backLabel="Back to Treasurer hub"
      actions={
        <>
          <ActionButton icon={Plus} label="Add Expense" variant="primary" onClick={() => openForm({ paid_at: new Date().toISOString().slice(0, 10) })} />
          <ActionButton icon={Download} label="Export CSV" onClick={() => exportCsv("expenses", filtered)} />
          <ActionButton icon={Printer} label="Print" onClick={printCurrentView} />
        </>
      }
    >
      <DataCard>
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search category or vendor…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div className="text-sm"><span className="text-muted-foreground">Filtered total:</span> <strong>${total.toFixed(2)}</strong></div>
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No expenses recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr><th className="py-2">Date</th><th>Category</th><th>Vendor</th><th>Method</th><th>Amount</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="py-2 pr-3">{r.paid_at ?? "—"}</td>
                    <td className="pr-3">{r.category}</td>
                    <td className="pr-3">{r.vendor ?? "—"}</td>
                    <td className="pr-3">{r.method ?? "—"}</td>
                    <td className="pr-3">${Number(r.amount).toFixed(2)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => setForm(r)} className="text-xs text-rosewood hover:underline">Edit</button>
                        <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /></button>
                      </div>
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
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-luxe">
            <h2 className="font-display text-lg">{form.id ? "Edit Expense" : "Add Expense"}</h2>
            <div className="mt-4 grid gap-3">
              <F label="Category *">
                <select required value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inp}>
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </F>
              <F label="Vendor"><input value={form.vendor ?? ""} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className={inp} /></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="Amount (USD) *"><input required type="number" step="0.01" value={form.amount ?? ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className={inp} /></F>
                <F label="Paid at"><input type="date" value={form.paid_at ?? ""} onChange={(e) => setForm({ ...form, paid_at: e.target.value || null })} className={inp} /></F>
              </div>
              <F label="Method">
                <select value={form.method ?? ""} onChange={(e) => setForm({ ...form, method: e.target.value })} className={inp}>
                  <option value="">—</option>
                  {["card", "ach", "check", "cash", "other"].map((m) => <option key={m}>{m}</option>)}
                </select>
              </F>
              <F label="Notes"><textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inp} /></F>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <ActionButton label="Cancel" onClick={() => setForm(null)} />
              <ActionButton icon={Save} label="Save" variant="primary" onClick={save} />
            </div>
          </div>
        </div>
      )}
    </WorkspacePage>
  );
}

const inp = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-1"><span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</span>{children}</label>;
}
