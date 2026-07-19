// JWT + bcrypt + Auth utilities (Next.js version)
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const COOKIE_NAME = "admin-token";

if (!JWT_SECRET || JWT_SECRET.length < 16) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("⚠️ JWT_SECRET ضعيف جداً. ضع قيمة قوية في الإنتاج.");
  }
  console.warn("⚠️  JWT_SECRET ضعيف — ضع قيمة قوية في الإنتاج.");
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try { return jwt.verify(token, JWT_SECRET) as JWTPayload; }
  catch { return null; }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, role: true, avatar: true, isActive: true, phone: true },
  });
  return user && user.isActive ? user : null;
}

export const ROLE_LEVELS: Record<string, number> = { admin: 4, manager: 3, editor: 2, viewer: 1 };
export const hasRole = (role: string, minRole: string) => (ROLE_LEVELS[role] || 0) >= (ROLE_LEVELS[minRole] || 0);