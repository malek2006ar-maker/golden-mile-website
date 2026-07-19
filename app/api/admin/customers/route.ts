// /api/admin/customers
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
  const search = searchParams.get("search");
  const customers = await db.customer.findMany({
    where: {
      ...(status && { status }),
      ...(search && { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] }),
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: customers, total: customers.length });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await req.json();
  const customer = await db.customer.create({ data: body });
  await db.activity.create({ data: { type: "customer_added", title: `عميل جديد: ${customer.name}`, userId: user.id } });
  return NextResponse.json({ data: customer, success: true }, { status: 201 });
}