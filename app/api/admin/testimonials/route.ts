// /api/admin/testimonials
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const testimonials = await db.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: testimonials, total: testimonials.length });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await req.json();
  const t = await db.testimonial.create({ data: body });
  return NextResponse.json({ data: t, success: true }, { status: 201 });
}