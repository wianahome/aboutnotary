import type { MetadataRoute } from "next";
import { getPublishedPostsForSitemap } from "@/lib/supabase";

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://aboutnotary.com"
).replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedPosts = await getPublishedPostsForSitemap();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes];
}
