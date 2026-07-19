import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireUser();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const projects = await db.project.findMany({
      where: {
        ...(status && { status }),
        ...(type && { type }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { clientName: { contains: search } },
            { location: { contains: search } },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: projects, total: projects.length });
  } catch (e) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json();

    const project = await db.project.create({
      data: {
        ...body,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      },
    });

    await db.activity.create({
      data: {
        type: "project_created",
        title: `تم إنشاء مشروع: ${project.name}`,
        userId: user.id,
      },
    });

    return NextResponse.json({ data: project, success: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "حدث خطأ" },
      { status: e.message === "UNAUTHORIZED" ? 401 : 400 }
    );
  }
}