import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    await requireUser();

    const [
      totalRevenue,
      activeProjects,
      totalCustomers,
      newInquiries,
      recentInquiries,
      recentProjects,
      activities,
      projectsByStatus,
      projectsByType,
      lowStockProducts,
      monthlyRevenue,
    ] = await Promise.all([
      // KPIs
      db.project.aggregate({ _sum: { budget: true } }),
      db.project.count({ where: { status: "in_progress" } }),
      db.customer.count(),
      db.inquiry.count({ where: { status: "new" } }),

      // Lists
      db.inquiry.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { assignedTo: { select: { name: true } } },
      }),
      db.project.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),

      // Activity
      db.activity.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      }),

      // Charts
      db.project.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      db.project.groupBy({
        by: ["type"],
        _count: { _all: true },
      }),
      db.product.findMany({
        where: { stock: { lt: 5 } },
        orderBy: { stock: "asc" },
        take: 5,
      }),

      // Monthly revenue (آخر 7 أشهر)
      db.$queryRaw<{ month: string; total: number }[]>`
        SELECT
          strftime('%Y-%m', startDate) as month,
          SUM(budget) as total
        FROM projects
        WHERE startDate >= datetime('now', '-7 months')
        GROUP BY month
        ORDER BY month ASC
      `,
    ]);

    return NextResponse.json({
      kpis: {
        totalRevenue: totalRevenue._sum.budget || 0,
        activeProjects,
        totalCustomers,
        newInquiries,
      },
      recentInquiries,
      recentProjects,
      activities,
      projectsByStatus: projectsByStatus.map((p) => ({
        label: projectStatusLabel(p.status),
        value: p._count._all,
        color: projectStatusColor(p.status),
      })),
      projectsByType: projectsByType.map((p) => ({
        label: projectTypeLabel(p.type),
        value: p._count._all,
        color: "#c8962e",
      })),
      lowStockProducts,
      monthlyRevenue,
    });
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
}

function projectStatusLabel(s: string) {
  return ({
    planning: "تخطيط",
    in_progress: "قيد التنفيذ",
    on_hold: "متوقف",
    completed: "مكتمل",
  } as Record<string, string>)[s] || s;
}

function projectStatusColor(s: string) {
  return ({
    planning: "#3b82f6",
    in_progress: "#c8962e",
    on_hold: "#f59e0b",
    completed: "#10b981",
  } as Record<string, string>)[s] || "#94a3b8";
}

function projectTypeLabel(t: string) {
  return ({
    residential: "سكني",
    commercial: "تجاري",
    industrial: "صناعي",
  } as Record<string, string>)[t] || t;
}