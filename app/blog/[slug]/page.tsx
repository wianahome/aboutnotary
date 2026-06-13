import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import CalloutBox from "@/components/CalloutBox";
import { getAllPostSlugs, getPostBySlug } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/site";
import type { BlogPostItem } from "@/types/database.types";

export const revalidate = 86400;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.meta_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.meta_description,
      type: "article",
      url: canonicalUrl,
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.meta_description,
    },
  };
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateString));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const rawPost = await getPostBySlug(slug);

  if (!rawPost) {
    notFound();
  }

  const post: BlogPostItem = rawPost;

  return (
    <article className="bg-white">
      <header className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <time
            dateTime={post.updated_at}
            className="text-sm text-zinc-500"
          >
            Last updated {formatDate(post.updated_at)}
          </time>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-600">
            {post.meta_description}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <AdBanner slot="top-banner" className="mb-8" />

        <CalloutBox title="Key Takeaway" variant="tip">
          This guide is structured to deliver direct, actionable information for
          US notary professionals and consumers researching notary requirements.
        </CalloutBox>

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.table_data && (
          <section className="mt-10" aria-label="Reference data table">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900">
              Reference Table
            </h2>
            <div
              className="table-content overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: post.table_data }}
            />
          </section>
        )}

        <AdBanner slot="bottom-banner" className="mt-10" />
      </div>
    </article>
  );
}
