import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BoardPortalShell } from "@/components/portal/BoardPortalShell";
import { MessageSquare, Send } from "lucide-react";

export const Route = createFileRoute("/board-portal/messages")({
  head: () => ({ meta: [{ title: "Messages — Board Portal" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: MessagesPage,
});

type Message = {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  subject: string | null;
  body: string;
  read_at: string | null;
  created_at: string;
};

type Member = { user_id: string; member_key: string; name: string };

function MessagesPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    setUid(session.user.id);
    const [{ data: m }, { data: bm }] = await Promise.all([
      supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("board_members").select("user_id,member_key,full_name"),
    ]);
    setMsgs((m as Message[]) ?? []);
    setMembers(((bm ?? []) as Array<{ user_id: string; member_key: string; full_name: string }>).map((r) => ({
      user_id: r.user_id, member_key: r.member_key, name: r.full_name,
    })));
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!uid || !body.trim() || !to) return;
    const { error } = await supabase.from("messages").insert({
      sender_id: uid,
      recipient_id: to,
      subject: subject.trim() || null,
      body: body.trim(),
    });
    if (!error) {
      setSubject(""); setBody(""); setTo("");
      load();
    }
  }

  const nameFor = (id: string | null) => members.find((m) => m.user_id === id)?.name ?? "Unknown";

  return (
    <BoardPortalShell title="Messages" subtitle="Private board-to-board messaging.">
      <form onSubmit={send} className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="grid gap-3 md:grid-cols-2">
          <select value={to} onChange={(e) => setTo(e.target.value)} required className="rounded-xl border border-border bg-background px-3 py-2 text-sm">
            <option value="">Send to…</option>
            {members.filter((m) => m.user_id !== uid).map((m) => (
              <option key={m.user_id} value={m.user_id}>{m.name}</option>
            ))}
          </select>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject (optional)" className="rounded-xl border border-border bg-background px-3 py-2 text-sm" />
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a message…"
          rows={4}
          required
          className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
        <div className="mt-3 flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-rosewood px-4 py-2 text-sm text-rosewood-foreground shadow-luxe">
            <Send className="h-4 w-4" strokeWidth={1.5} /> Send
          </button>
        </div>
      </form>

      <div className="mt-6 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : msgs.length === 0 ? (
          <div className="grid place-items-center py-10 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground" strokeWidth={1} />
            <p className="mt-2 text-sm text-muted-foreground">No messages yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {msgs.map((m) => (
              <li key={m.id} className="py-4">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span>{nameFor(m.sender_id)} → {nameFor(m.recipient_id)}</span>
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                </div>
                {m.subject && <p className="mt-1 font-medium">{m.subject}</p>}
                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{m.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BoardPortalShell>
  );
}
