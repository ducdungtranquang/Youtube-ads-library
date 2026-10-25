"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Search, Video, TrendingUp, Heart, LayoutDashboard, User, LogOut, Menu, X, NotebookText, Sparkles, Gift, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { toast } from "sonner"

export function Header() {
  const { user, signOut, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      const { error } = await signOut()
      if (error) {
        toast.error(error.message || 'Đăng xuất thất bại')
      } else {
        toast.success('Đăng xuất thành công')
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi không mong muốn')
    }
  }

  const navigationItems = [
    { href: "/", icon: Search, label: "Trang chủ" },
    { href: "/quicksearch", icon: Sparkles, label: "Quick Search" },
    { href: "/mkt", icon: TrendingUp, label: "Youtube Ads" },
    { href: "/facebook-ads-search", icon: Video, label: "Facebook Ads", badge: "1/11" },
    { href: "/affiliate", icon: Gift, label: "Tiếp thị", badge: "20%" },
    { href: "/favorites", icon: Heart, label: "Yêu thích" },
  ]
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/80">
      <div className="container px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* Logo Icon with DropdownMenu for Dashboard & Blog */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-slate-900 border border-indigo-500/30 shadow-lg shadow-indigo-600/20 hover:border-indigo-400 hover:ring-2 hover:ring-indigo-500/40 hover:scale-105 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 group"
                  title="Bấm để mở Bảng điều khiển & Blog"
                  aria-label="Menu logo"
                >
                  <div className="relative h-full w-full rounded-full overflow-hidden">
                    <Image
                      src="/ava_ads-spy_tool.png"
                      alt="Ads Spy Tool Logo"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Subtle chevron indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 border border-slate-900 text-white shadow-sm group-hover:bg-indigo-500 transition-colors">
                    <ChevronDown className="h-2.5 w-2.5" />
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-slate-950/95 backdrop-blur-xl border border-slate-800 text-slate-200 shadow-2xl p-1.5 z-50 rounded-xl"
                align="start"
                sideOffset={8}
              >
                <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Lối tắt nhanh</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Truy cập Dashboard & Blog</p>
                </div>

                <DropdownMenuItem asChild className="focus:bg-indigo-600/15 focus:text-indigo-300 cursor-pointer rounded-lg p-2.5 transition-colors">
                  <Link href="/dashboard" className="flex items-center gap-3 w-full">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <LayoutDashboard className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                        Bảng điều khiển
                        {pathname === "/dashboard" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">Thống kê tài khoản & lịch sử</div>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="focus:bg-sky-600/15 focus:text-sky-300 cursor-pointer rounded-lg p-2.5 transition-colors">
                  <Link href="/blog" className="flex items-center gap-3 w-full">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <NotebookText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                        Blog & Kiến thức
                        {pathname === "/blog" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">Kinh nghiệm chạy Ads & cập nhật</div>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-slate-800/80 my-1" />

                <DropdownMenuItem asChild className="focus:bg-slate-800/80 focus:text-white cursor-pointer rounded-lg px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors">
                  <Link href="/" className="flex items-center gap-2">
                    <Search className="h-3.5 w-3.5" />
                    <span>Về Trang chủ</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Brand text links to Home */}
            <Link href="/" className="flex items-center group">
              <span className="text-lg md:text-xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                Ads Spy Tool
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on 1024px and below */}
          <nav className="hidden xl:flex items-center gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive
                    ? 'text-indigo-400 border-b-2 border-indigo-500 pb-1'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 tracking-wider animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Menu Button - Show on 1024px and below */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="xl:hidden text-slate-300 hover:text-white hover:bg-slate-900">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Mở menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-slate-950 border-r border-slate-800 text-slate-100">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3 text-white">
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 border border-indigo-500/30 overflow-hidden">
                    <Image
                      src="/ava_ads-spy_tool.png"
                      alt="Ads Spy Tool Logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-4">
                {/* Navigation Items */}
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-lg p-3 text-sm font-medium transition-colors ${isActive
                        ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 tracking-wider animate-pulse">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}

                <div className="border-t border-slate-800 pt-3 space-y-1">
                  <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Hệ thống & Nội dung
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5 text-indigo-400" />
                    <span>Bảng điều khiển</span>
                  </Link>
                  <Link
                    href="/blog"
                    className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <NotebookText className="h-5 w-5 text-sky-400" />
                    <span>Blog & Kiến thức</span>
                  </Link>
                  <Link
                    href="/pricing"
                    className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <span>Bảng giá</span>
                  </Link>
                </div>

                {/* User Section in Mobile Menu */}
                {user ? (
                  <div className="border-t border-slate-800 pt-4 space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.user_metadata?.avatar_url}
                          alt={user.user_metadata?.full_name || user.email}
                        />
                        <AvatarFallback className="bg-indigo-600 text-white">
                          {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <p className="text-sm font-medium leading-none text-white truncate">
                          {user.user_metadata?.full_name || 'Người dùng'}
                        </p>
                        <p className="text-xs leading-none text-slate-400 mt-1 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/change-password"
                      className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      Đổi mật khẩu
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setMobileMenuOpen(false)
                      }}
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-slate-800 pt-4 space-y-2">
                    <Link
                      href="/login"
                      className="flex items-center justify-center rounded-lg p-3 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors border border-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center rounded-lg p-3 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Pricing Link - Hidden on mobile */}
          <Link href="/pricing" className="hidden xl:block">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-900">
              Bảng giá
            </Button>
          </Link>

          {loading ? (
            <div className="w-20 h-8 bg-slate-900 animate-pulse rounded hidden xl:block" />
          ) : user ? (
            /* Desktop User Dropdown - Hidden on mobile */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hidden xl:flex hover:bg-slate-900">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name || user.email}
                    />
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-200" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-white">
                      {user.user_metadata?.full_name || 'Người dùng'}
                    </p>
                    <p className="text-xs leading-none text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Bảng điều khiển
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Link href="/">
                    <Search className="mr-2 h-4 w-4" />
                    Trang chủ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Link href="/quicksearch">
                    <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
                    Quick Search
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Link href="/mkt">
                    <TrendingUp className="mr-2 h-4 w-4 text-emerald-400" />
                    YouTube Ads
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Link href="/facebook-ads-search" className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Video className="mr-2 h-4 w-4 text-cyan-400" />
                      Facebook Ads
                    </div>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs animate-pulse">
                      1/11
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Link href="/favorites">
                    <Heart className="mr-2 h-4 w-4" />
                    Yêu thích
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Link href="/affiliate" className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Gift className="mr-2 h-4 w-4 text-emerald-400" />
                      Tiếp thị (Affiliate)
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400 border border-emerald-400/30">
                      20%
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Link href="/change-password">
                    <User className="mr-2 h-4 w-4" />
                    Đổi mật khẩu
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem onClick={handleSignOut} className="focus:bg-rose-500/20 focus:text-rose-400 cursor-pointer text-rose-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Desktop Auth Buttons - Hidden on mobile */
            <div className="hidden xl:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-900">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30">
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}