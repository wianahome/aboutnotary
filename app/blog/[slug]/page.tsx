import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdBanner from "@/components/AdBanner";
import Breadcrumb from "@/components/Breadcrumb";
import CalloutBox from "@/components/CalloutBox";
import FaqSchema from "@/components/FaqSchema";
import GeographicSiloLinks from "@/components/GeographicSiloLinks";
import { getAllPostSlugs, getPostBySlug } from "@/lib/supabase";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { normalizeTargetState } from "@/lib/target-state";
import type { BlogPostItem } from "@/types/database.types";

export const revalidate = 86400;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

function resolveMetadataText(
  value: string | null | undefined,
  fallback: string,
): string {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const siteUrl = getSiteUrl();

  if (!post) {
    return {
      title: "Article Not Found",
      description: SITE_DESCRIPTION,
      robots: { index: false, follow: false },
      openGraph: {
        title: "Article Not Found",
        description: SITE_DESCRIPTION,
        type: "article",
        url: `${siteUrl}/blog/${slug}`,
      },
    };
  }

  const title = resolveMetadataText(
    post.title,
    `${SITE_NAME} Guide`,
  );
  const description = resolveMetadataText(
    post.meta_description,
    SITE_DESCRIPTION,
  );
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      modifiedTime: post.updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

  const post: BlogPostItem = {
    ...rawPost,
    target_state: normalizeTargetState(rawPost.target_state),
  };

  return (
    <article className="bg-white">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <Breadcrumb title={post.title} targetState={post.target_state} />
        </div>
      </div>

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

        <FaqSchema content={post.content} />

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

        <GeographicSiloLinks
          currentPostId={post.id}
          targetState={post.target_state}
        />

        <AdBanner slot="bottom-banner" className="mt-10" />
      </div>
    </article>
  );
}
