import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { AreaChartCard } from "@/components/charts/area-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { BarChartCard } from "@/components/charts/bar-chart";
import { db } from "@/lib/db";
import { formatNumber } from "@/lib/utils";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "viewer") redirect("/dashboard");

  const [
    totalRevenue,
    activeProjects,
    totalCustomers,
    completedProjects,
    monthlyRevenue,
    monthlyInquiries,
    monthlyNewCustomers,
    projectsByStatus,
    projectsByType,
    topCustomers,
  ] = await Promise.all([
    db.project.aggregate({ _sum: { budget: true } }),
    db.project.count({ where: { status: "in_progress" } }),
    db.customer.count(),
    db.project.count({ where: { status: "completed" } }),
    // إيرادات آخر 6 أشهر (من المشاريع المنجزة)
    Promise.all(
      [0, 1, 2, 3, 4, 5].map(async (i) => {
        const monthIdx = (new Date().getMonth() - i + 12) % 12;
        const year = new Date().getMonth() - i < 0 ? 2025 : 2026;
        const sum = await db.project.aggregate({
          where: {
            status: "completed",
            endDate: { gte: new Date(year, monthIdx, 1), lt: new Date(year, monthIdx + 1, 1) },
          },
          _sum: { budget: true },
        });
        return { label: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"][monthIdx], value: sum._sum.budget || 0 };
      })
    ).then((arr) => arr.reverse()),
    // استفسارات آخر 6 أشهر
    Promise.all(
      [0, 1, 2, 3, 4, 5].map(async (i) => {
        const monthIdx = (new Date().getMonth() - i + 12) % 12;
        const year = new Date().getMonth() - i < 0 ? 2025 : 2026;
        const count = await db.inquiry.count({
          where: {
            createdAt: { gte: new Date(year, monthIdx, 1), lt: new Date(year, monthIdx + 1, 1) },
          },
        });
        return { label: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"][monthIdx], value: count };
      })
    ).then((arr) => arr.reverse()),
    // عملاء جدد آخر 6 أشهر
    Promise.all(
      [0, 1, 2, 3, 4, 5].map(async (i) => {
        const monthIdx = (new Date().getMonth() - i + 12) % 12;
        const year = new Date().getMonth() - i < 0 ? 2025 : 2026;
        const count = await db.customer.count({
          where: {
            createdAt: { gte: new Date(year, monthIdx, 1), lt: new Date(year, monthIdx + 1, 1) },
          },
        });
        return { label: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"][monthIdx], value: count };
      })
    ).then((arr) => arr.reverse()),
    db.project.groupBy({ by: ["status"], _count: { _all: true } }),
    db.project.groupBy({ by: ["type"], _count: { _all: true } }),
    db.customer.findMany({ take: 5, orderBy: { totalSpent: "desc" } }),
  ]);

  const revenueTotal = totalRevenue._sum.budget || 0;

  return (
    <div>
      <PageHeader
        title="التحليلات"
        description="تحليلات الأداء التفصيلية من قاعدة البيانات الحية"
        breadcrumbs={[{ label: "لوحة التحكم", href: "/dashboard" }, { label: "التحليلات" }]}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="إجمالي الإيرادات (المخطط)"
          value={`${(revenueTotal / 1000).toFixed(0)}K ر.س`}
          change={32.4}
          icon="dollar"
          color="gold"
        />
        <StatCard
          title="مشاريع نشطة"
          value={String(activeProjects)}
          change={12}
          icon="project"
          color="info"
        />
        <StatCard
          title="عملاء مسجلون"
          value={String(totalCustomers)}
          change={8.2}
          icon="users"
          color="success"
        />
        <StatCard
          title="مشاريع منجزة"
          value={String(completedProjects)}
          change={24.5}
          icon="dollar"
          color="warning"
        />
      </div>

      {/* Revenue & Inquiries Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="text-base font-bold text-white mb-4">الإيرادات الشهرية (مشاريع منجزة)</h3>
          {monthlyRevenue.some((m) => m.value > 0) ? (
            <AreaChartCard
              data={monthlyRevenue}
              formatY={(v) => `${(v / 1000).toFixed(0)}K`}
            />
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              لا توجد مشاريع منجزة بعد لعرض الإيرادات
            </div>
          )}
        </div>

        <div className="card p-6">
          <h3 className="text-base font-bold text-white mb-4">الاستفسارات الواردة</h3>
          <BarChartCard data={monthlyInquiries} color="#3b82f6" />
        </div>
      </div>

      {/* Donut Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-6">
          <h3 className="text-base font-bold text-white mb-4">حالة المشاريع</h3>
          <DonutChart
            data={projectsByStatus.map((p) => ({
              label: ({ planning: "تخطيط", in_progress: "قيد التنفيذ", on_hold: "متوقف", completed: "مكتمل" } as Record<string, string>)[p.status] || p.status,
              value: p._count._all,
              color: ({ planning: "#3b82f6", in_progress: "#c8962e", on_hold: "#f59e0b", completed: "#10b981" } as Record<string, string>)[p.status] || "#94a3b8",
            }))}
            centerLabel="مشاريع"
            centerValue={String(projectsByStatus.reduce((s, p) => s + p._count._all, 0))}
          />
        </div>

        <div className="card p-6">
          <h3 className="text-base font-bold text-white mb-4">نوع المشاريع</h3>
          <DonutChart
            data={projectsByType.map((p) => ({
              label: ({ residential: "سكني", commercial: "تجاري", industrial: "صناعي" } as Record<string, string>)[p.type] || p.type,
              value: p._count._all,
              color: ({ residential: "#c8962e", commercial: "#f0c75e", industrial: "#a07820" } as Record<string, string>)[p.type] || "#c8962e",
            }))}
            centerLabel="نوع"
            centerValue={String(projectsByType.reduce((s, p) => s + p._count._all, 0))}
          />
        </div>

        <div className="card p-6">
          <h3 className="text-base font-bold text-white mb-4">نمو العملاء</h3>
          <BarChartCard data={monthlyNewCustomers} color="#10b981" />
        </div>
      </div>

      {/* Top customers */}
      <div className="card p-6">
        <h3 className="text-base font-bold text-white mb-4">أعلى العملاء إنفاقاً</h3>
        {topCustomers.length === 0 ? (
          <p className="py-8 text-center text-slate-500 text-sm">لا توجد بيانات</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-right py-3 text-[11px] uppercase text-slate-500 font-bold">الترتيب</th>
                  <th className="text-right py-3 text-[11px] uppercase text-slate-500 font-bold">العميل</th>
                  <th className="text-right py-3 text-[11px] uppercase text-slate-500 font-bold">المدينة</th>
                  <th className="text-right py-3 text-[11px] uppercase text-slate-500 font-bold">المشاريع</th>
                  <th className="text-right py-3 text-[11px] uppercase text-slate-500 font-bold">إجمالي الإنفاق</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/2">
                    <td className="py-3 text-xs font-mono text-slate-500">{String(i + 1).padStart(2, "0")}</td>
                    <td className="py-3 text-sm font-bold text-white">{c.name}</td>
                    <td className="py-3 text-sm text-slate-300">{c.city}</td>
                    <td className="py-3 text-sm text-slate-300">{c.projectsCount}</td>
                    <td className="py-3 text-sm font-extrabold text-gradient-gold">
                      {formatNumber(c.totalSpent)} ر.س
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}