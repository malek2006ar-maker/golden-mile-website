import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/tables/data-table";
import { db } from "@/lib/db";
import { Plus, Eye, Edit, ImageIcon, Palette, Calendar, Wallet } from "lucide-react";
import { getStatusBadge, formatCurrency, formatDate } from "@/lib/utils";

const roomLabel: Record<string, string> = {
  living: "صالة المعيشة", bedroom: "غرفة نوم", kitchen: "مطبخ",
  bathroom: "حمام", office: "مكتب", outdoor: "خارجي",
};
const styleLabel: Record<string, string> = {
  modern: "عصري", classic: "كلاسيكي", minimal: "بسيط", luxury: "فاخر",
};

export default async function DesignStudioPage() {
  const requests = await db.designRequest.findMany({ orderBy: { createdAt: "desc" } });

  const columns: Column<any>[] = [
    {
      key: "projectName", label: "اسم المشروع", sortable: true,
      render: (d) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/5 border border-purple-600/20 flex items-center justify-center flex-shrink-0">
            <Palette className="w-4 h-4 text-purple-300" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{d.projectName}</p>
            <p className="text-[11px] text-slate-500">{d.customerName}</p>
          </div>
        </div>
      ),
    },
    { key: "roomType", label: "نوع الغرفة", sortable: true, render: (d) => <span className="badge badge-neutral">{roomLabel[d.roomType]}</span> },
    { key: "style", label: "الستايل", sortable: true, render: (d) => <span className="badge badge-gold">{styleLabel[d.style]}</span> },
    { key: "status", label: "الحالة", sortable: true, render: (d) => { const s = getStatusBadge(d.status); return <span className={`badge ${s.class}`}>{s.label}</span>; } },
    { key: "budget", label: "الميزانية", sortable: true, render: (d) => <span className="font-extrabold text-gradient-gold inline-flex items-center gap-1"><Wallet className="w-3 h-3" />{formatCurrency(d.budget)}</span> },
    { key: "deadline", label: "الموعد النهائي", sortable: true, render: (d) => <span className="text-xs text-slate-300 inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(d.deadline)}</span> },
    {
      key: "actions", label: "إجراءات", className: "text-left",
      render: () => (
        <div className="flex items-center gap-1 justify-end">
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-purple-600/10 transition-colors"><ImageIcon className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10 transition-colors"><Edit className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"><Eye className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="استوديو التصميم"
        description="إدارة طلبات التصاميم ثلاثية الأبعاد"
        breadcrumbs={[{ label: "لوحة التحكم", href: "/dashboard" }, { label: "استوديو التصميم" }]}
        actions={<Button size="sm"><Plus className="w-4 h-4" /><span>طلب جديد</span></Button>}
      />
      <DataTable data={requests} columns={columns} searchKeys={["projectName", "customerName"]} />
    </div>
  );
}