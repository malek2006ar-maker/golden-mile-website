// POST /api/inquiries — استقبال من نموذج الاتصال (عام)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET — يحتاج auth (للوحة)
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const inquiries = await db.inquiry.findMany({
    where: status ? { status } : undefined,
    include: { assignedTo: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: inquiries, total: inquiries.length });
}

// POST — عام (نموذج الاتصال)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message, source, priority } = body;
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ success: false, message: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "البريد غير صحيح" }, { status: 400 });
    }
    const inquiry = await db.inquiry.create({
      data: {
        name: String(name).trim(),
        email: String(email).toLowerCase().trim(),
        phone: String(phone).trim(),
        subject: String(subject || "استفسار من الموقع").trim(),
        message: String(message).trim(),
        priority: priority || "medium",
        source: source || "contact_form",
        status: "new",
      },
    });
    await db.activity.create({
      data: { type: "inquiry_received", title: `استفسار جديد من ${name}`, description: String(subject || "").slice(0, 100) },
    });
    return NextResponse.json({ success: true, message: "تم استلام استفسارك بنجاح", data: { id: inquiry.id } }, { status: 201 });
  } catch (e) {
    console.error("Inquiry POST error:", e);
    return NextResponse.json({ success: false, message: "حدث خطأ" }, { status: 500 });
  }
}

// PATCH — يحتاج auth
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const { id, ...updates } = await req.json();
  const inquiry = await db.inquiry.update({ where: { id }, data: updates });
  return NextResponse.json({ data: inquiry, success: true });
}