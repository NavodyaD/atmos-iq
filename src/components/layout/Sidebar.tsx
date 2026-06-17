"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Newspaper, Clock, Map, X, CloudLightning } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Weather News",
    href: "/weather-news",
    icon: Newspaper,
  },
  {
    title: "Hourly Forecast",
    href: "/hourly-forecast",
    icon: Clock,
  },
  {
    title: "Weather Map",
    href: "/weather-map",
    icon: Map,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 -translate-x-full border-r bg-background transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0",
          isOpen && "translate-x-0"
        )}
      >
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

        <div className="flex flex-col gap-2 p-4">
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
      </aside>
    </>
  );
}
