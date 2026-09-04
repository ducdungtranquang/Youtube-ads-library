import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, UserCircle2 } from 'lucide-react';
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
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="h-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-950/50 flex flex-col justify-between">

        <div>
          {/* Phần Hình ảnh */}
          <div className="relative h-56 overflow-hidden bg-slate-800">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
                No image
              </div>
            )}
          </div>

          {/* Phần nội dung */}
          <div className="space-y-4 p-6">
            <div className="flex flex-wrap gap-2">
              {post.categories?.slice(0, 2).map((category) => (
                <span
                  key={category._id}
                  className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-indigo-300"
                >
                  {category.title}
                </span>
              ))}
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold leading-snug text-white transition-colors group-hover:text-indigo-400 line-clamp-2">
                {post.title}
              </h2>
              <p className="line-clamp-3 text-sm leading-relaxed text-slate-400">
                {post.excerpt || 'Đọc thêm để khám phá chi tiết và insight trong bài viết này.'}
              </p>
            </div>
          </div>
        </div>

        {/* Phần chân card: Tác giả & Ngày đăng */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-800/80 px-6 py-4 text-xs font-medium text-slate-400 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <UserCircle2 className="h-4 w-4 text-indigo-400" />
            <span>{post.author?.name || 'Admin'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-indigo-400" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
        </div>

      </article>
    </Link>
  );
}