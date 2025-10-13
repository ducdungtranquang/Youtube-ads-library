"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { ClientOnly } from "@/components/client-only"
import { useAuth } from "@/contexts/auth-context"
import { RateLimiter } from "@/lib/utils"
import { Video, Loader2, ArrowLeft, Clock } from "lucide-react"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check rate limit (3 attempts per 15 minutes)
    const rateLimitResult = RateLimiter.canAttempt('forgot_password', email, 3, 15 * 60 * 1000)
    
    if (!rateLimitResult.canAttempt) {
      const remainingTime = RateLimiter.getRemainingTimeText(rateLimitResult.remainingTime || 0)
      toast.error(`Too many password reset attempts. Please try again in ${remainingTime}.`, {
        duration: 5000,
        icon: <Clock className="h-4 w-4" />
      })
      return
    }

    setLoading(true)

    try {
      // Record this attempt
      RateLimiter.recordAttempt('forgot_password', email)

      const { error } = await resetPassword(email)
      if (error) {
        toast.error(error.message || 'Failed to send reset email')
      } else {
        setSent(true)
        toast.success('Password reset email sent! Check your inbox.')
        
        // Show remaining attempts if not the last one
        if (rateLimitResult.attemptsLeft !== undefined && rateLimitResult.attemptsLeft > 0) {
          toast.info(`You have ${rateLimitResult.attemptsLeft} more attempt${rateLimitResult.attemptsLeft > 1 ? 's' : ''} remaining.`, {
            duration: 3000
          })
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container flex items-center justify-center py-20">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Video className="h-6 w-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl">Check your email</CardTitle>
              <CardDescription>
                We've sent a password reset link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>Didn't receive the email? Check your spam folder or</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full bg-transparent"
                onClick={() => {
                  // Check if user can try again
                  const rateLimitResult = RateLimiter.canAttempt('forgot_password', email, 3, 15 * 60 * 1000)
                  if (!rateLimitResult.canAttempt) {
                    const remainingTime = RateLimiter.getRemainingTimeText(rateLimitResult.remainingTime || 0)
                    toast.error(`Please wait ${remainingTime} before trying again.`, {
                      duration: 5000,
                      icon: <Clock className="h-4 w-4" />
                    })
                    return
                  }
                  setSent(false)
                }}
              >
                Try again
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline">
                  Back to sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container flex items-center justify-center py-20">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Video className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Forgot your password?</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {/* Rate limit warning */}
              <ClientOnly>
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-800">
                      <p className="font-medium">Rate limit protection</p>
                      <p>You can request password reset up to 3 times per 15 minutes to prevent spam.</p>
                    </div>
                  </div>
                </div>
              </ClientOnly>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset email...
                  </>
                ) : (
                  'Send reset email'
                )}
              </Button>
            </form>

            <div className="flex items-center justify-center">
              <Link 
                href="/login" 
                className="flex items-center text-sm text-primary hover:underline"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}