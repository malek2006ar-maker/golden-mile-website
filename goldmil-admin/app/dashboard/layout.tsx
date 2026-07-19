import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Toaster } from "@/components/ui/toaster";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // الحماية: middleware أصلاً بيوصل لهنا فقط لو عنده token،
  // لكن نتحقق مرة ثانية على مستوى الـ Server Component
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <DashboardShell user={user}>{children}</DashboardShell>
      <Toaster />
    </>
  );
}