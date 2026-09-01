import Link from 'next/link';
import { FolderOpen } from 'lucide-react';
import type { BlogCategory } from '@/sanity/queries';

interface BlogShellProps {
  categories: BlogCategory[];
  selectedCategorySlug?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function BlogShell({ categories, selectedCategorySlug, title, description, children }: BlogShellProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:px-10">
      <div className="mb-8 rounded-3xl border border-indigo-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-8 text-white shadow-xl shadow-indigo-950/20 md:px-10">
        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.12em] text-indigo-200">
          <FolderOpen className="h-4 w-4" />
          Blog & Insights
        </div>
        <h1 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">{description}</p> : null}
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Categories</h2>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {categories.length}
            </span>
          </div>

          <div className="space-y-2">
            <Link
              href="/blog"
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                !selectedCategorySlug
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <span>Tất cả</span>
            </Link>

            {categories.map((category) => {
              const isActive = String(category.slug) === String(selectedCategorySlug ?? '');
              return (
                <Link
                  key={category._id}
                  href={`/blog/category/${category.slug}`}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  <span>{category.title}</span>
                </Link>
              );
            })}
          </div>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
