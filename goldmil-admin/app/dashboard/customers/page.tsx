import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/tables/data-table";
import { db } from "@/lib/db";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Download, Eye, Edit, Trash2, Phone, Mail, MessageCircle } from "lucide-react";
import { formatCurrency, getStatusBadge, timeAgo } from "@/lib/utils";

const sourceLabel: Record<string, string> = {
  website: "الموقع", referral: "إحالة", social: "سوشال", ads: "إعلانات",
};

export default async function CustomersPage() {
  const customers = await db.customer.findMany({ orderBy: { createdAt: "desc" } });

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "العميل",
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          <Avatar name={c.name} size="md" />
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{c.name}</p>
            <p className="text-[11px] text-slate-500 truncate">{c.email}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "الجوال", render: (c) => <a href={`tel:${c.phone}`} className="text-xs text-slate-300 hover:text-gold-300 transition-colors" dir="ltr">{c.phone}</a> },
    { key: "city", label: "المدينة", sortable: true, render: (c) => <span className="text-sm text-slate-300">{c.city}</span> },
    { key: "status", label: "الحالة", sortable: true, render: (c) => { const s = getStatusBadge(c.status); return <span className={`badge ${s.class}`}>{s.label}</span>; } },
    { key: "projectsCount", label: "المشاريع", sortable: true, render: (c) => <span className="px-2.5 py-1 rounded-lg bg-gold-600/10 border border-gold-600/20 text-gold-300 text-xs font-bold">{c.projectsCount} مشروع</span> },
    { key: "totalSpent", label: "إجمالي الإنفاق", sortable: true, render: (c) => <span className="font-extrabold text-gradient-gold">{formatCurrency(c.totalSpent)}</span> },
    { key: "source", label: "المصدر", sortable: true, render: (c) => <span className="text-xs text-slate-400">{sourceLabel[c.source] || c.source}</span> },
    { key: "lastContact", label: "آخر تواصل", sortable: true, render: (c) => <span className="text-xs text-slate-400">{timeAgo(c.lastContact)}</span> },
    {
      key: "actions", label: "إجراءات", className: "text-left",
      render: () => (
        <div className="flex items-center gap-1 justify-end">
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-success hover:bg-success/5 transition-colors"><Phone className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-info hover:bg-info/5 transition-colors"><Mail className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10 transition-colors"><MessageCircle className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"><Eye className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10 transition-colors"><Edit className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="العملاء"
        description={`قاعدة بيانات عملاء المؤسسة (${customers.length} عميل)`}
        breadcrumbs={[{ label: "لوحة التحكم", href: "/dashboard" }, { label: "العملاء" }]}
        actions={<><Button variant="outline" size="sm"><Download className="w-4 h-4" /><span>تصدير</span></Button><Button size="sm"><Plus className="w-4 h-4" /><span>عميل جديد</span></Button></>}
      />
      <DataTable data={customers} columns={columns} searchKeys={["name", "email", "phone", "city"]} />
    </div>
  );
}