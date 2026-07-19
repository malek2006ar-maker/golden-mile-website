// /api/admin/settings — admin update
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const settings = await db.setting.findMany();
  const result: Record<string, string> = {};
  settings.forEach((s) => (result[s.key] = s.value));
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body = await req.json();
  const updates = Object.entries(body) as [string, string][];
  await Promise.all(updates.map(([key, value]) =>
    db.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } })
  ));
  return NextResponse.json({ success: true });
}