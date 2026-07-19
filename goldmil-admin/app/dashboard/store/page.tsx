import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/tables/data-table";
import { db } from "@/lib/db";
import { Plus, Download, Eye, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import { formatCurrency, getStatusBadge } from "@/lib/utils";

export default async function StorePage() {
  const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });

  const columns: Column<any>[] = [
    {
      key: "name", label: "المنتج", sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600/20 to-emerald-300/5 border border-emerald-600/20 flex items-center justify-center flex-shrink-0">
            <Package className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate">{p.name}</p>
            <p className="text-[11px] text-slate-500 font-mono">{p.sku}</p>
          </div>
        </div>
      ),
    },
    { key: "category", label: "الفئة", sortable: true, render: (p) => <span className="badge badge-neutral">{p.category}</span> },
    { key: "price", label: "السعر", sortable: true, render: (p) => <span className="font-extrabold text-gradient-gold">{formatCurrency(p.price)}</span> },
    {
      key: "stock", label: "المخزون", sortable: true,
      render: (p) => {
        const low = p.stock < 5;
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
            low ? "bg-warning/10 text-warning border border-warning/30" : "bg-success/10 text-success border border-success/30"
          }`}>
            {low && <AlertTriangle className="w-3 h-3" />}
            {p.stock} قطعة
          </span>
        );
      },
    },
    { key: "sold", label: "مبيعات", sortable: true, render: (p) => <span className="text-sm text-slate-300">{p.sold}</span> },
    { key: "status", label: "الحالة", sortable: true, render: (p) => { const s = getStatusBadge(p.status); return <span className={`badge ${s.class}`}>{s.label}</span>; } },
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

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStock = products.filter((p) => p.stock < 5).length;
  const totalRevenue = products.reduce((s, p) => s + p.sold * p.price, 0);

  return (
    <div>
      <PageHeader
        title="المتجر"
        description="إدارة منتجات متجر الميل الذهبي"
        breadcrumbs={[{ label: "لوحة التحكم", href: "/dashboard" }, { label: "المتجر" }]}
        actions={<><Button variant="outline" size="sm"><Download className="w-4 h-4" /><span>تصدير</span></Button><Button size="sm"><Plus className="w-4 h-4" /><span>منتج جديد</span></Button></>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="card p-4"><p className="text-[11px] text-slate-500 mb-1">إجمالي المنتجات</p><p className="text-2xl font-extrabold text-white">{products.length}</p></div>
        <div className="card p-4"><p className="text-[11px] text-slate-500 mb-1">إجمالي المخزون</p><p className="text-2xl font-extrabold text-success">{totalStock}</p></div>
        <div className="card p-4"><p className="text-[11px] text-slate-500 mb-1">مخزون منخفض</p><p className="text-2xl font-extrabold text-warning">{lowStock}</p></div>
        <div className="card p-4"><p className="text-[11px] text-slate-500 mb-1">إيرادات المبيعات</p><p className="text-2xl font-extrabold text-gradient-gold">{(totalRevenue / 1000).toFixed(0)}K</p></div>
      </div>

      <DataTable data={products} columns={columns} searchKeys={["name", "sku", "category"]} />
    </div>
  );
}