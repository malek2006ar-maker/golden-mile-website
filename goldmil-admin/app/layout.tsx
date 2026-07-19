import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "لوحة التحكم - الميل الذهبي",
  description: "لوحة تحكم احترافية لمؤسسة الميل الذهبي للمقاولات والديكورات",
  robots: "noindex, nofollow", // لوحة التحكم لا يجب أن تظهر في محركات البحث
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <body className="bg-ink-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}