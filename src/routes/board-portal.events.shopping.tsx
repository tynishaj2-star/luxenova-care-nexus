import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { WorkspacePage, ActionButton, DataCard } from "@/components/portal/workspace/WorkspacePage";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/board-portal/events/shopping")({
  head: () => ({ meta: [{ title: "Shopping Lists — Events" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: Shopping,
});

type List = { id: string; title: string };
type Item = { id: string; list_id: string; item: string; qty: number; purchased: boolean };

function Shopping() {
  const [lists, setLists] = useState<List[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [activeList, setActiveList] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");
  const [newQty, setNewQty] = useState(1);

  async function loadLists() {
    const { data } = await supabase.from("shopping_lists").select("id,title").order("created_at", { ascending: false });
    setLists((data as List[]) ?? []);
    if (data && data.length && !activeList) setActiveList((data[0] as List).id);
  }
  async function loadItems(listId: string) {
    const { data } = await supabase.from("shopping_list_items").select("*").eq("list_id", listId).order("created_at", { ascending: true });
    setItems((data as Item[]) ?? []);
  }
  useEffect(() => { loadLists(); }, []);
  useEffect(() => { if (activeList) loadItems(activeList); }, [activeList]);

  async function addList() {
    if (!newListTitle.trim()) return;
    const { data } = await supabase.from("shopping_lists").insert({ title: newListTitle }).select("id").single();
    setNewListTitle("");
    await loadLists();
    if (data) setActiveList(data.id);
  }
  async function deleteList(id: string) {
    if (!confirm("Delete this list and all its items?")) return;
    await supabase.from("shopping_lists").delete().eq("id", id);
    setActiveList(null); loadLists();
  }
  async function addItem() {
    if (!activeList || !newItem.trim()) return;
    await supabase.from("shopping_list_items").insert({ list_id: activeList, item: newItem, qty: newQty });
    setNewItem(""); setNewQty(1); loadItems(activeList);
  }
  async function toggle(i: Item) {
    await supabase.from("shopping_list_items").update({ purchased: !i.purchased }).eq("id", i.id);
    if (activeList) loadItems(activeList);
  }
  async function removeItem(id: string) {
    await supabase.from("shopping_list_items").delete().eq("id", id);
    if (activeList) loadItems(activeList);
  }

  return (
    <WorkspacePage title="Shopping Lists" subtitle="Event shopping checklists by category." eyebrow="Events · Workspace" backTo="/board-portal/events" backLabel="Back to Events hub">
      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <DataCard>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Lists</p>
          <div className="mt-3 flex gap-2">
            <input value={newListTitle} onChange={(e) => setNewListTitle(e.target.value)} placeholder="New list…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" />
            <ActionButton icon={Plus} label="Add" variant="primary" onClick={addList} />
          </div>
          <ul className="mt-4 space-y-1">
            {lists.map((l) => (
              <li key={l.id} className="flex items-center justify-between">
                <button onClick={() => setActiveList(l.id)} className={`flex-1 rounded-lg px-2 py-1.5 text-left text-sm ${activeList === l.id ? "bg-accent/50 text-rosewood" : "hover:bg-accent/30"}`}>
                  {l.title}
                </button>
                <button onClick={() => deleteList(l.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /></button>
              </li>
            ))}
            {lists.length === 0 && <p className="text-sm text-muted-foreground">No lists yet.</p>}
          </ul>
        </DataCard>

        <DataCard>
          {activeList ? (
            <>
              <div className="flex gap-2">
                <input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Item…" className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                <input type="number" value={newQty} onChange={(e) => setNewQty(Number(e.target.value) || 1)} className="w-20 rounded-xl border border-border bg-background px-3 py-2 text-sm" />
                <ActionButton icon={Plus} label="Add" variant="primary" onClick={addItem} />
              </div>
              <ul className="mt-4 space-y-1">
                {items.map((i) => (
                  <li key={i.id} className="flex items-center gap-3 border-b border-border/60 py-2 last:border-0">
                    <input type="checkbox" checked={i.purchased} onChange={() => toggle(i)} />
                    <span className={`flex-1 text-sm ${i.purchased ? "line-through text-muted-foreground" : ""}`}>{i.item}</span>
                    <span className="text-xs text-muted-foreground">×{i.qty}</span>
                    <button onClick={() => removeItem(i.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /></button>
                  </li>
                ))}
                {items.length === 0 && <p className="mt-4 text-sm text-muted-foreground">No items yet.</p>}
              </ul>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Create or select a list to add items.</p>
          )}
        </DataCard>
      </div>
    </WorkspacePage>
  );
}
