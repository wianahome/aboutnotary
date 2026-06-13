import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { BlogPostItem, BlogPostSummary } from "@/types/database.types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validasi ketat di awal file agar Vercel langsung memberi tahu jika Env lupa dimasukkan
if (!url || !anonKey) {
  throw new Error("[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env variables.");
}

// Ciptakan satu instance tunggal untuk digunakan bersama (Singleton)
export const supabase: SupabaseClient = createClient(url, anonKey);

/**
 * Mengambil semua slug untuk keperluan generateStaticParams dan sitemap
 */
export async function getAllPostSlugs(): Promise<string[]> {
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
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, meta_description, content, table_data, updated_at")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("[getPostBySlug]", error.message);
    return null;
  }

  return data as BlogPostItem;
}