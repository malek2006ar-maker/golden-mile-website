// GET /api/settings — عام
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const settings = await db.setting.findMany();
    const result: Record<string, string> = {};
    settings.forEach((s) => (result[s.key] = s.value));
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}