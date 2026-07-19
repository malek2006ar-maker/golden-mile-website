"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail, Shield, AlertCircle, Info } from "lucide-react";
import toast from "react-hot-toast";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // تحقق لو المستخدم مسجل دخوله بالفعل
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) router.push(fromPath);
      })
      .catch(() => {});
  }, [router, fromPath]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "حدث خطأ");
        toast.error(data.message || "فشل تسجيل الدخول");
        return;
      }

      toast.success(`مرحباً ${data.user.name}!`);
      router.push(fromPath);
      router.refresh();
    } catch (err) {
      setError("تعذر الاتصال بالسيرفر، حاول مرة أخرى");
      toast.error("تعذر الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="lg:hidden text-center space-y-3">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-600 to-gold-300 items-center justify-center">
          <Shield className="w-8 h-8 text-ink-900" />
        </div>
        <h1 className="text-2xl font-extrabold text-gradient-gold">الميل الذهبي</h1>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-white font-tajawal">مرحباً بعودتك 👋</h2>
        <p className="text-sm text-slate-400 mt-1.5">سجّل دخولك للوصول للوحة التحكم</p>
      </div>

      {/* Demo credentials hint */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-info/10 border border-info/30 text-info text-xs animate-fade-in-up">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold mb-1">بيانات تجريبية:</p>
          <p className="font-mono text-[11px]">admin@goldenmile.com.sa</p>
          <p className="font-mono text-[11px]">Admin@2026</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm animate-fade-in-up">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@goldenmile.com.sa"
              className="input pr-10"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-300">
              كلمة المرور
            </label>
            <button type="button" className="text-xs text-gold-300 hover:text-gold-100 transition-colors">
              نسيت كلمة المرور؟
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input pr-10 pl-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-ink-900 text-gold-600 focus:ring-gold-600/30"
          />
          <span className="text-sm text-slate-300">تذكرني على هذا الجهاز</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn-gold w-full py-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري الدخول...</span>
            </>
          ) : (
            <span>تسجيل الدخول</span>
          )}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-ink-900 px-3 text-xs text-slate-500">أو</span>
          </div>
        </div>

        <Link
          href="https://goldmil.matrxe.com"
          className="btn-outline-gold w-full py-3"
        >
          العودة للموقع الرئيسي
        </Link>
      </form>

      <p className="text-center text-xs text-slate-500">
        بتسجيل الدخول فأنت توافق على{" "}
        <a href="#" className="text-gold-300 hover:text-gold-100">شروط الاستخدام</a>
        {" "}و{" "}
        <a href="#" className="text-gold-300 hover:text-gold-100">سياسة الخصوصية</a>
      </p>
    </div>
  );
}