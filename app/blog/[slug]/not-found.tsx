import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <h1 className="text-3xl font-bold text-zinc-900">Article Not Found</h1>
      <p className="mt-4 text-zinc-600">
        The article you are looking for does not exist or has been removed.
      </p>
      <Link
        href="/blog"
        className="mt-8 inline-block text-sm font-medium text-zinc-900 hover:underline"
      >
        Back to Blog &rarr;
      </Link>
    </div>
  );
}
