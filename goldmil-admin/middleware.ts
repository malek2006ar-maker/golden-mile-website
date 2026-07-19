// Middleware لحماية المسارات
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/api/auth", "/api/inquiries"]; // /api/inquiries مفتوح لنموذج التواصل

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // اسمح بالمسارات العامة
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // اسمح بالملفات الثابتة والصور
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // تحقق من الـ Token
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    // API → 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    // صفحة → redirect لـ login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * تطابق كل المسارات ما عدا:
     * - api/auth (المصادقة)
     * - api/inquiries (استقبال النماذج الخارجية)
     * - _next/static, _next/image, favicon
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};