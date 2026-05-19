// Placeholder admin panel. Full CRUD + image upload lands next turn,
// pending creation of the `automations` table in the connected Supabase project.
const AdminAutomations = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Project Management Automations</h2>
      <div className="bg-card border border-border rounded-xl p-6 text-sm text-muted-foreground font-medium space-y-3">
        <p>
          The <code className="bg-muted px-1.5 py-0.5 rounded">automations</code> table needs to be created in
          your Supabase project before this section can be edited. Run this SQL in your
          Supabase SQL editor:
        </p>
        <pre className="bg-muted/60 text-foreground text-xs rounded-lg p-4 overflow-auto">{`create table public.automations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tool text,
  image_url text,
  link_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);
alter table public.automations enable row level security;
create policy "Public read automations" on public.automations
  for select using (true);
create policy "Admins manage automations" on public.automations
  for all using (public.has_role(auth.uid(), 'admin'));`}</pre>
        <p>
          After running that, reply "next" and I'll wire up the full create / edit / delete UI with image upload, plus the same for custom sections.
        </p>
      </div>
    </div>
  );
};
export default AdminAutomations;
