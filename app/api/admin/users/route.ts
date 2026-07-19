// /api/admin/users
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, hashPassword, hasRole } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const users = await db.user.findMany({
    select: { id: true, email: true, name: true, role: true, phone: true, avatar: true, isActive: true, lastLogin: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: users, total: users.length });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (!hasRole(user.role, "admin")) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const body = await req.json();
  if (!body.email || !body.name || !body.password) {
    return NextResponse.json({ success: false, message: "بيانات ناقصة" }, { status: 400 });
  }
  const exists = await db.user.findUnique({ where: { email: body.email.toLowerCase() } });
  if (exists) return NextResponse.json({ success: false, message: "البريد مستخدم" }, { status: 400 });
  const newUser = await db.user.create({
    data: { ...body, email: body.email.toLowerCase(), password: await hashPassword(body.password) },
    select: { id: true, email: true, name: true, role: true },
  });
  return NextResponse.json({ data: newUser, success: true }, { status: 201 });
}