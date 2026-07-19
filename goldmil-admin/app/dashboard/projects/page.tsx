import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/tables/data-table";
import { db } from "@/lib/db";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Download, Eye, Edit, Trash2, FolderKanban, MapPin } from "lucide-react";
import { formatCurrency, getStatusBadge, formatDate } from "@/lib/utils";

const typeLabel: Record<string, string> = {
  residential: "سكني",
  commercial: "تجاري",
  industrial: "صناعي",
};

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  const columns: Column<any>[] = [
    {
      key: "name",
      label: "اسم المشروع",
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-600/20 to-gold-300/5 border border-gold-600/20 flex items-center justify-center flex-shrink-0">
            <FolderKanban className="w-4 h-4 text-gold-300" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{p.name}</p>
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {p.location}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "clientName",
      label: "العميل",
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-2">
          <Avatar name={p.clientName} size="sm" />
          <span className="text-slate-200">{p.clientName}</span>
        </div>
      ),
    },
    {
      key: "type",
      label: "النوع",
      sortable: true,
      render: (p) => <span className="badge badge-neutral">{typeLabel[p.type]}</span>,
    },
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (p) => {
        const s = getStatusBadge(p.status);
        return <span className={`badge ${s.class}`}>{s.label}</span>;
      },
    },
    {
      key: "progress",
      label: "التقدم",
      sortable: true,
      render: (p) => (
        <div className="w-28">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-slate-500">نسبة الإنجاز</span>
            <span className="text-gold-300 font-bold">{p.progress}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-l from-gold-600 to-gold-300 rounded-full" style={{ width: `${p.progress}%` }} />
          </div>
        </div>
      ),
    },
    {
      key: "budget",
      label: "الميزانية",
      sortable: true,
      render: (p) => (
        <div>
          <p className="font-extrabold text-gradient-gold">{formatCurrency(p.budget)}</p>
          <p className="text-[10px] text-slate-500">منفق: {formatCurrency(p.spent)}</p>
        </div>
      ),
    },
    {
      key: "endDate",
      label: "التسليم",
      sortable: true,
      render: (p) => <span className="text-xs text-slate-300">{formatDate(p.endDate)}</span>,
    },
    {
      key: "actions",
      label: "إجراءات",
      className: "text-left",
      render: () => (
        <div className="flex items-center gap-1 justify-end">
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-info hover:bg-info/5 transition-colors"><Eye className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-gold-600/10 transition-colors"><Edit className="w-4 h-4" /></button>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="المشاريع"
        description={`إدارة جميع مشاريع المؤسسة (${projects.length} مشروع)`}
        breadcrumbs={[{ label: "لوحة التحكم", href: "/dashboard" }, { label: "المشاريع" }]}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="w-4 h-4" /><span>تصدير</span></Button>
            <Button size="sm"><Plus className="w-4 h-4" /><span>مشروع جديد</span></Button>
          </>
        }
      />
      <DataTable data={projects} columns={columns} searchKeys={["name", "clientName", "location", "manager"]} />
    </div>
  );
}