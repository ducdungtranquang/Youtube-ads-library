"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Search, Video, TrendingUp, Heart, LayoutDashboard, User, LogOut, Menu, X, NotebookText } from "lucide-react"
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
    { href: "/mkt", icon: TrendingUp, label: "Youtube Ads" },
    { href: "/facebook-ads-search", icon: Video, label: "Facebook Ads" },
    { href: "/blog", icon: NotebookText, label: "Blog" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Bảng điều khiển" },
    { href: "/favorites", icon: Heart, label: "Yêu thích" },
  ]
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/80">
      <div className="container px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-600/30">
              <Video className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold text-white tracking-tight">Ads Spy Tool</span>
          </Link>

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
                  {item.label}
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
                <SheetTitle className="flex items-center gap-2 text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                    <Video className="h-4 w-4 text-white" />
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
                      className={`flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors ${isActive
                          ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}

                <div className="border-t border-slate-800 pt-4">
                  <Link
                    href="/pricing"
                    className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <TrendingUp className="h-5 w-5" />
                    Bảng giá
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
                  <Link href="/facebook-ads-search">
                    <Video className="mr-2 h-4 w-4" />
                    Facebook Ads
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white cursor-pointer">
                  <Link href="/favorites">
                    <Heart className="mr-2 h-4 w-4" />
                    Yêu thích
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