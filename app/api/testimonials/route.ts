// GET /api/testimonials — عام
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const testimonials = await db.testimonial.findMany({
      where: { status: "approved", ...(featured === "true" && { featured: true }) },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  } catch (e) {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}