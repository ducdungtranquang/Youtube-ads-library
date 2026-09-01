import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function BlogPagination({ currentPage, totalPages, basePath }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Link
        href={currentPage <= 1 ? `${basePath}?page=1` : `${basePath}?page=${currentPage - 1}`}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
          currentPage <= 1
            ? 'pointer-events-none border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        <ChevronLeft className="h-4 w-4" />
        Trang trước
      </Link>

      {pageNumbers.map((pageNumber) => {
        const isActive = pageNumber === currentPage;
        return (
          <Link
            key={pageNumber}
            href={`${basePath}?page=${pageNumber}`}
            className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors ${
              isActive
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {pageNumber}
          </Link>
        );
      })}

      <Link
        href={currentPage >= totalPages ? `${basePath}?page=${totalPages}` : `${basePath}?page=${currentPage + 1}`}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
          currentPage >= totalPages
            ? 'pointer-events-none border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
        }`}
      >
        Trang sau
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
