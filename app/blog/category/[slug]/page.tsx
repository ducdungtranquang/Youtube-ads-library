import { notFound } from 'next/navigation';
import { Newspaper } from 'lucide-react';
import { BlogPagination } from '@/components/blog/blog-pagination';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { BlogShell } from '@/components/blog/blog-shell';
import { Header } from '@/components/header';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Tích hợp Header chung đồng bộ giao diện */}
      <Header />

      <BlogShell
        categories={categories}
        selectedCategorySlug={slug}
        title={`Chuyên mục: ${category.title}`}
        description={category.description || 'Khám phá các bài viết liên quan trong chuyên mục này.'}
      >
        <div className="space-y-8">
          {/* Thanh thông số bài viết đồng bộ với trang blog chính */}
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl px-6 py-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Newspaper className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                Tìm thấy <span className="font-bold text-white">{totalCount}</span> bài viết trong chuyên mục này
              </p>
            </div>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 p-16 text-center text-slate-400">
              Chưa có bài viết nào trong chuyên mục này.
            </div>
          )}

          <BlogPagination currentPage={safePage} totalPages={totalPages} basePath={`/blog/category/${slug}`} />
        </div>
      </BlogShell>
    </div>
  );
}