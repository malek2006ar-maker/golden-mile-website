import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** دمج class names مع tailwind merge */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** تنسيق أرقام بالعربية مع فواصل */
export function formatNumber(n: number, locale = "ar-SA"): string {
  return new Intl.NumberFormat(locale).format(n);
}

/** تنسيق عملة ر.س */
export function formatCurrency(n: number, locale = "ar-SA"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(n);
}

/** تنسيق تاريخ بالعربية */
export function formatDate(date: string | Date, locale = "ar-SA"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

/** تنسيق تاريخ ووقت */
export function formatDateTime(date: string | Date, locale = "ar-SA"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** فرق زمني نسبي (منذ X ساعة) */
export function timeAgo(date: string | Date, locale = "ar"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
    [2592000, "week"],
    [31536000, "month"],
  ];
  for (let i = intervals.length - 1; i >= 0; i--) {
    const [divisor, unit] = intervals[i];
    if (seconds >= divisor) {
      const value = -Math.floor(seconds / divisor);
      return rtf.format(value, unit);
    }
  }
  return rtf.format(-seconds, "second");
}

/** اختصار اسم لعرضه في بطاقة */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** لون الـ Avatar من الاسم */
export function getAvatarColor(name: string): string {
  const colors = [
    "from-gold-600 to-gold-300",
    "from-blue-600 to-blue-300",
    "from-purple-600 to-purple-300",
    "from-pink-600 to-pink-300",
    "from-emerald-600 to-emerald-300",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

/** شارة الحالة بالعربية */
export function getStatusBadge(status: string): {
  label: string;
  class: string;
} {
  const map: Record<string, { label: string; class: string }> = {
    new: { label: "جديد", class: "badge-info" },
    pending: { label: "قيد الانتظار", class: "badge-warning" },
    in_progress: { label: "قيد التنفيذ", class: "badge-info" },
    in_design: { label: "قيد التصميم", class: "badge-info" },
    review: { label: "قيد المراجعة", class: "badge-warning" },
    planning: { label: "تخطيط", class: "badge-neutral" },
    completed: { label: "مكتمل", class: "badge-success" },
    on_hold: { label: "متوقف", class: "badge-warning" },
    delivered: { label: "مُسلَّم", class: "badge-success" },
    approved: { label: "معتمد", class: "badge-success" },
    responded: { label: "تم الرد", class: "badge-success" },
    closed: { label: "مغلق", class: "badge-neutral" },
    active: { label: "نشط", class: "badge-success" },
    inactive: { label: "غير نشط", class: "badge-neutral" },
    draft: { label: "مسودة", class: "badge-neutral" },
    published: { label: "منشور", class: "badge-success" },
    archived: { label: "مؤرشف", class: "badge-neutral" },
    lead: { label: "عميل محتمل", class: "badge-info" },
    prospect: { label: "محتمل", class: "badge-warning" },
    past: { label: "سابق", class: "badge-neutral" },
    rejected: { label: "مرفوض", class: "badge-danger" },
    featured: { label: "مميز", class: "badge-gold" },
    out_of_stock: { label: "نفد المخزون", class: "badge-danger" },
  };
  return map[status] || { label: status, class: "badge-neutral" };
}

/** أولوية بالعربية */
export function getPriorityBadge(priority: string): {
  label: string;
  class: string;
} {
  const map: Record<string, { label: string; class: string }> = {
    low: { label: "منخفضة", class: "badge-neutral" },
    medium: { label: "متوسطة", class: "badge-info" },
    high: { label: "عالية", class: "badge-danger" },
  };
  return map[priority] || { label: priority, class: "badge-neutral" };
}

/** رقم عشوائي ضمن مدى */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** اختيار عشوائي من مصفوفة */
export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}