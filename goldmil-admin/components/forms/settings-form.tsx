"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Bell, Lock, User, Palette, Globe, Database, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

interface UserInfo {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  avatar: string | null;
}

interface SettingsFormProps {
  user: UserInfo;
  settings: Record<string, string>;
}

const sections = [
  { id: "profile", label: "الملف الشخصي", icon: User },
  { id: "security", label: "الأمان", icon: Lock },
  { id: "notifications", label: "الإشعارات", icon: Bell },
  { id: "appearance", label: "المظهر", icon: Palette },
  { id: "site", label: "إعدادات الموقع", icon: Globe },
  { id: "integrations", label: "التكاملات", icon: Database },
];

export function SettingsForm({ user, settings }: SettingsFormProps) {
  const router = useRouter();
  const [active, setActive] = useState("profile");
  const [saving, setSaving] = useState(false);

  // Profile state
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");

  // Security state
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // Site settings state
  const [siteName, setSiteName] = useState(settings.site_name || "");
  const [sitePhone, setSitePhone] = useState(settings.site_phone || "");
  const [siteEmail, setSiteEmail] = useState(settings.site_email || "");
  const [siteAddress, setSiteAddress] = useState(settings.site_address || "");
  const [siteUrl, setSiteUrl] = useState(settings.site_url || "");
  const [workingHours, setWorkingHours] = useState(settings.working_hours || "");
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsapp_number || "");

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, name, phone }),
      });
      if (res.ok) {
        toast.success("تم حفظ الملف الشخصي");
        router.refresh();
      } else {
        toast.error("فشل الحفظ");
      }
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (newPwd.length < 8) return toast.error("كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل");
    if (newPwd !== confirmPwd) return toast.error("كلمات المرور غير متطابقة");
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, password: newPwd, currentPassword: currentPwd }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("تم تغيير كلمة المرور");
        setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
      } else {
        toast.error(data.error || "فشل التغيير");
      }
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  async function saveSiteSettings() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site_name: siteName,
          site_phone: sitePhone,
          site_email: siteEmail,
          site_address: siteAddress,
          site_url: siteUrl,
          working_hours: workingHours,
          whatsapp_number: whatsappNumber,
        }),
      });
      if (res.ok) toast.success("تم حفظ إعدادات الموقع");
      else toast.error("فشل الحفظ");
    } catch {
      toast.error("حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="lg:col-span-1">
        <nav className="card p-2 space-y-1">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active === s.id
                    ? "bg-gradient-to-l from-gold-600/20 to-gold-600/5 text-gold-300 border border-gold-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="lg:col-span-3 space-y-6">
        {active === "profile" && (
          <div className="card p-6 space-y-6">
            <h2 className="text-lg font-bold text-white">الملف الشخصي</h2>
            <div className="flex items-center gap-4">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <Avatar name={user.name} size="lg" />
              )}
              <div>
                <p className="text-sm font-bold text-white">{user.name}</p>
                <p className="text-[11px] text-slate-500">{user.email}</p>
                <p className="text-[10px] text-gold-300 mt-1">دور: {user.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">الاسم الكامل</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">البريد الإلكتروني</label>
                <input className="input" value={user.email} disabled />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">رقم الجوال</label>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">الدور</label>
                <input className="input" value={user.role} disabled />
              </div>
            </div>

            <button onClick={saveProfile} disabled={saving} className="btn-gold">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>حفظ التغييرات</span>
            </button>
          </div>
        )}

        {active === "security" && (
          <div className="card p-6 space-y-6">
            <h2 className="text-lg font-bold text-white">الأمان</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">كلمة المرور الحالية</label>
                <input className="input" type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">كلمة المرور الجديدة</label>
                  <input className="input" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="8 أحرف على الأقل" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">تأكيد كلمة المرور</label>
                  <input className="input" type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
                </div>
              </div>
            </div>

            <button onClick={changePassword} disabled={saving || !newPwd} className="btn-gold">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>تغيير كلمة المرور</span>
            </button>
          </div>
        )}

        {active === "notifications" && (
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-white mb-2">الإشعارات</h2>
            {[
              { label: "استفسار جديد", desc: "إشعار عند وصول استفسار جديد", key: "inq_new" },
              { label: "مشروع جديد", desc: "إشعار عند إضافة مشروع جديد", key: "proj_new" },
              { label: "تعليقات العملاء", desc: "إشعار عند تقييم جديد", key: "test_new" },
              { label: "تحديث المخزون", desc: "تنبيه عند انخفاض المخزون", key: "stock_low" },
              { label: "تقارير أسبوعية", desc: "ملخص أداء كل أسبوع", key: "weekly_report" },
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-white/2 cursor-pointer">
                <div>
                  <p className="text-sm font-bold text-white">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-white/20 bg-ink-900 text-gold-600 focus:ring-gold-600/30"
                />
              </label>
            ))}
          </div>
        )}

        {active === "appearance" && (
          <div className="card p-6 space-y-6">
            <h2 className="text-lg font-bold text-white">المظهر</h2>
            <div>
              <p className="text-xs font-bold text-slate-300 mb-3">اللون الأساسي (مطابق للموقع)</p>
              <div className="flex items-center gap-2">
                {[
                  { c: "#c8962e", name: "ذهبي الموقع" },
                  { c: "#3b82f6", name: "أزرق" },
                  { c: "#10b981", name: "أخضر" },
                  { c: "#ef4444", name: "أحمر" },
                  { c: "#a855f7", name: "بنفسجي" },
                ].map((color) => (
                  <button
                    key={color.c}
                    style={{ background: color.c }}
                    className="w-10 h-10 rounded-xl ring-2 ring-offset-2 ring-offset-ink-800 hover:scale-110 transition-transform"
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-300 mb-3">الثيم</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-4 rounded-xl bg-ink-900 border-2 border-gold-600 text-right">
                  <p className="text-sm font-bold text-gold-300">داكن</p>
                  <p className="text-[11px] text-slate-500">الثيم الحالي</p>
                </button>
                <button className="p-4 rounded-xl bg-white border-2 border-white/10 text-right opacity-50 cursor-not-allowed">
                  <p className="text-sm font-bold text-ink-900">فاتح</p>
                  <p className="text-[11px] text-slate-400">قريباً</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {active === "site" && (
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-white">إعدادات الموقع الرئيسي</h2>
              <a href={siteUrl || "https://goldmil.matrxe.com"} target="_blank" rel="noopener noreferrer" className="text-xs text-gold-300 hover:text-gold-100">
                زيارة الموقع ←
              </a>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">اسم الموقع</label>
              <input className="input" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">رقم الجوال</label>
                <input className="input" value={sitePhone} onChange={(e) => setSitePhone(e.target.value)} dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">بريد التواصل</label>
                <input className="input" type="email" value={siteEmail} onChange={(e) => setSiteEmail(e.target.value)} dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">واتساب (بدون +)</label>
                <input className="input" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} dir="ltr" placeholder="966532561599" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">رابط الموقع</label>
                <input className="input" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} dir="ltr" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">العنوان</label>
              <input className="input" value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">ساعات العمل</label>
              <input className="input" value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} />
            </div>

            <button onClick={saveSiteSettings} disabled={saving} className="btn-gold">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>حفظ الإعدادات</span>
            </button>
          </div>
        )}

        {active === "integrations" && (
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-bold text-white mb-2">التكاملات</h2>
            {[
              { name: "Google Analytics", desc: "تحليلات الزوار", connected: false },
              { name: "WhatsApp Business API", desc: "استقبال رسائل الواتساب تلقائياً", connected: !!whatsappNumber },
              { name: "Mailchimp", desc: "حملات البريد الإلكتروني", connected: false },
              { name: "Moyasar / Stripe", desc: "بوابة الدفع الإلكتروني", connected: false },
              { name: "Twilio SMS", desc: "إرسال SMS للعملاء", connected: false },
            ].map((i) => (
              <div key={i.name} className="flex items-center justify-between p-4 rounded-xl border border-white/5">
                <div>
                  <p className="text-sm font-bold text-white">{i.name}</p>
                  <p className="text-xs text-slate-500">{i.desc}</p>
                </div>
                {i.connected ? (
                  <span className="badge badge-success"><Check className="w-3 h-3" /> مفعّل</span>
                ) : (
                  <button className="btn-outline-gold text-xs py-1.5 px-3">ربط</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}