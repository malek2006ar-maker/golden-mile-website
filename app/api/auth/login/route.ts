// POST /api/auth/login
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signToken, verifyPassword, setAuthCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "البريد وكلمة المرور مطلوبان" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, name: true, password: true, role: true, isActive: true, avatar: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ success: false, message: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ success: false, message: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email, role: user.role, name: user.name });
    await setAuthCookie(token);

    await db.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
    await db.activity.create({ data: { type: "login", title: `تسجيل دخول: ${user.name}`, userId: user.id } });

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
    });
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ success: false, message: "حدث خطأ" }, { status: 500 });
  }
}