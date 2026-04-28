"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Film,
  Ticket,
  Gift,
  Phone,
  User,
  LogOut,
  Home,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";


export function Header() {
  const { currentUser, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 transition-all">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm transition-all group-hover:scale-105">
            <Film className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-slate-900">
            CinemaHub
          </span>
        </Link>

        {/* Search Bar */}
        {/* <div className="hidden md:block flex-1 max-w-md mx-4">
          <MovieSearch />
        </div> */}

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            href="/events"
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:text-primary hover:bg-slate-50"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden lg:inline">Sự kiện</span>
          </Link>

          <Link
            href="/cinemas"
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:text-primary hover:bg-slate-50"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden lg:inline">Rạp chiếu</span>
          </Link>

          <Link
            href="/account/order-history"
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:text-primary hover:bg-slate-50"
          >
            <Ticket className="h-4 w-4" />
            <span className="hidden lg:inline">Lịch sử đơn</span>
          </Link>

          <Link
            href="/about"
            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:text-primary hover:bg-slate-50"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden lg:inline">Liên hệ</span>
          </Link>

          {/* Admin Panel Link - Only visible to admins */}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="group relative flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-2 lg:px-4 py-2 text-sm font-medium text-primary transition-all hover:border-primary/50 hover:bg-primary/10 whitespace-nowrap"
            >
              <Shield className="h-4 w-4" />
              <span className="relative z-10 hidden lg:inline">Quản trị</span>
            </Link>
          )}

          {/* User Menu */}
          <div className="ml-4 flex items-center gap-2 border-l border-border/40 pl-4">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="group relative flex items-center gap-2 rounded-xl border-2 border-border bg-card px-3 py-2 transition-all hover:border-primary hover:shadow-lg">
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={
                          currentUser.role === "user"
                            ? currentUser.avatar || "/user.png"
                            : "/user.png"
                        }
                        alt={
                          currentUser.role === "user"
                            ? currentUser.fullname
                            : currentUser.name
                        }
                      />
                      <AvatarFallback className="text-xs">
                        {currentUser.role === "user"
                          ? currentUser.fullname?.substring(0, 2) ||
                            currentUser.email?.substring(0, 2)?.toUpperCase() ||
                            "U"
                          : currentUser.name?.substring(0, 2) || "A"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium sm:inline">
                      {currentUser.role === "user"
                        ? currentUser.fullname?.split(" ").slice(-1)[0]
                        : currentUser.name?.split(" ").slice(-1)[0] || "Admin"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p className="text-sm font-medium">
                      {currentUser.role === "user"
                        ? currentUser.fullname
                        : currentUser.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser.role === "user" ? currentUser.email : ""}
                    </p>
                    {isAdmin && (
                      <p className="mt-1 text-xs font-medium text-primary">
                        👑 Administrator
                      </p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {!isAdmin ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/account/profile"
                          className="flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          <span>Hồ sơ</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/account/order-history"
                          className="flex items-center gap-2"
                        >
                          <Ticket className="h-4 w-4" />
                          <span>Lịch sử đơn</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  ) : (
                    ""
                  )}

                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/account/login">Đăng nhập</Link>
                </Button>
                <Button size="sm" asChild className="shadow-md">
                  <Link href="/account/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
