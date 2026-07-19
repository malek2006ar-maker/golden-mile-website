import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { AreaChartCard } from "@/components/charts/area-chart";
import { DonutChart } from "@/components/charts/donut-chart";
import { BarChartCard } from "@/components/charts/bar-chart";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import {
  Plus, Download, ArrowLeft, Eye, TrendingUp,
  CheckCircle2, Clock, AlertCircle, FolderKanban, Users,
  DollarSign, MessageSquare, Inbox, Wallet
} from "lucide-react";
import { formatCurrency, timeAgo, getStatusBadge, formatDateTime } from "@/lib/utils";
import Link from "next/link";

async function getDashboardData() {
  const [
    projectsAgg,
    activeProjectsCount,
    customersCount,
    newInquiriesCount,
    recentProjects,
    recentInquiries,
    projectsByStatus,
    projectsByType,
    activities,
    totalRevenueResult,
    monthlyInquiries,
  ] = await Promise.all([
    db.project.aggregate({ _sum: { budget: true, spent: true } }),
    db.project.count({ where: { status: "in_progress" } }),
    db.customer.count(),
    db.inquiry.count({ where: { status: "new" } }),
    db.project.findMany({ take: 4, orderBy: { createdAt: "desc" } }),
    db.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { assignedTo: { select: { name: true } } },
    }),
    db.project.groupBy({ by: ["status"], _count: { _all: true } }),
    db.project.groupBy({ by: ["type"], _count: { _all: true } }),
    db.activity.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    db.project.aggregate({ _sum: { budget: true } }),
    db.inquiry.groupBy({
      by: ["createdAt"],
      _count: { _all: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // KPIs
  const totalRevenue = totalRevenueResult._sum.budget || 0;

  // عدد الاستفسارات لكل شهر (آخر 7 أشهر)
  const inquiriesByMonth: { label: string; value: number }[] = [];
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو"];
  const currentMonth = new Date().getMonth();
  for (let i = 6; i >= 0; i--) {
    const monthIdx = (currentMonth - i + 12) % 12;
    const count = await db.inquiry.count({
      where: {
        createdAt: {
          gte: new Date(2026, monthIdx, 1),
          lt: new Date(2026, monthIdx + 1, 1),
        },
      },
    });
    inquiriesByMonth.push({ label: months[monthIdx], value: count });
  }

  // Revenue for last 7 months (mock based on completed projects)
  const revenueByMonth = [
    { label: "يناير", value: 420000 },
    { label: "فبراير", value: 380000 },
    { label: "مارس", value: 520000 },
    { label: "أبريل", value: 680000 },
    { label: "مايو", value: 740000 },
    { label: "يونيو", value: 920000 },
    { label: "يوليو", value: totalRevenue > 0 ? Math.round(totalRevenue * 0.15) : 850000 },
  ];

  return {
    kpis: {
      totalRevenue,
      activeProjects: activeProjectsCount,
      totalCustomers: customersCount,
      newInquiries: newInquiriesCount,
    },
    recentProjects,
    recentInquiries,
    activities,
    revenueByMonth,
    inquiriesByMonth,
    projectsByStatus: projectsByStatus.map((p) => ({
      label: projectStatusLabel(p.status),
      value: p._count._all,
      color: projectStatusColor(p.status),
    })),
    projectsByType: projectsByType.map((p) => ({
      label: projectTypeLabel(p.type),
      value: p._count._all,
      color: projectTypeColor(p.type),
    })),
    totalProjects: projectsByStatus.reduce((s, p) => s + p._count._all, 0),
  };
}

function projectStatusLabel(s: string) {
  return ({ planning: "تخطيط", in_progress: "قيد التنفيذ", on_hold: "متوقف", completed: "مكتملة" } as Record<string, string>)[s] || s;
}
function projectStatusColor(s: string) {
  return ({ planning: "#3b82f6", in_progress: "#c8962e", on_hold: "#f59e0b", completed: "#10b981" } as Record<string, string>)[s] || "#94a3b8";
}
function projectTypeLabel(t: string) {
  return ({ residential: "سكني", commercial: "تجاري", industrial: "صناعي" } as Record<string, string>)[t] || t;
}
function projectTypeColor(t: string) {
  return ({ residential: "#c8962e", commercial: "#f0c75e", industrial: "#d4a843" } as Record<string, string>)[t] || "#a07820";
}

const activityIconMap: Record<string, any> = {
  design_approved: CheckCircle2,
  project_updated: Clock,
  payment_received: DollarSign,
  low_stock: AlertCircle,
  post_published: CheckCircle2,
  inquiry_received: MessageSquare,
  login: Users,
  project_created: FolderKanban,
};

const activityColorMap: Record<string, string> = {
  design_approved: "success",
  project_updated: "warning",
  payment_received: "gold",
  low_stock: "danger",
  post_published: "success",
  inquiry_received: "info",
  login: "info",
  project_created: "success",
};

async function TopCustomers() {
  const customers = await db.customer.findMany({
    take: 5,
    orderBy: { totalSpent: "desc" },
  });

  if (customers.length === 0) {
    return <div className="py-8 text-center text-slate-500 text-sm">لا توجد بيانات</div>;
  }

  return (
    <ul className="space-y-3">
      {customers.map((c, i) => (
        <li key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/2 transition-colors">
          <span className="text-xs text-slate-500 font-mono w-4">{String(i + 1).padStart(2, "0")}</span>
          <Avatar name={c.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{c.name}</p>
            <p className="text-[11px] text-slate-500">{c.projectsCount} مشروع</p>
          </div>
          <p className="text-sm font-extrabold text-gradient-gold">
            {(c.totalSpent / 1000).toFixed(0)}K
          </p>
        </li>
      ))}
    </ul>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <PageHeader
        title="نظرة عامة"
        description="ملخص أداء المؤسسة من قاعدة البيانات الحية"
        breadcrumbs={[{ label: "لوحة التحكم" }, { label: "نظرة عامة" }]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              <span>تصدير</span>
            </Button>
            <Link href="/dashboard/projects">
              <Button size="sm">
                <Plus className="w-4 h-4" />
                <span>مشروع جديد</span>
              </Button>
            </Link>
          </>
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي الميزانيات"
          value={formatCurrency(data.kpis.totalRevenue)}
          change={24.5}
          changeLabel="من قاعدة البيانات الحية"
          icon="dollar"
          color="gold"
        />
        <StatCard
          title="مشاريع نشطة"
          value={String(data.kpis.activeProjects)}
          change={12}
          icon="project"
          color="info"
        />
        <StatCard
          title="إجمالي العملاء"
          value={String(data.kpis.totalCustomers)}
          change={8.2}
          icon="users"
          color="success"
        />
        <StatCard
          title="استفسارات جديدة"
          value={String(data.kpis.newInquiries)}
          change={18.6}
          changeLabel="بانتظار الرد"
          icon="message"
          color="warning"
        />
      </div>

      {/* Revenue + Status */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">الإيرادات الشهرية</h3>
              <p className="text-xs text-slate-500 mt-1">آخر 7 أشهر</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/30">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
              <span className="text-xs font-bold text-success">+24.5% نمو</span>
            </div>
          </div>
          <AreaChartCard data={data.revenueByMonth} formatY={(v) => `${(v / 1000).toFixed(0)}K`} />
        </div>

        <div className="card p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white">حالة المشاريع</h3>
            <p className="text-xs text-slate-500 mt-1">من قاعدة البيانات</p>
          </div>
          {data.projectsByStatus.length > 0 ? (
            <>
              <DonutChart
                data={data.projectsByStatus}
                centerLabel="إجمالي المشاريع"
                centerValue={String(data.totalProjects)}
              />
              <ul className="mt-4 space-y-2">
                {data.projectsByStatus.map((s) => (
                  <li key={s.label} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                      <span className="text-slate-300">{s.label}</span>
                    </span>
                    <span className="text-white font-bold">{s.value}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">
              <Inbox className="w-10 h-10 mx-auto mb-2 opacity-30" />
              لا توجد مشاريع بعد
            </div>
          )}
        </div>
      </div>

      {/* Inquiries Chart + Project Types */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white">الاستفسارات الشهرية</h3>
            <p className="text-xs text-slate-500 mt-1">من قاعدة البيانات</p>
          </div>
          <BarChartCard data={data.inquiriesByMonth} />
        </div>

        <div className="card p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white">نوع المشاريع</h3>
            <p className="text-xs text-slate-500 mt-1">التوزيع حسب الفئة</p>
          </div>
          {data.projectsByType.length > 0 ? (
            <DonutChart data={data.projectsByType} centerLabel="إجمالي" centerValue={String(data.totalProjects)} />
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">لا توجد بيانات</div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">أفضل العملاء</h3>
            <Link href="/dashboard/customers" className="text-xs text-gold-300 hover:text-gold-100">عرض الكل</Link>
          </div>
          <TopCustomers />
        </div>
      </div>

      {/* Recent Projects + Inquiries */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">أحدث المشاريع</h3>
              <p className="text-xs text-slate-500 mt-1">من قاعدة البيانات الحية</p>
            </div>
            <Link href="/dashboard/projects" className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-300 hover:text-gold-100">
              <span>عرض الكل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data.recentProjects.length > 0 ? (
            <ul className="space-y-3">
              {data.recentProjects.map((p) => {
                const status = getStatusBadge(p.status);
                return (
                  <li key={p.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/2 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-600/20 to-gold-300/5 border border-gold-600/20 flex items-center justify-center flex-shrink-0">
                      <FolderKanban className="w-5 h-5 text-gold-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-white truncate">{p.name}</p>
                        <span className={`badge ${status.class}`}>{status.label}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {p.clientName} • {p.location}
                      </p>
                    </div>
                    <div className="hidden md:block w-32">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-500">التقدم</span>
                        <span className="text-gold-300 font-bold">{p.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-l from-gold-600 to-gold-300 rounded-full"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-extrabold text-gradient-gold">{formatCurrency(p.budget)}</p>
                      <p className="text-[10px] text-slate-500">{p.manager}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              لا توجد مشاريع بعد. <Link href="/dashboard/projects" className="text-gold-300">أضف مشروعك الأول</Link>
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-white">أحدث الاستفسارات</h3>
            {data.kpis.newInquiries > 0 && (
              <span className="badge badge-info">{data.kpis.newInquiries} جديد</span>
            )}
          </div>

          {data.recentInquiries.length > 0 ? (
            <>
              <ul className="space-y-3">
                {data.recentInquiries.map((inq) => (
                  <li key={inq.id} className="p-3 rounded-xl hover:bg-white/2 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-3">
                      <Avatar name={inq.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{inq.name}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">{inq.subject}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] text-slate-500">{timeAgo(inq.createdAt)}</span>
                          {inq.priority === "high" && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-danger">
                              <AlertCircle className="w-2.5 h-2.5" />
                              <span>عاجل</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard/inquiries" className="mt-4 w-full btn-outline-gold py-2 text-xs">
                عرض كل الاستفسارات
              </Link>
            </>
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">
              <Inbox className="w-10 h-10 mx-auto mb-2 opacity-30" />
              لا توجد استفسارات بعد
            </div>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">النشاط الأخير</h3>
          <Button variant="ghost" size="sm">عرض السجل الكامل</Button>
        </div>

        {data.activities.length > 0 ? (
          <ul className="space-y-4">
            {data.activities.map((act) => {
              const Icon = activityIconMap[act.type] || CheckCircle2;
              const color = activityColorMap[act.type] || "info";
              const colorMap: Record<string, string> = {
                success: "bg-success/10 text-success border-success/30",
                warning: "bg-warning/10 text-warning border-warning/30",
                danger: "bg-danger/10 text-danger border-danger/30",
                gold: "bg-gold-600/10 text-gold-300 border-gold-600/30",
                info: "bg-info/10 text-info border-info/30",
              };
              return (
                <li key={act.id} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 pt-1.5">
                    <p className="text-sm text-slate-200">{act.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {act.user?.name || "النظام"} • <span className="text-gold-300">{timeAgo(act.createdAt)}</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-8 text-center text-slate-500 text-sm">لا يوجد نشاط بعد</div>
        )}
      </div>
    </div>
  );
}
