import { notFound } from 'next/navigation';
import { BlogPagination } from '@/components/blog/blog-pagination';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { BlogShell } from '@/components/blog/blog-shell';
import { client, sanityFetch } from '@/sanity/client';
import {
  GET_CATEGORIES_QUERY,
  GET_CATEGORY_BY_SLUG_QUERY,
  GET_POSTS_BY_CATEGORY_QUERY,
  GET_TOTAL_POSTS_BY_CATEGORY_QUERY,
  type BlogCategory,
  type BlogPostSummary,
} from '@/sanity/queries';

const POST_LIMIT = 6;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export default async function BlogCategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const pageParams = (await searchParams) ?? {};
  const page = Number(pageParams.page ?? '1');
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const start = (safePage - 1) * POST_LIMIT;
  const end = safePage * POST_LIMIT;

  const [categories, category, totalCount, posts] = await Promise.all([
    sanityFetch<BlogCategory[]>({ query: GET_CATEGORIES_QUERY }),
    sanityFetch<BlogCategory | null>({ query: GET_CATEGORY_BY_SLUG_QUERY, params: { slug } }),
    client.fetch<number>(GET_TOTAL_POSTS_BY_CATEGORY_QUERY, { slug }),
    sanityFetch<BlogPostSummary[]>({
      query: GET_POSTS_BY_CATEGORY_QUERY,
      params: { slug, start, end: end - 1 },
    }),
  ]);

  if (!category) {
    notFound();
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / POST_LIMIT));

  if (safePage > totalPages) {
    notFound();
  }

  return (
    <BlogShell
      categories={categories}
      selectedCategorySlug={slug}
      title={`Category: ${category.title}`}
      description={category.description || 'Khám phá các bài viết liên quan trong chuyên mục này.'}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300">
          Tìm thấy <span className="font-semibold text-slate-900 dark:text-white">{totalCount}</span> bài viết
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
            Chưa có bài viết nào trong chuyên mục này.
          </div>
        )}

        <BlogPagination currentPage={safePage} totalPages={totalPages} basePath={`/blog/category/${slug}`} />
      </div>
    </BlogShell>
  );
}
