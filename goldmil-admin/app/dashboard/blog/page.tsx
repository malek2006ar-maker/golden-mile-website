import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/tables/data-table";
import { db } from "@/lib/db";
import { Plus, Eye, Edit, Trash2, BookOpen, Eye as ViewIcon, Heart } from "lucide-react";
import { getStatusBadge, formatDate, formatNumber } from "@/lib/utils";

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  const columns: Column<any>[] = [
    {
      key: "title", label: "العنوان", sortable: true,
      render: (b) => (
        <div className="flex items-center gap-3 max-w-md">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-300/5 border border-blue-600/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-blue-300" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{b.title}</p>
            <p className="text-[11px] text-slate-500 line-clamp-1">{b.excerpt}</p>
          </div>
        </div>
      ),
    },
    { key: "category", label: "الفئة", sortable: true, render: (b) => <span className="badge badge-neutral">{b.category}</span> },
    { key: "author", label: "الكاتب", sortable: true, render: (b) => <span className="text-sm text-slate-300">{b.author}</span> },
    { key: "status", label: "الحالة", sortable: true, render: (b) => { const s = getStatusBadge(b.status); return <span className={`badge ${s.class}`}>{s.label}</span>; } },
    { key: "views", label: "المشاهدات", sortable: true, render: (b) => <span className="inline-flex items-center gap-1 text-xs text-slate-300"><ViewIcon className="w-3 h-3" />{formatNumber(b.views)}</span> },
    { key: "likes", label: "الإعجابات", sortable: true, render: (b) => <span className="inline-flex items-center gap-1 text-xs text-pink-300"><Heart className="w-3 h-3" />{formatNumber(b.likes)}</span> },
    { key: "publishedAt", label: "تاريخ النشر", sortable: true, render: (b) => <span className="text-xs text-slate-300">{b.publishedAt ? formatDate(b.publishedAt) : "—"}</span> },
    {
      key: "actions", label: "إجراءات", className: "text-left",
      render: () => (
        <div className="flex items-center gap-1 justify-end">
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
        title="المدونة"
        description="إدارة مقالات مدونة الميل الذهبي"
        breadcrumbs={[{ label: "لوحة التحكم", href: "/dashboard" }, { label: "المدونة" }]}
        actions={<Button size="sm"><Plus className="w-4 h-4" /><span>مقال جديد</span></Button>}
      />
      <DataTable data={posts} columns={columns} searchKeys={["title", "author", "category", "excerpt"]} />
    </div>
  );
}