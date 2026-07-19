/**
 * ════════════════════════════════════════════════════════════════
 *  سنـيبـت تكامل نموذج الاتصال — لوحة الميل الذهبي
 * ════════════════════════════════════════════════════════════════
 *
 *  ألصق هذا المكون في صفحة "اتصل بنا" داخل مشروع goldmil.matrxe.com
 *  أو استخدم الـ handler مباشرة مع النموذج الموجود عندك.
 *
 *  الاستخدام:
 *    1. ضع ADMIN_API_URL = "https://admin.goldmil.matrxe.com"
 *    2. ألصق النموذج في /contact page
 *    3. تأكد من CORS في الـ API (مفعّل بالفعل)
 */

"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

const ADMIN_API_URL =
  process.env.NEXT_PUBLIC_ADMIN_API_URL || "https://admin.goldmil.matrxe.com";

export function ContactFormWithAdmin() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch(`${ADMIN_API_URL}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "contact_form",
          priority: "medium",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setError(data.message || "حدث خطأ، حاول مرة أخرى");
      }
    } catch (err) {
      setError("تعذر الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="inline-flex w-16 h-16 rounded-full bg-gold-600/10 border border-gold-600/30 items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-gold-300" />
        </div>
        <h3 className="text-xl font-bold text-white">تم استلام رسالتك بنجاح!</h3>
        <p className="text-sm text-slate-400">سنتواصل معك خلال 24 ساعة. شكراً لاهتمامك.</p>
        <button
          onClick={() => setSuccess(false)}
          className="btn-outline-gold text-sm py-2 px-4"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">الاسم الكامل *</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">البريد الإلكتروني *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-600 focus:outline-none"
            dir="ltr"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">رقم الجوال *</label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-600 focus:outline-none"
            dir="ltr"
            placeholder="+966 5X XXX XXXX"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">الموضوع</label>
          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-600 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-300 mb-2">الرسالة *</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-gold-600 focus:outline-none resize-none"
        />
      </div>

      <button type="submit" disabled={loading} className="btn-gold w-full py-3">
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        <span>{loading ? "جاري الإرسال..." : "إرسال الرسالة"}</span>
      </button>
    </form>
  );
}

/**
 * ════════════════════════════════════════════════════════════════
 *  للاستخدام مع نموذج موجود — دالة Vanilla JS
 * ════════════════════════════════════════════════════════════════
 *
 *  ألصق في أي صفحة HTML/JSX:
 */

/*
async function submitContactForm(formData) {
  const res = await fetch('https://admin.goldmil.matrxe.com/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject || 'استفسار من الموقع',
      message: formData.message,
      source: 'contact_form',
      priority: 'medium',
    }),
  });
  return await res.json();
}
*/