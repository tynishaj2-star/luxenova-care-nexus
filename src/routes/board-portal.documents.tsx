import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BoardPortalShell } from "@/components/portal/BoardPortalShell";
import { FileText, Upload, Trash2, Download, Lock, Users as UsersIcon } from "lucide-react";

export const Route = createFileRoute("/board-portal/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Board Portal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DocumentsPage,
});

type Visibility = "private" | "board" | "staff" | "admin";

type DocRow = {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  category: string;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  visibility: Visibility;
  created_at: string;
};

const BUCKET = "board-documents";

const CATEGORIES = [
  "general",
  "financials",
  "governance",
  "programs",
  "events",
  "meeting-minutes",
  "personal",
] as const;

function formatBytes(n: number | null) {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function DocumentsPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("general");
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });
    setDocs((data as DocRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUid(session?.user.id ?? null));
    load();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("documents-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "documents" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!uid) {
      setError("You must be signed in.");
      return;
    }
    if (!file || !title.trim()) {
      setError("Pick a file and give it a title.");
      return;
    }
    setUploading(true);
    try {
      // Save under the user's own folder so files are physically scoped by profile
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${uid}/${Date.now()}_${safeName}`;

      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });
      if (upErr) throw upErr;

      const { error: insErr } = await (supabase as any).from("documents").insert({
        owner_id: uid,
        title: title.trim(),
        description: description.trim() || null,
        category,
        visibility,
        file_path: path,
        file_name: file.name,
        mime_type: file.type || null,
        size_bytes: file.size,
      });
      if (insErr) {
        // Roll back the storage upload if the row insert failed
        await supabase.storage.from(BUCKET).remove([path]);
        throw insErr;
      }

      setTitle("");
      setDescription("");
      setCategory("general");
      setVisibility("private");
      setFile(null);
      const fileInput = document.getElementById("doc-file") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      load();
    } catch (err: any) {
      setError(err?.message ?? "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(d: DocRow) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(d.file_path, 60);
    if (error || !data?.signedUrl) return;
    window.open(data.signedUrl, "_blank", "noopener");
  }

  async function handleDelete(d: DocRow) {
    if (!confirm(`Delete "${d.title}"? This cannot be undone.`)) return;
    await supabase.storage.from(BUCKET).remove([d.file_path]);
    await (supabase as any).from("documents").delete().eq("id", d.id);
    load();
  }

  const mine = docs.filter((d) => d.owner_id === uid);
  const shared = docs.filter((d) => d.owner_id !== uid);

  return (
    <BoardPortalShell
      title="Documents"
      subtitle="Each upload is saved under your profile. Choose who can see it."
    >
      <form
        onSubmit={handleUpload}
        className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft"
      >
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
            required
          />
          <input
            id="doc-file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.replace("-", " ")}
              </option>
            ))}
          </select>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as Visibility)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="private">Private (only me + admins)</option>
            <option value="board">Shared with board</option>
            <option value="staff">Shared with staff</option>
            <option value="admin">Admin only</option>
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Notes (optional)"
            className="md:col-span-2 rounded-xl border border-border bg-background px-3 py-2 text-sm"
            rows={2}
          />
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Files are stored privately in your own folder — nobody else can see them unless you share.
          </p>
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-rosewood px-4 py-2 text-sm text-rosewood-foreground shadow-luxe disabled:opacity-60"
          >
            <Upload className="h-4 w-4" strokeWidth={1.5} />
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </form>

      <DocSection
        title="My documents"
        empty="You haven't uploaded any documents yet."
        docs={mine}
        loading={loading}
        onDownload={handleDownload}
        onDelete={handleDelete}
        canDelete
      />

      <DocSection
        title="Shared with me"
        empty="No documents have been shared with you yet."
        docs={shared}
        loading={loading}
        onDownload={handleDownload}
        onDelete={handleDelete}
        canDelete={false}
      />
    </BoardPortalShell>
  );
}

function DocSection({
  title,
  empty,
  docs,
  loading,
  onDownload,
  onDelete,
  canDelete,
}: {
  title: string;
  empty: string;
  docs: DocRow[];
  loading: boolean;
  onDownload: (d: DocRow) => void;
  onDelete: (d: DocRow) => void;
  canDelete: boolean;
}) {
  return (
    <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
      <h2 className="font-display text-lg">{title}</h2>
      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      ) : docs.length === 0 ? (
        <div className="grid place-items-center py-10 text-center">
          <FileText className="h-10 w-10 text-muted-foreground" strokeWidth={1} />
          <p className="mt-2 text-sm text-muted-foreground">{empty}</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-border/60">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center gap-3 py-3">
              <FileText className="h-5 w-5 text-rosewood" strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{d.title}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {d.category.replace("-", " ")} · {d.file_name} · {formatBytes(d.size_bytes)} ·{" "}
                  {new Date(d.created_at).toLocaleDateString()}
                </p>
              </div>
              <span
                title={`Visibility: ${d.visibility}`}
                className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {d.visibility === "private" || d.visibility === "admin" ? (
                  <Lock className="h-3 w-3" strokeWidth={1.5} />
                ) : (
                  <UsersIcon className="h-3 w-3" strokeWidth={1.5} />
                )}
                {d.visibility}
              </span>
              <button
                onClick={() => onDownload(d)}
                className="text-muted-foreground hover:text-rosewood"
                title="Download"
              >
                <Download className="h-4 w-4" strokeWidth={1.5} />
              </button>
              {canDelete && (
                <button
                  onClick={() => onDelete(d)}
                  className="text-muted-foreground hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
