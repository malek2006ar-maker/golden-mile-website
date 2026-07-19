import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser, hasRole, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (!hasRole(user.role, "admin")) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const data: any = { ...body };
  if (body.password) data.password = await hashPassword(body.password);
  delete data.email;
  const u = await db.user.update({ where: { id }, data, select: { id: true, email: true, name: true, role: true, isActive: true } });
  return NextResponse.json({ data: u, success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (!hasRole(user.role, "admin")) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const { id } = await params;
  if (id === user.id) return NextResponse.json({ success: false, message: "لا تحذف حسابك" }, { status: 400 });
  await db.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}