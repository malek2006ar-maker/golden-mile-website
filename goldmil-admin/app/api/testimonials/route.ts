import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireUser();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const testimonials = await db.testimonial.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: testimonials, total: testimonials.length });
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireUser();
    const { id, status } = await request.json();
    const testimonial = await db.testimonial.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ data: testimonial, success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}