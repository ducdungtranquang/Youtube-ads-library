"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { REFERRAL_COOKIE_NAME, REFERRAL_COOKIE_MAX_AGE } from "@/lib/affiliate"

function TrackerInner() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const refCode = searchParams.get("ref") || searchParams.get("aff") || searchParams.get("referral")
    if (refCode && typeof window !== "undefined") {
      const clean = refCode.trim().toUpperCase()
      const existing = localStorage.getItem(REFERRAL_COOKIE_NAME)

      // Only track if it's a new or different refCode
      if (existing !== clean) {
        localStorage.setItem(REFERRAL_COOKIE_NAME, clean)
        document.cookie = `${REFERRAL_COOKIE_NAME}=${clean}; max-age=${REFERRAL_COOKIE_MAX_AGE}; path=/; SameSite=Lax`

        // Send tracking ping to server
        fetch("/api/affiliate/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ referralCode: clean, eventType: "click" }),
        }).catch((err) => console.warn("Referral tracking error:", err))
      }
    }
  }, [searchParams])

  return null
}

export function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  )
}
