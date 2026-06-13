import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getAllPublishedDirectoryPosts } from "@/lib/supabase";
import { SITE_NAME } from "@/lib/site";
import type { SitemapDirectoryPost } from "@/types/database.types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Article Directory",
  description:
    "Complete directory of all notary guides organized by US state and national topics. Browse every published article on Notary Guide.",
  alternates: {
    canonical: "/sitemap-articles",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const NATIONAL_SECTION = "National & General Guides";

interface DirectorySection {
  heading: string;
  articles: SitemapDirectoryPost[];
}

function resolveSectionKey(targetState: string | null): string {
  const state = targetState?.trim();
  return state && state.length > 0 ? state : NATIONAL_SECTION;
}

function resolveSectionHeading(sectionKey: string): string {
  return sectionKey === NATIONAL_SECTION
    ? NATIONAL_SECTION
    : `${sectionKey} Guides`;
}

function groupArticlesByState(
  articles: SitemapDirectoryPost[],
): DirectorySection[] {
  const grouped = new Map<string, SitemapDirectoryPost[]>();

  for (const article of articles) {
    const key = resolveSectionKey(article.target_state);
    const existing = grouped.get(key);

    if (existing) {
      existing.push(article);
    } else {
      grouped.set(key, [article]);
    }
  }

  const nationalArticles = grouped.get(NATIONAL_SECTION);
  grouped.delete(NATIONAL_SECTION);

  const stateSections = [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "en-US"))
    .map(([state, stateArticles]) => ({
      heading: resolveSectionHeading(state),
      articles: stateArticles,
    }));

  const sections: DirectorySection[] = [];

  if (nationalArticles && nationalArticles.length > 0) {
    sections.push({
      heading: NATIONAL_SECTION,
      articles: nationalArticles,
    });
  }

  return [...sections, ...stateSections];
}

export default async function SitemapArticlesPage() {
  const articles = await getAllPublishedDirectoryPosts();
  const sections = groupArticlesByState(articles);
  const totalArticles = articles.length;

  return (
    <div className="bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">
            HTML Directory
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            {SITE_NAME} — Article Directory
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-600">
            A complete index of every published guide, organized by state and
            national topic for easy discovery.
          </p>
          <p className="mt-3 text-sm text-zinc-500">
            {totalArticles} {totalArticles === 1 ? "article" : "articles"}{" "}
            across {sections.length}{" "}
            {sections.length === 1 ? "section" : "sections"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        {sections.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-600">
            No published articles yet. New guides will appear here automatically.
          </p>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <section
                key={section.heading}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
                aria-labelledby={`section-${section.heading.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <div className="mb-4 flex items-start gap-2 border-b border-zinc-100 pb-3">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
                    aria-hidden="true"
                  />
                  <h2
                    id={`section-${section.heading.replace(/\s+/g, "-").toLowerCase()}`}
                    className="text-lg font-semibold text-zinc-900"
                  >
                    {section.heading}
                  </h2>
                </div>

                <ul className="space-y-2">
                  {section.articles.map((article) => (
                    <li key={article.slug}>
                      <Link
                        href={`/blog/${article.slug}`}
                        className="block text-sm leading-snug text-zinc-700 transition-colors hover:text-zinc-900 hover:underline hover:underline-offset-2"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-xs text-zinc-400">
                  {section.articles.length}{" "}
                  {section.articles.length === 1 ? "guide" : "guides"}
                </p>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
