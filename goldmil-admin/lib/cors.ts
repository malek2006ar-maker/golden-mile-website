// CORS helper — للسماح للموقع الرئيسي (goldmil.matrxe.com) بإرسال طلبات للوحة الإدارة
import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://goldmil.matrxe.com",
  "https://www.goldmil.matrxe.com",
  "https://admin.goldmil.matrxe.com",
  "http://localhost:3000", // development
  "http://localhost:3001",
];

export function corsHeaders(origin?: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
  };
}

export function handleCors(request: Request) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders(request.headers.get("origin")),
    });
  }
  return null;
}