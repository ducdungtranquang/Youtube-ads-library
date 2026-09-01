import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, UserCircle2 } from 'lucide-react';
import { urlFor } from '@/sanity/client';
import type { BlogPostSummary } from '@/sanity/queries';

interface BlogPostCardProps {
  post: BlogPostSummary;
}

const formatDate = (value?: string) => {
  if (!value) return 'Soon';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Soon';

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export function BlogPostCard({ post }: BlogPostCardProps) {
  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(900).height(540).auto('format').fit('max').url() : null;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
      <div className="relative h-56 overflow-hidden bg-slate-200 dark:bg-slate-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-300">
            No image
          </div>
        )}
      </div>

      <div className="space-y-4 p-5 md:p-6">
        <div className="flex flex-wrap gap-2">
          {post.categories?.slice(0, 2).map((category) => (
            <span
              key={category._id}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-200"
            >
              {category.title}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-slate-50 dark:group-hover:text-indigo-300">
            {post.title}
          </h2>
          <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {post.excerpt || 'Đọc thêm để khám phá chi tiết và insight trong bài viết này.'}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <UserCircle2 className="h-4 w-4 text-indigo-500" />
            <span>{post.author?.name || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-indigo-500" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
        >
          Đọc tiếp
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
