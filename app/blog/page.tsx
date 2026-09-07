import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Newspaper } from 'lucide-react';
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
import { Header } from '@/components/header';

const POST_LIMIT = 11;

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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Tích hợp Header chung đồng bộ giao diện */}
      <Header />

      <BlogShell
        categories={categories}
        title="Blog & Insights"
        description="Khám phá các bài viết, chiến lược quảng cáo, hướng dẫn và insight chuyên sâu từ đội ngũ Ads Spy Tool."
      >
        <div className="space-y-8">
          {/* Thanh thông tin số lượng bài viết được tối ưu gọn gàng, bỏ nút Open Studio */}
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl px-6 py-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Newspaper className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                Đang hiển thị <span className="font-bold text-white">{posts.length}</span> trên tổng số <span className="font-bold text-white">{totalCount}</span> bài viết
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
              Chưa có bài viết nào để hiển thị.
            </div>
          )}

          <BlogPagination currentPage={safePage} totalPages={totalPages} basePath="/blog" />
        </div>
      </BlogShell>
    </div>
  );
}