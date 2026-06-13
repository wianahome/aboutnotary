import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { BlogPostItem, BlogPostSummary, SitemapDirectoryPost, SitemapPostEntry } from "@/types/database.types";
import { normalizeTargetState } from "@/lib/target-state";

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) {
    return supabaseClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn(
      "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Add them to .env.local and restart the dev server.",
    );
    return null;
  }

  supabaseClient = createClient(url, anonKey);
  return supabaseClient;
}

/**
 * Mengambil semua slug untuk keperluan generateStaticParams dan sitemap
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("slug")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[getAllPostSlugs]", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.slug as string);
}

/**
 * Mengambil list artikel terpaginasi untuk halaman arsip /blog
 */
export async function getPostsPaginated(
  page: number,
  pageSize: number,
): Promise<{ posts: BlogPostSummary[]; total: number }> {
  const supabase = getSupabase();
  if (!supabase) return { posts: [], total: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("posts")
    .select("id, title, slug, meta_description, updated_at", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("[getPostsPaginated]", error.message);
    return { posts: [], total: 0 };
  }

  return {
    posts: (data ?? []) as BlogPostSummary[],
    total: count ?? 0,
  };
}

/**
 * Mengambil detail konten artikel berdasarkan slug unik
 */
export async function getPostBySlug(slug: string): Promise<BlogPostItem | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, title, slug, meta_description, content, table_data, target_state, status, updated_at",
    )
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("[getPostBySlug]", error.message);
    return null;
  }

  const post = data as BlogPostItem;

  return {
    ...post,
    target_state: normalizeTargetState(post.target_state),
  };
}

/**
 * Mengambil semua artikel published untuk halaman direktori HTML sitemap
 */
export async function getAllPublishedDirectoryPosts(): Promise<SitemapDirectoryPost[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("title, slug, target_state")
    .eq("status", "published")
    .order("title", { ascending: true });

  if (error) {
    console.error("[getAllPublishedDirectoryPosts]", error.message);
    return [];
  }

  return (data ?? []) as SitemapDirectoryPost[];
}

/**
 * Lightweight fetch for XML sitemap: published posts with slug + updated_at only
 */
export async function getPublishedPostsForSitemap(): Promise<SitemapPostEntry[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[getPublishedPostsForSitemap]", error.message);
    return [];
  }

  return (data ?? []) as SitemapPostEntry[];
}
