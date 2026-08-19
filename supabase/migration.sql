-- ============================================================================
-- MC FABS — Supabase migration
-- ----------------------------------------------------------------------------
-- Applies to the NEW, dedicated Supabase project created for the public site
-- (mcfabs.onrender.com) and the admin app (mcfabs-admin.onrender.com) ONLY.
--
-- This project is completely separate from the existing ticketing platform's
-- Supabase project (fabs-masterclass.onrender.com / QR-Code-Ticket-Generator).
-- Do NOT run this against that project. Do NOT point these apps at that
-- project's URL/keys.
--
-- How to apply:
--   1. Open your new Supabase project → SQL Editor → New query.
--   2. Paste this entire file and run it once.
--   3. Create the single admin user manually in Authentication → Users
--      (email/password). Do NOT enable public sign-ups for this project.
--   4. Create a Storage bucket named `media` (public) for gallery/blog/
--      popup/poster images — see the Storage policies at the bottom.
-- ============================================================================

-- Extension needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Table: gallery_images
-- Photos shown in the public site's Home gallery and the Masterclass page's
-- gallery. Tagged so the same table can serve both ("general", "masterclass").
-- ----------------------------------------------------------------------------
create table if not exists public.gallery_images (
  id           uuid primary key default gen_random_uuid(),
  image_url    text not null,
  caption      text,
  alt_text     text not null default '',
  tags         text[] not null default array['general']::text[], -- e.g. {general}, {masterclass}
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.gallery_images is 'Public-site photo gallery items, managed from the admin app.';
comment on column public.gallery_images.tags is 'Free-form tags, e.g. general, masterclass — used to filter the Masterclass page gallery.';

-- ----------------------------------------------------------------------------
-- Table: announcements
-- Sitewide or page-scoped popups (e.g. masterclass poster, general notice).
-- ----------------------------------------------------------------------------
create table if not exists public.announcements (
  id             uuid primary key default gen_random_uuid(),
  internal_name  text not null,               -- admin-only label, never shown publicly
  title          text,                        -- shown to visitors
  image_url      text,
  message        text,
  link_url       text,
  button_label   text,
  placement      text not null default 'sitewide' check (placement in ('sitewide', 'masterclass')),
  active         boolean not null default false,
  starts_at      timestamptz,
  ends_at        timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.announcements is 'Popups/announcements. Public site renders at most one active popup per placement, filtered by starts_at/ends_at.';

-- ----------------------------------------------------------------------------
-- Table: blog_posts
-- ----------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  content       text not null default '',     -- Markdown
  cover_image   text,
  cover_alt     text not null default '',
  published     boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.blog_posts is 'Blog posts. Only rows with published = true are readable by the anon/public role.';

create index if not exists blog_posts_published_idx on public.blog_posts (published, published_at desc);

-- ----------------------------------------------------------------------------
-- Table: masterclass_editions
-- Manually maintained by Faith/Xavier in the admin app — NOT synced
-- automatically from the ticketing platform.
-- ----------------------------------------------------------------------------
create table if not exists public.masterclass_editions (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  event_date         date,
  venue              text,
  blurb              text,
  status             text not null default 'upcoming' check (status in ('upcoming', 'past')),
  poster_image       text,
  poster_alt         text not null default '',
  ticket_link_override text, -- optional; falls back to https://fabs-masterclass.onrender.com
  sort_order         integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.masterclass_editions is 'Past & future masterclass editions shown on /masterclass. Manually entered; not synced from the ticketing platform.';

create index if not exists masterclass_editions_status_idx on public.masterclass_editions (status, event_date desc);

-- ----------------------------------------------------------------------------
-- updated_at triggers
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.gallery_images;
create trigger set_updated_at before update on public.gallery_images
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.announcements;
create trigger set_updated_at before update on public.announcements
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.blog_posts;
create trigger set_updated_at before update on public.blog_posts
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.masterclass_editions;
create trigger set_updated_at before update on public.masterclass_editions
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ----------------------------------------------------------------------------
-- Public/anon role: READ ONLY on published/active content.
-- Authenticated role: full read/write (there is only ever one authenticated
-- user in this project — the admin account created manually in Supabase Auth).
-- ============================================================================

alter table public.gallery_images enable row level security;
alter table public.announcements enable row level security;
alter table public.blog_posts enable row level security;
alter table public.masterclass_editions enable row level security;

-- gallery_images: anon can read all gallery rows (no draft concept for images)
drop policy if exists "gallery_images_public_read" on public.gallery_images;
create policy "gallery_images_public_read"
  on public.gallery_images for select
  to anon
  using (true);

drop policy if exists "gallery_images_admin_all" on public.gallery_images;
create policy "gallery_images_admin_all"
  on public.gallery_images for all
  to authenticated
  using (true)
  with check (true);

-- announcements: anon can read only active, in-window popups
drop policy if exists "announcements_public_read" on public.announcements;
create policy "announcements_public_read"
  on public.announcements for select
  to anon
  using (
    active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );

drop policy if exists "announcements_admin_all" on public.announcements;
create policy "announcements_admin_all"
  on public.announcements for all
  to authenticated
  using (true)
  with check (true);

-- blog_posts: anon can read only published posts
drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read"
  on public.blog_posts for select
  to anon
  using (published = true);

drop policy if exists "blog_posts_admin_all" on public.blog_posts;
create policy "blog_posts_admin_all"
  on public.blog_posts for all
  to authenticated
  using (true)
  with check (true);

-- masterclass_editions: anon can read all editions (public marketing info)
drop policy if exists "masterclass_editions_public_read" on public.masterclass_editions;
create policy "masterclass_editions_public_read"
  on public.masterclass_editions for select
  to anon
  using (true);

drop policy if exists "masterclass_editions_admin_all" on public.masterclass_editions;
create policy "masterclass_editions_admin_all"
  on public.masterclass_editions for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================================
-- Storage
-- ----------------------------------------------------------------------------
-- Create a PUBLIC bucket named `media` from the Supabase dashboard
-- (Storage → New bucket → name "media" → Public bucket = ON), then run the
-- policies below so anon can read objects and only the authenticated admin
-- can upload/update/delete them.
-- ============================================================================

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects for select
  to anon
  using (bucket_id = 'media');

drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');

-- ============================================================================
-- Optional seed data — safe to run, no-ops if rows already exist by slug.
-- Replace / remove once Faith's real content is loaded via the admin app.
-- ============================================================================

insert into public.masterclass_editions (title, event_date, venue, blurb, status, sort_order)
select 'MC FABS Exclusive Masterclass — TODO: [Edition name]', null,
       'TODO: [Venue, Kano, Nigeria]',
       'TODO: [Short blurb about this edition]', 'upcoming', 0
where not exists (select 1 from public.masterclass_editions);

insert into public.blog_posts (slug, title, excerpt, content, published)
select 'welcome-to-the-mc-fabs-blog',
       'TODO: [Welcome post title]',
       'TODO: [One or two sentence excerpt].',
       '# TODO: [Welcome post heading]' || chr(10) || chr(10) || 'TODO: [Body content in Markdown]',
       false
where not exists (select 1 from public.blog_posts);
