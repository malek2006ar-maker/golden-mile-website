// GET /api/products — عام
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const products = await db.product.findMany({
      where: { status: "active", ...(category && { category }) },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (e) {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}