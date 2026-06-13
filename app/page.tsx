import type { Metadata } from "next";
import Link from "next/link";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

const directorySections = [
  {
    title: "Blog",
    description:
      "Browse in-depth guides on notary laws, procedures, and state-specific requirements.",
    href: "/blog",
    cta: "Explore articles",
  },
  {
    title: "Privacy Policy",
    description:
      "Learn how we collect, use, and protect your information when you visit our site.",
    href: "/privacy-policy",
    cta: "Read policy",
  },
] as const;

export default function HomePage() {
  return (
    <div className="bg-zinc-50">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">
            United States Notary Resources
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            {SITE_NAME}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
            {SITE_DESCRIPTION}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="mb-8 text-2xl font-semibold text-zinc-900">
          Site Directory
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {directorySections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-zinc-700">
                {section.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                {section.description}
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-zinc-900">
                {section.cta} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
