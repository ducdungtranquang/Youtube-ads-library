import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogPagination } from '@/components/blog/blog-pagination';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { BlogShell } from '@/components/blog/blog-shell';
import { client, sanityFetch } from '@/sanity/client';
import {
  GET_CATEGORIES_QUERY,
  GET_POSTS_QUERY,
  GET_TOTAL_POSTS_COUNT_QUERY,
  type BlogCategory,
  type BlogPostSummary,
} from '@/sanity/queries';

const POST_LIMIT = 6;

interface BlogPageProps {
  searchParams?: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = (await searchParams) ?? {};
  const page = Number(params.page ?? '1');
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const start = (safePage - 1) * POST_LIMIT;
  const end = safePage * POST_LIMIT;

  const [categories, totalCount, posts] = await Promise.all([
    sanityFetch<BlogCategory[]>({ query: GET_CATEGORIES_QUERY }),
    client.fetch<number>(GET_TOTAL_POSTS_COUNT_QUERY),
    sanityFetch<BlogPostSummary[]>({
      query: GET_POSTS_QUERY,
      params: { start, end: end - 1 },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / POST_LIMIT));

  if (safePage > totalPages) {
    notFound();
  }

  return (
    <BlogShell
      categories={categories}
      title="Blog & Insights"
      description="Khám phá các bài viết, chiến lược quảng cáo, hướng dẫn và insight từ đội ngũ Ads Spy Tool."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Hiển thị <span className="font-semibold text-slate-900 dark:text-white">{posts.length}</span> bài viết trên <span className="font-semibold text-slate-900 dark:text-white">{totalCount}</span>
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-slate-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            Open Studio
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
            Chưa có bài viết nào để hiển thị.
          </div>
        )}

        <BlogPagination currentPage={safePage} totalPages={totalPages} basePath="/blog" />
      </div>
    </BlogShell>
  );
}
