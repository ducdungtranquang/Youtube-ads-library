"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Search, Video, TrendingUp, Heart, LayoutDashboard, User, LogOut, Menu, X } from "lucide-react"
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
    { href: "/quicksearch", icon: Search, label: "Tìm kiếm nhanh" },
    { href: "/mkt", icon: TrendingUp, label: "Marketing" },
    { href: "/facebook-ads-search", icon: Video, label: "Facebook Ads" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Bảng điều khiển" },
    { href: "/favorites", icon: Heart, label: "Yêu thích" },
  ]
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Video className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="mobile:text-lg tablet:text-xl font-bold text-foreground">YouTube ADS Library</span>
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
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-primary border-b-2 border-primary pb-1' 
                      : 'text-muted-foreground hover:text-foreground'
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
              <Button variant="ghost" size="sm" className="xl:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Mở menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Video className="h-4 w-4 text-primary-foreground" />
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
                      className={`flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-primary bg-primary/10 border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}
                
                <div className="border-t border-border pt-4">
                  <Link
                    href="/pricing"
                    className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <TrendingUp className="h-5 w-5" />
                    Bảng giá
                  </Link>
                </div>

                {/* User Section in Mobile Menu */}
                {user ? (
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex items-center gap-3 p-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={user.user_metadata?.avatar_url} 
                          alt={user.user_metadata?.full_name || user.email} 
                        />
                        <AvatarFallback>
                          {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || 'Người dùng'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/change-password"
                      className="flex items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
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
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-border pt-4 space-y-2">
                    <Link
                      href="/login"
                      className="flex items-center justify-center rounded-lg p-3 text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center rounded-lg p-3 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
            <Button variant="ghost" size="sm">
              Bảng giá
            </Button>
          </Link>

          {loading ? (
            <div className="w-20 h-8 bg-accent animate-pulse rounded hidden xl:block" />
          ) : user ? (
            /* Desktop User Dropdown - Hidden on mobile */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full hidden xl:flex">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user.user_metadata?.avatar_url} 
                      alt={user.user_metadata?.full_name || user.email} 
                    />
                    <AvatarFallback>
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.user_metadata?.full_name || 'Người dùng'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Bảng điều khiển
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/quicksearch">
                    <Search className="mr-2 h-4 w-4" />
                    Tìm kiếm nhanh
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/facebook-ads-search">
                    <Video className="mr-2 h-4 w-4" />
                    Facebook Ads
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites">
                    <Heart className="mr-2 h-4 w-4" />
                    Yêu thích
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/change-password">
                    <User className="mr-2 h-4 w-4" />
                    Đổi mật khẩu
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Desktop Auth Buttons - Hidden on mobile */
            <div className="hidden xl:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
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
