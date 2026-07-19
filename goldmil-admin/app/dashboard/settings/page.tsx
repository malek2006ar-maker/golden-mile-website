import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/avatar";
import { SettingsForm } from "@/components/forms/settings-form";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, name: true, phone: true, role: true, avatar: true },
  });

  const settings = await db.setting.findMany();
  const settingsMap: Record<string, string> = {};
  settings.forEach((s) => (settingsMap[s.key] = s.value));

  return (
    <div>
      <PageHeader
        title="الإعدادات"
        description="إدارة حسابك وإعدادات لوحة التحكم والموقع"
        breadcrumbs={[{ label: "لوحة التحكم", href: "/dashboard" }, { label: "الإعدادات" }]}
      />

      <SettingsForm user={dbUser!} settings={settingsMap} />
    </div>
  );
}