import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { normalizeTargetState } from "@/lib/target-state";
import { getSiteUrl } from "@/lib/site";

interface BreadcrumbProps {
  title: string;
  targetState: string | null;
}

interface BreadcrumbCrumb {
  label: string;
  href?: string;
}

const GENERAL_US_LABEL = "General US";
const CATEGORY_HREF = "/sitemap-articles";

function resolveCategoryLabel(targetState: string | null): string {
  const isStatePresent =
    targetState !== null &&
    targetState.trim() !== "" &&
    targetState.toUpperCase() !== "NULL";

  if (isStatePresent) {
    return targetState.trim();
  }

  return GENERAL_US_LABEL;
}

function buildCrumbs(title: string, targetState: string | null): BreadcrumbCrumb[] {
  const categoryLabel = resolveCategoryLabel(targetState);

  return [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/blog" },
    { label: categoryLabel, href: CATEGORY_HREF },
    { label: title },
  ];
}

function buildBreadcrumbSchema(crumbs: BreadcrumbCrumb[]): string {
  const siteUrl = getSiteUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => {
      const listItem: {
        "@type": "ListItem";
        position: number;
        name: string;
        item?: string;
      } = {
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
      };

      if (crumb.href) {
        listItem.item = `${siteUrl}${crumb.href}`;
      }

      return listItem;
    }),
  };

  return JSON.stringify(schema);
}

export default function Breadcrumb({ title, targetState }: BreadcrumbProps) {
  const normalizedTargetState = normalizeTargetState(targetState);
  const crumbs = buildCrumbs(title, normalizedTargetState);

  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex min-w-0 items-center gap-1.5 text-sm text-zinc-500">
          {crumbs.map((crumb, index) => (
            <li
              key={`${crumb.label}-${index}`}
              className="flex min-w-0 items-center gap-1.5"
            >
              {index > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-zinc-400"
                  aria-hidden="true"
                />
              )}

              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="shrink-0 transition-colors hover:text-zinc-900"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="truncate font-medium text-zinc-700"
                  title={crumb.label}
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildBreadcrumbSchema(crumbs) }}
      />
    </>
  );
}
