// /api/admin/projects — CRUD للمشاريع
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, hasRole } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const projects = await db.project.findMany({
    where: {
      ...(status && { status }),
      ...(search && { OR: [{ name: { contains: search, mode: "insensitive" } }, { clientName: { contains: search, mode: "insensitive" } }] }),
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: projects, total: projects.length });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await req.json();
  const project = await db.project.create({ data: { ...body, startDate: new Date(body.startDate), endDate: new Date(body.endDate) } });
  await db.activity.create({ data: { type: "project_created", title: `مشروع جديد: ${project.name}`, userId: user.id } });
  return NextResponse.json({ data: project, success: true }, { status: 201 });
}