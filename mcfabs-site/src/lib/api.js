import { supabase } from "./supabase";
import { getCuratedGalleryImages } from "./curatedGallery";

// Thin data-access layer over Supabase for the public site. Every function
// here is READ-ONLY and relies on RLS to only return published/active rows
// to the anon role (see supabase/migration.sql).
//
// When VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not configured,
// `supabase` is null (see lib/supabase.js) and every fetch returns empty
// data or curated defaults so the site renders beautiful content directly
// instead of crashing or showing empty states.

/**
 * Fetch gallery images, optionally filtered by tag ("general" | "masterclass").
 * Falls back to curated on-site event and masterclass photos so images are
 * always seen directly on the site without navigating away.
 */
export async function fetchGalleryImages({ tag } = {}) {
  if (supabase) {
    try {
      let query = supabase
        .from("gallery_images")
        .select("id, image_url, caption, alt_text, tags, sort_order")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (tag) {
        query = query.contains("tags", [tag]);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // Fallback to curated gallery images below
    }
  }

  return getCuratedGalleryImages(tag);
}

/**
 * Fetch the single active announcement/popup for a given placement, if any,
 * respecting the schedule window (RLS already filters active + window, this
 * just picks the most recently created one if more than one qualifies).
 */
export async function fetchActiveAnnouncement(placement) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("announcements")
    .select(
      "id, title, image_url, message, link_url, button_label, placement, created_at",
    )
    .eq("placement", placement)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0] ?? null;
}

/**
 * Fetch published blog posts, newest first, with simple offset pagination.
 */
export async function fetchPublishedPosts({ page = 1, pageSize = 9 } = {}) {
  if (!supabase) return { posts: [], total: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, cover_image, cover_alt, published_at, created_at",
      {
        count: "exact",
      },
    )
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { posts: data ?? [], total: count ?? 0 };
}

/**
 * Fetch the latest N published posts (for the home page teaser).
 */
export async function fetchLatestPosts(limit = 3) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, cover_image, cover_alt, published_at, created_at",
    )
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}

/**
 * Fetch a single published post by slug.
 */
export async function fetchPostBySlug(slug) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, content, cover_image, cover_alt, published_at, created_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Fetch masterclass editions: upcoming first (by event_date ascending), then past.
 */
export async function fetchMasterclassEditions() {
  if (!supabase) return { upcoming: [], past: [] };

  const { data, error } = await supabase
    .from("masterclass_editions")
    .select(
      "id, title, event_date, venue, blurb, status, poster_image, poster_alt, ticket_link_override",
    )
    .order("event_date", { ascending: true });

  if (error) throw error;

  const upcoming = [];
  const past = [];
  for (const edition of data ?? []) {
    if (edition.status === "past") {
      past.push(edition);
    } else {
      upcoming.push(edition);
    }
  }

  past.reverse(); // newest past edition first
  return { upcoming, past };
}
