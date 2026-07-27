"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Newspaper, Clock, Map, X, CloudLightning, Bookmark, LogIn, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Weather News", href: "/weather-news", icon: Newspaper },
  { title: "Hourly Forecast", href: "/hourly-forecast", icon: Clock },
  { title: "Weather Map", href: "/weather-map", icon: Map },
  { title: "Saved Cities", href: "/saved-cities", icon: Bookmark },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 -translate-x-full border-r bg-background transition-transform duration-300 ease-in-out md:sticky md:top-0 md:translate-x-0 md:z-0 flex flex-col shrink-0",
          isOpen && "translate-x-0"
        )}
      >
        {/* Logo — mobile only */}
        <div className="flex h-16 items-center justify-between px-6 border-b md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <CloudLightning className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Atmos IQ</span>
          </div>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-muted rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
          <div className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose()}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile Section at bottom */}
        <div className="border-t p-4">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 bg-muted/50">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    className="h-8 w-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                    {initials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 border border-primary/20 px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Sign In to Save Cities
            </button>
          )}
        </div>
      </aside>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="login"
      />
    </>
  );
}
