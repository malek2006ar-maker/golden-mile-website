import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    await requireUser();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const customers = await db.customer.findMany({
      where: {
        ...(status && { status }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
          ],
        }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: customers, total: customers.length });
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireUser();
    const body = await request.json();
    const customer = await db.customer.create({ data: body });
    return NextResponse.json({ data: customer, success: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}