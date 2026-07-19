import { LoginForm } from "@/components/forms/login-form";
import { ShieldCheck, Sparkles, Activity } from "lucide-react";

export const metadata = {
  title: "تسجيل الدخول - لوحة تحكم الميل الذهبي",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side — branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 overflow-hidden items-center justify-center p-12">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-600/10 blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-300/5 blur-[150px]" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c8962e" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-md text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <svg viewBox="0 0 100 100" className="w-24 h-24">
              <defs>
                <linearGradient id="loginLogoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c8962e" />
                  <stop offset="50%" stopColor="#f0c75e" />
                  <stop offset="100%" stopColor="#d4a843" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="45" stroke="url(#loginLogoGrad)" strokeWidth="3" fill="none" />
              <path
                d="M 28 72 C 38 65, 52 48, 55 35 C 57 25, 48 20, 42 22 C 35 25, 30 35, 32 45 C 34 52, 45 62, 58 60 C 70 58, 75 42, 74 32 C 73 25, 68 20, 68 20"
                stroke="url(#loginLogoGrad)" strokeWidth="6" strokeLinecap="round" fill="none"
              />
              <path d="M 68 20 L 76 22 L 72 30 Z" fill="url(#loginLogoGrad)" />
            </svg>
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-gradient-gold font-tajawal mb-3">
              لوحة تحكم الميل الذهبي
            </h1>
            <p className="text-slate-400 leading-relaxed">
              إدارة شاملة لمشاريع المقاولات والديكورات. تابع مشاريعك، عملاءك، طلباتك، ومحتواك من مكان واحد.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6">
            {[
              { icon: ShieldCheck, label: "آمن" },
              { icon: Sparkles, label: "ذكي" },
              { icon: Activity, label: "فوري" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gold-600/10 border border-gold-600/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gold-300" />
                </div>
                <p className="text-xs font-bold text-slate-300">{label}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 pt-6">
            © 2026 مؤسسة الميل الذهبي للمقاولات والديكورات
          </p>
        </div>
      </div>

      {/* Right side — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-ink-900">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}