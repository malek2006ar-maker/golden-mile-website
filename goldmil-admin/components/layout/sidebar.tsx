"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, FolderKanban, Users, MessageSquare,
  Palette, ShoppingBag, BookOpen, Star, UserCog, BarChart3,
  Settings, LogOut, ChevronLeft, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const navSections = [
  {
    title: "الرئيسية",
    items: [
      { href: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard, roles: ["admin", "manager", "editor", "viewer"] },
      { href: "/dashboard/analytics", label: "التحليلات", icon: BarChart3, roles: ["admin", "manager"] },
    ],
  },
  {
    title: "إدارة الأعمال",
    items: [
      { href: "/dashboard/projects", label: "المشاريع", icon: FolderKanban, roles: ["admin", "manager", "editor"] },
      { href: "/dashboard/customers", label: "العملاء", icon: Users, roles: ["admin", "manager", "editor"] },
      { href: "/dashboard/inquiries", label: "الاستفسارات", icon: MessageSquare, roles: ["admin", "manager", "editor"] },
      { href: "/dashboard/design-studio", label: "استوديو التصميم", icon: Palette, roles: ["admin", "manager", "editor"] },
    ],
  },
  {
    title: "المحتوى والمتجر",
    items: [
      { href: "/dashboard/store", label: "المتجر", icon: ShoppingBag, roles: ["admin", "manager", "editor"] },
      { href: "/dashboard/blog", label: "المدونة", icon: BookOpen, roles: ["admin", "editor"] },
      { href: "/dashboard/testimonials", label: "آراء العملاء", icon: Star, roles: ["admin", "manager"] },
    ],
  },
  {
    title: "النظام",
    items: [
      { href: "/dashboard/users", label: "المستخدمون", icon: UserCog, roles: ["admin"] },
      { href: "/dashboard/settings", label: "الإعدادات", icon: Settings, roles: ["admin", "manager", "editor", "viewer"] },
    ],
  },
];

export function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  // فلترة العناصر حسب الدور
  const filteredSections = navSections
    .map((s) => ({
      ...s,
      items: s.items.filter((item) => item.roles.includes(userRole)),
    }))
    .filter((s) => s.items.length > 0);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("تم تسجيل الخروج");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("حدث خطأ");
    }
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 right-0 lg:right-auto h-screen z-50",
          "bg-ink-800/95 backdrop-blur-xl border-l border-white/5",
          "transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-72",
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/5 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="logo-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c8962e" />
                    <stop offset="50%" stopColor="#f0c75e" />
                    <stop offset="100%" stopColor="#d4a843" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" stroke="url(#logo-gradient)" strokeWidth="3" fill="none" />
                <path
                  d="M 28 72 C 38 65, 52 48, 55 35 C 57 25, 48 20, 42 22 C 35 25, 30 35, 32 45 C 34 52, 45 62, 58 60 C 70 58, 75 42, 74 32 C 73 25, 68 20, 68 20"
                  stroke="url(#logo-gradient)" strokeWidth="6" strokeLinecap="round" fill="none"
                />
                <path d="M 68 20 L 76 22 L 72 30 Z" fill="url(#logo-gradient)" />
              </svg>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-gradient-gold">الميل الذهبي</span>
                <span className="text-[10px] text-slate-500 tracking-wider">لوحة التحكم</span>
              </div>
            )}
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {filteredSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <h3 className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-3 mb-2">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                          "text-sm font-semibold transition-all duration-200 relative group",
                          active
                            ? "bg-gradient-to-l from-gold-600/20 to-gold-600/5 text-gold-300 border border-gold-600/30 shadow-glow"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <Icon className={cn("w-5 h-5 flex-shrink-0", active && "text-gold-300")} />
                        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                        {active && !collapsed && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-gold-600 to-gold-300 rounded-l" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5 flex-shrink-0 space-y-1">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
              "text-sm font-semibold text-slate-400 hover:text-danger hover:bg-danger/5",
              "transition-all duration-200"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>تسجيل الخروج</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-gold-300 hover:bg-white/5 transition-all"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", !collapsed && "rotate-180")} />
            {!collapsed && <span>طي القائمة</span>}
          </button>
        </div>
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-30 p-2.5 rounded-xl glass border border-gold-600/30 text-gold-300"
      >
        <LayoutDashboard className="w-5 h-5" />
      </button>
    </>
  );
}