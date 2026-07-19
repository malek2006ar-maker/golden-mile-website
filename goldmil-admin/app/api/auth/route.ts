import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "البريد وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    // البحث عن المستخدم
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        isActive: true,
        avatar: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    // التحقق من كلمة المرور
    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { success: false, message: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    // إنشاء Token + حفظ في Cookie
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    await setAuthCookie(token);

    // تحديث آخر تسجيل دخول
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // تسجيل النشاط
    await db.activity.create({
      data: {
        type: "login",
        title: `تسجيل دخول: ${user.name}`,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ، حاول مرة أخرى" },
      { status: 500 }
    );
  }
}