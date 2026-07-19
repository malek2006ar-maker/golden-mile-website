import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/tables/data-table";
import { db } from "@/lib/db";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, ShieldCheck, MoreHorizontal } from "lucide-react";
import { timeAgo } from "@/lib/utils";

const roleLabel: Record<string, { label: string; class: string }> = {
  admin: { label: "مدير عام", class: "badge-gold" },
  manager: { label: "مدير", class: "badge-info" },
  editor: { label: "محرر", class: "badge-success" },
  viewer: { label: "مشاهد", class: "badge-neutral" },
};

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, phone: true, role: true, isActive: true, lastLogin: true, avatar: true, createdAt: true },
  });

  const columns: Column<any>[] = [
    {
      key: "name", label: "المستخدم", sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          {u.avatar ? <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" /> : <Avatar name={u.name} size="md" />}
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{u.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "الجوال", render: (u) => <span className="text-xs text-slate-300" dir="ltr">{u.phone || "—"}</span> },
    { key: "role", label: "الدور", sortable: true, render: (u) => { const r = roleLabel[u.role] || roleLabel.viewer; return <span className={`badge ${r.class}`}>{r.label}</span>; } },
    { key: "isActive", label: "الحالة", sortable: true, render: (u) => <span className={`badge ${u.isActive ? "badge-success" : "badge-neutral"}`}>{u.isActive ? "نشط" : "موقوف"}</span> },
    { key: "lastLogin", label: "آخر تسجيل دخول", sortable: true, render: (u) => <span className="text-xs text-slate-400">{u.lastLogin ? timeAgo(u.lastLogin) : "—"}</span> },
    {
      key: "actions", label: "إجراءات", className: "text-left",
      render: () => (
        <div className="flex items-center gap-1 justify-end">
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10 transition-colors"><ShieldCheck className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10 transition-colors"><Edit className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="المستخدمون"
        description="إدارة مستخدمي لوحة التحكم والصلاحيات"
        breadcrumbs={[{ label: "لوحة التحكم", href: "/dashboard" }, { label: "المستخدمون" }]}
        actions={<Button size="sm"><Plus className="w-4 h-4" /><span>دعوة مستخدم</span></Button>}
      />
      <DataTable data={users} columns={columns} searchKeys={["name", "email", "phone"]} />
    </div>
  );
}