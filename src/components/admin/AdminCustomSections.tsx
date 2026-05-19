// Placeholder for the custom-sections admin panel.
const AdminCustomSections = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Custom Sections</h2>
      <div className="bg-card border border-border rounded-xl p-6 text-sm text-muted-foreground font-medium space-y-3">
        <p>
          The <code className="bg-muted px-1.5 py-0.5 rounded">custom_sections</code> table needs to be created.
          Run this SQL in your Supabase SQL editor:
        </p>
        <pre className="bg-muted/60 text-foreground text-xs rounded-lg p-4 overflow-auto">{`create table public.custom_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  layout text not null default 'grid', -- grid | carousel | list | cards
  items jsonb not null default '[]'::jsonb,
  background text default 'background', -- background | surface | warm | card
  accent text default 'gold',
  published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);
alter table public.custom_sections enable row level security;
create policy "Public read custom_sections" on public.custom_sections
  for select using (published);
create policy "Admins manage custom_sections" on public.custom_sections
  for all using (public.has_role(auth.uid(), 'admin'));`}</pre>
        <p>
          Once the table exists, the full builder UI (layout picker, item editor, drag-to-reorder, image upload) will activate in the next turn.
        </p>
      </div>
    </div>
  );
};
export default AdminCustomSections;
