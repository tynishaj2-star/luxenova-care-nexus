import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BoardPortalShell } from "@/components/portal/BoardPortalShell";
import { CheckSquare, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/board-portal/tasks")({
  head: () => ({ meta: [{ title: "Tasks — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: TasksPage,
});

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_at: string | null;
  assigned_to: string | null;
  created_by: string | null;
  completed_at: string | null;
  created_at: string;
};

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [priority, setPriority] = useState("normal");
  const [uid, setUid] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    setTasks((data as Task[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUid(session?.user.id ?? null));
    load();
  }, []);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !uid) return;
    const { error } = await supabase.from("tasks").insert({
      title: title.trim(),
      priority,
      due_at: dueAt ? new Date(dueAt).toISOString() : null,
      created_by: uid,
      assigned_to: uid,
    });
    if (!error) {
      setTitle(""); setDueAt(""); setPriority("normal");
      load();
    }
  }

  async function toggleDone(t: Task) {
    const done = t.status === "done";
    await supabase.from("tasks").update({
      status: done ? "open" : "done",
      completed_at: done ? null : new Date().toISOString(),
    }).eq("id", t.id);
    load();
  }

  async function remove(id: string) {
    await supabase.from("tasks").delete().eq("id", id);
    load();
  }

  return (
    <BoardPortalShell title="Tasks" subtitle="Track board and program to-dos.">
      <form onSubmit={addTask} className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title"
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
            required
          />
          <input
            type="date"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-rosewood px-4 py-2 text-sm text-rosewood-foreground shadow-luxe">
            <Plus className="h-4 w-4" strokeWidth={1.5} /> Add
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : tasks.length === 0 ? (
          <div className="grid place-items-center py-10 text-center">
            <CheckSquare className="h-10 w-10 text-muted-foreground" strokeWidth={1} />
            <p className="mt-2 text-sm text-muted-foreground">No tasks yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {tasks.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <input
                  type="checkbox"
                  checked={t.status === "done"}
                  onChange={() => toggleDone(t)}
                  className="h-4 w-4"
                />
                <div className="flex-1">
                  <p className={`text-sm ${t.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                    {t.title}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {t.priority} · {t.due_at ? `Due ${new Date(t.due_at).toLocaleDateString()}` : "No due date"}
                  </p>
                </div>
                <button onClick={() => remove(t.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BoardPortalShell>
  );
}
