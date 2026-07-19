// /api/admin/products
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const products = await db.product.findMany({
    where: { ...(status && { status }), ...(category && { category }) },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: products, total: products.length });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await req.json();
  const product = await db.product.create({ data: body });
  await db.activity.create({ data: { type: "product_added", title: `منتج جديد: ${product.name}`, userId: user.id } });
  return NextResponse.json({ data: product, success: true }, { status: 201 });
}