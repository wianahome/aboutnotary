import type { Metadata } from "next";
import Link from "next/link";
import { getPostsPaginated } from "@/lib/supabase";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Browse expert notary guides, state requirements, and practical how-to articles.",
};

const PAGE_SIZE = 12;

interface BlogArchivePageProps {
  searchParams: Promise<{ page?: string }>;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateString));
}

export default async function BlogArchivePage({
  searchParams,
}: BlogArchivePageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const { posts, total } = await getPostsPaginated(currentPage, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {SITE_NAME} Blog
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-600">
            Actionable notary guides optimized for clarity, accuracy, and search
            intent.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {posts.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-600">
            No articles published yet. Check back soon.
          </p>
        ) : (
          <ul className="grid gap-6">
            {posts.map((post) => (
              <li key={post.id}>
                <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <time
                    dateTime={post.updated_at}
                    className="text-sm text-zinc-500"
                  >
                    Updated {formatDate(post.updated_at)}
                  </time>
                  <h2 className="mt-2 text-xl font-semibold text-zinc-900">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-zinc-700"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {post.meta_description}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-4 inline-block text-sm font-medium text-zinc-900 hover:underline"
                  >
                    Read article &rarr;
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <nav
            className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6"
            aria-label="Blog pagination"
          >
            {currentPage > 1 ? (
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                &larr; Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="text-sm text-zinc-500">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages ? (
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                Next &rarr;
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </div>
  );
}
