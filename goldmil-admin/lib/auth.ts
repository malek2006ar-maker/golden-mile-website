// JWT + bcrypt authentication utilities
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_NAME = "admin-token";

if (!JWT_SECRET) {
  throw new Error("⚠️ JWT_SECRET غير معرّف في .env");
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

/** تشفير كلمة المرور */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/** التحقق من كلمة المرور */
export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

/** إنشاء JWT Token */
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/** التحقق من JWT Token */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/** حفظ Token في HTTP-Only Cookie */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 أيام
  });
}

/** حذف الـ Cookie */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** جلب المستخدم الحالي من الـ Cookie */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      isActive: true,
      phone: true,
    },
  });

  return user && user.isActive ? user : null;
}

/** التحقق من صلاحية المستخدم للوصول */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

/** التحقق من صلاحية الأدوار */
export function hasRole(user: { role: string } | null, allowed: string[]): boolean {
  return !!user && allowed.includes(user.role);
}