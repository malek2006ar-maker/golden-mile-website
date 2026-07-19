// GET /api/admin/analytics
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

  try {
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

    const [
      revenueAgg, activeProjects, customersCount, newInquiries,
      recentInquiries, recentProjects, activities, projectsByStatus, projectsByType,
    ] = await Promise.all([
      db.project.aggregate({ _sum: { budget: true } }),
      db.project.count({ where: { status: "in_progress" } }),
      db.customer.count(),
      db.inquiry.count({ where: { status: "new" } }),
      db.inquiry.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { assignedTo: { select: { name: true } } } }),
      db.project.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
      db.activity.findMany({ take: 10, orderBy: { createdAt: "desc" }, include: { user: { select: { name: true } } } }),
      db.project.groupBy({ by: ["status"], _count: { _all: true } }),
      db.project.groupBy({ by: ["type"], _count: { _all: true } }),
    ]);

    // استفسارات لكل شهر
    const inquiriesByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const count = await db.inquiry.count({ where: { createdAt: { gte: start, lt: end } } });
      inquiriesByMonth.push({ label: months[d.getMonth()], value: count });
    }

    return NextResponse.json({
      kpis: { totalRevenue: revenueAgg._sum.budget || 0, activeProjects, totalCustomers: customersCount, newInquiries },
      recentInquiries,
      recentProjects,
      activities,
      projectsByStatus: projectsByStatus.map((p) => ({ label: statusLabel(p.status), value: p._count._all, color: statusColor(p.status) })),
      projectsByType: projectsByType.map((p) => ({ label: typeLabel(p.type), value: p._count._all, color: "#c8962e" })),
      inquiriesByMonth,
    });
  } catch (e) {
    console.error("Analytics error:", e);
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}

function statusLabel(s: string) { return ({ planning: "تخطيط", in_progress: "قيد التنفيذ", on_hold: "متوقف", completed: "مكتمل" })[s] || s; }
function statusColor(s: string) { return ({ planning: "#3b82f6", in_progress: "#c8962e", on_hold: "#f59e0b", completed: "#10b981" })[s] || "#94a3b8"; }
function typeLabel(t: string) { return ({ residential: "سكني", commercial: "تجاري", industrial: "صناعي" })[t] || t; }