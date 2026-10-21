'use client'

import Link from 'next/link'
import { Sparkles, Zap, ShieldAlert, ArrowUpRight } from 'lucide-react'
import { QuotaStatus } from '@/lib/search-quota'

interface SearchQuotaBadgeProps {
  quota: QuotaStatus
  onUpgradeClick?: () => void
  className?: string
}

export function SearchQuotaBadge({
  quota,
  onUpgradeClick,
  className = '',
}: SearchQuotaBadgeProps) {
  const { plan, limit, used, remaining, isUnlimited, feature } = quota
  const featureLabel = feature === 'yt' ? 'YouTube' : 'Facebook'

  if (isUnlimited) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 border border-purple-200 text-purple-700 shadow-2xs ${className}`}
      >
        <Zap className="h-3.5 w-3.5 text-purple-600" />
        <span>Gói Doanh Nghiệp: Tìm kiếm Không Giới Hạn ∞</span>
      </div>
    )
  }

  if (plan === 'personal') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-900 shadow-2xs ${className}`}
      >
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <span>
            Gói Cá Nhân: Còn <strong className="text-indigo-700">{remaining}/{limit}</strong> lượt hôm nay
          </span>
        </span>
        {onUpgradeClick ? (
          <button
            type="button"
            onClick={onUpgradeClick}
            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-purple-600 hover:text-purple-800 underline cursor-pointer ml-1"
          >
            Lên Max
            <ArrowUpRight className="h-3 w-3" />
          </button>
        ) : (
          <Link
            href="/pricing"
            className="inline-flex items-center gap-0.5 text-[11px] font-bold text-purple-600 hover:text-purple-800 underline ml-1"
          >
            Lên Max
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    )
  }

  // Free plan
  const hasRemaining = remaining > 0

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border shadow-2xs transition-colors ${
        hasRemaining
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-rose-50 border-rose-200 text-rose-900 animate-pulse'
      } ${className}`}
    >
      <span className="flex items-center gap-1.5">
        {hasRemaining ? (
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
        )}
        <span>
          Gói Miễn phí ({featureLabel}):{' '}
          {hasRemaining ? (
            <span>
              Còn <strong className="text-emerald-700 font-bold">{remaining}/{limit} lượt</strong> hôm nay
            </span>
          ) : (
            <strong className="text-rose-700 font-bold">Hết lượt hôm nay (0/{limit})</strong>
          )}
        </span>
      </span>

      {onUpgradeClick ? (
        <button
          type="button"
          onClick={onUpgradeClick}
          className="inline-flex items-center gap-0.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer ml-1"
        >
          Nâng cấp (25 lượt)
          <ArrowUpRight className="h-3 w-3" />
        </button>
      ) : (
        <Link
          href="/pricing"
          className="inline-flex items-center gap-0.5 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline ml-1"
        >
          Nâng cấp (25 lượt)
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  )
}
