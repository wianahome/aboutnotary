import Link from "next/link";
import { MapPin } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import type { GeographicSiloLinkPost } from "@/types/database.types";

const PROMINENT_STATES = [
  "California",
  "Texas",
  "Florida",
  "New York",
] as const;

const SILO_LINK_LIMIT = 5;

interface GeographicSiloLinksProps {
  currentPostId: string | number;
  targetState: string | null;
}

function hasTargetState(state: string | null): state is string {
  return typeof state === "string" && state.trim().length > 0;
}

function shufflePosts(posts: GeographicSiloLinkPost[]): GeographicSiloLinkPost[] {
  return [...posts].sort(() => Math.random() - 0.5);
}

async function fetchStateSiloLinks(
  currentPostId: string | number,
  targetState: string,
): Promise<GeographicSiloLinkPost[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, target_state")
    .eq("status", "published")
    .eq("target_state", targetState)
    .neq("id", currentPostId)
    .order("updated_at", { ascending: false })
    .limit(SILO_LINK_LIMIT);

  if (error) {
    console.error("[GeographicSiloLinks:state]", error.message);
    return [];
  }

  return (data ?? []) as GeographicSiloLinkPost[];
}

async function fetchProminentStateLinks(
  currentPostId: string | number,
): Promise<GeographicSiloLinkPost[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, target_state")
    .eq("status", "published")
    .in("target_state", [...PROMINENT_STATES])
    .neq("id", currentPostId)
    .order("updated_at", { ascending: false })
    .limit(SILO_LINK_LIMIT);

  if (error) {
    console.error("[GeographicSiloLinks:prominent]", error.message);
    return [];
  }

  return (data ?? []) as GeographicSiloLinkPost[];
}

async function fetchFallbackLinks(
  currentPostId: string | number,
): Promise<GeographicSiloLinkPost[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, target_state")
    .eq("status", "published")
    .neq("id", currentPostId)
    .limit(SILO_LINK_LIMIT * 4);

  if (error) {
    console.error("[GeographicSiloLinks:fallback]", error.message);
    return [];
  }

  return shufflePosts((data ?? []) as GeographicSiloLinkPost[]).slice(
    0,
    SILO_LINK_LIMIT,
  );
}

async function resolveSiloLinks(
  currentPostId: string | number,
  targetState: string | null,
): Promise<{ posts: GeographicSiloLinkPost[]; heading: string }> {
  if (hasTargetState(targetState)) {
    const posts = await fetchStateSiloLinks(currentPostId, targetState);

    if (posts.length > 0) {
      return {
        posts,
        heading: `Related Guides in ${targetState}`,
      };
    }

    const fallbackPosts = await fetchFallbackLinks(currentPostId);
    return {
      posts: fallbackPosts,
      heading: "Explore More Guides",
    };
  }

  const posts = await fetchProminentStateLinks(currentPostId);

  if (posts.length > 0) {
    return {
      posts,
      heading: "Explore State-Specific Guides",
    };
  }

  const fallbackPosts = await fetchFallbackLinks(currentPostId);
  return {
    posts: fallbackPosts,
    heading: "Explore More Guides",
  };
}

export default async function GeographicSiloLinks({
  currentPostId,
  targetState,
}: GeographicSiloLinksProps) {
  const { posts, heading } = await resolveSiloLinks(currentPostId, targetState);

  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      className="mt-12 border-t border-zinc-200 pt-10"
      aria-label="Related geographic guides"
    >
      <div className="mb-5 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-zinc-500" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-zinc-900">{heading}</h2>
      </div>

      {/* Inline link strip — visible on all breakpoints */}
      <p className="mb-6 text-sm leading-relaxed text-zinc-600 sm:hidden">
        {posts.map((post, index) => (
          <span key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500"
            >
              {post.title}
            </Link>
            {index < posts.length - 1 && (
              <span className="mx-2 text-zinc-400" aria-hidden="true">
                •
              </span>
            )}
          </span>
        ))}
      </p>

      {/* Grid — sm and up */}
      <ul className="hidden gap-3 sm:grid sm:grid-cols-1 md:grid-cols-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-white"
            >
              {post.target_state && (
                <span className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {post.target_state}
                </span>
              )}
              <span className="text-sm font-medium text-zinc-900 group-hover:text-zinc-700">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
