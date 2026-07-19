"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Search, ChevronDown, Globe, LogOut } from "lucide-react";
import { getInitials, getAvatarColor, timeAgo, cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface TopbarProps {
  user: UserInfo;
}

export function Topbar({ user }: TopbarProps) {
  const router = useRouter();
  const [now, setNow] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications (last activities)
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        new Intl.DateTimeFormat("ar-SA", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(d)
      );
    };
    tick();
    const id = setInterval(tick, 60_000);

    // Load activities as notifications
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        setNotifications(d.activities || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => clearInterval(id);
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("تم تسجيل الخروج");
      router.push("/login");
    } catch {
      toast.error("حدث خطأ");
    }
  }

  return (
    <header className="sticky top-0 z-30 glass border-b border-gold-600/10 h-20 flex items-center px-4 sm:px-6 gap-4">
      <div className="hidden md:block">
        <p className="text-xs text-slate-500">{now}</p>
        <p className="text-sm font-bold text-gold-300">مرحباً بعودتك، {user.name.split(" ")[0]} 👋</p>
      </div>

      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="search"
            placeholder="بحث في المشاريع، العملاء، الاستفسارات..."
            className="w-full bg-ink-900/60 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:border-gold-600/50 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-2">
        <a
          href={process.env.NEXT_PUBLIC_SITE_URL || "https://goldmil.matrxe.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-gold-300 hover:bg-white/5 transition-colors"
        >
          <Globe className="w-4 h-4" />
          <span>الموقع الرئيسي</span>
        </a>

        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2.5 rounded-xl text-slate-300 hover:text-gold-300 hover:bg-white/5 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-ink-800 animate-pulse-gold" />
            )}
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute left-0 mt-2 w-80 max-w-[calc(100vw-2rem)] glass rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="font-bold text-gold-300">النشاط الأخير</h3>
                  <span className="text-xs text-slate-500">{notifications.length} عنصر</span>
                </div>
                <ul className="max-h-96 overflow-y-auto divide-y divide-white/5">
                  {loading ? (
                    <li className="p-8 text-center text-slate-500 text-sm">جاري التحميل...</li>
                  ) : notifications.length === 0 ? (
                    <li className="p-8 text-center text-slate-500 text-sm">لا توجد إشعارات</li>
                  ) : (
                    notifications.slice(0, 8).map((n) => (
                      <li key={n.id} className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex items-start gap-3">
                          <span className="mt-1 w-2 h-2 rounded-full bg-gold-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white line-clamp-1">{n.title}</p>
                            {n.description && (
                              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{n.description}</p>
                            )}
                            <p className="text-[10px] text-slate-500 mt-1">{timeAgo(n.createdAt)}</p>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(user.name)} flex items-center justify-center text-xs font-extrabold text-ink-900`}>
                {getInitials(user.name)}
              </div>
            )}
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-500">{user.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
          </button>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              <div className="absolute left-0 mt-2 w-56 glass rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-up">
                <div className="p-4 border-b border-white/5">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400 mt-1 truncate">{user.email}</p>
                </div>
                <ul className="p-2">
                  <li>
                    <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-gold-300 transition-colors">
                      الملف الشخصي
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-gold-300 transition-colors">
                      الإعدادات
                    </Link>
                  </li>
                  <li>
                    <a href={process.env.NEXT_PUBLIC_SITE_URL || "https://goldmil.matrxe.com"} target="_blank" rel="noopener noreferrer" className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-gold-300 transition-colors">
                      الموقع الرئيسي
                    </a>
                  </li>
                  <li className="border-t border-white/5 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-right px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger/5 transition-colors inline-flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      تسجيل الخروج
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}