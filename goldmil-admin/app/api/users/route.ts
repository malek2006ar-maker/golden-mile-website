import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireUser, hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    await requireUser();
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        avatar: true,
        lastLogin: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: users, total: users.length });
  } catch {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await requireUser();
    if (currentUser.role !== "admin") {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const body = await request.json();
    const hashed = await hashPassword(body.password || "Temp@2026");

    const user = await db.user.create({
      data: {
        email: body.email.toLowerCase(),
        name: body.name,
        password: hashed,
        phone: body.phone,
        role: body.role || "editor",
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: user, success: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await requireUser();
    const { id, ...updates } = await request.json();

    // فقط الأدمن أو المستخدم نفسه يقدر يعدل
    if (currentUser.role !== "admin" && currentUser.id !== id) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    // لو يغيّر كلمة المرور، نشفرها
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    const user = await db.user.update({
      where: { id },
      data: updates,
      select: {
        id: true, email: true, name: true, role: true, isActive: true,
        phone: true, avatar: true,
      },
    });

    return NextResponse.json({ data: user, success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}