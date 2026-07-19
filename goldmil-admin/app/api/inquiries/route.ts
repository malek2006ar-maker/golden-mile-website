import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { corsHeaders, handleCors } from "@/lib/cors";

export async function OPTIONS(request: Request) {
  const res = handleCors(request);
  return res ?? new NextResponse(null, { status: 200, headers: corsHeaders(request.headers.get("origin")) });
}

export async function GET(request: Request) {
  try {
    await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const inquiries = await db.inquiry.findMany({
      where: {
        ...(status && { status }),
        ...(priority && { priority }),
      },
      include: { assignedTo: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { data: inquiries, total: inquiries.length },
      { headers: corsHeaders(request.headers.get("origin")) }
    );
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
}

/**
 * POST /api/inquiries — يستقبل طلبات التواصل من الموقع الرئيسي
 * مفتوح للنماذج الخارجية (goldmil.matrxe.com)
 */
export async function POST(request: Request) {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.phone || !body.message) {
      return NextResponse.json(
        { success: false, message: "جميع الحقول مطلوبة" },
        { status: 400, headers: corsHeaders(request.headers.get("origin")) }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: "البريد الإلكتروني غير صحيح" },
        { status: 400, headers: corsHeaders(request.headers.get("origin")) }
      );
    }

    const inquiry = await db.inquiry.create({
      data: {
        name: String(body.name).trim(),
        email: String(body.email).toLowerCase().trim(),
        phone: String(body.phone).trim(),
        subject: String(body.subject || "استفسار من الموقع").trim(),
        message: String(body.message).trim(),
        priority: body.priority || "medium",
        source: body.source || "contact_form",
        status: "new",
      },
    });

    // تسجيل النشاط
    await db.activity.create({
      data: {
        type: "inquiry_received",
        title: `استفسار جديد من ${body.name}`,
        description: body.subject,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "تم استلام استفسارك بنجاح، سنتواصل معك قريباً",
        data: { id: inquiry.id },
      },
      { status: 201, headers: corsHeaders(request.headers.get("origin")) }
    );
  } catch (e: any) {
    console.error("Inquiry POST error:", e);
    return NextResponse.json(
      { success: false, message: "حدث خطأ، حاول مرة أخرى" },
      { status: 500, headers: corsHeaders(request.headers.get("origin")) }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const { id, ...updates } = await request.json();
    const inquiry = await db.inquiry.update({ where: { id }, data: updates });

    return NextResponse.json(
      { data: inquiry, success: true },
      { headers: corsHeaders(request.headers.get("origin")) }
    );
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}