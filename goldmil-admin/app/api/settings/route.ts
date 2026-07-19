import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    await requireUser();
    const settings = await db.setting.findMany();
    const result: Record<string, string> = {};
    settings.forEach((s) => (result[s.key] = s.value));
    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireUser();
    const body = await request.json();

    // body = { key: value, key2: value2 }
    const updates = Object.entries(body).map(([key, value]) =>
      db.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await Promise.all(updates);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}