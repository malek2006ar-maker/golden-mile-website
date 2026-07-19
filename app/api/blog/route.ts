// GET /api/blog — عام
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (slug) {
      const post = await db.blogPost.findUnique({ where: { slug } });
      if (!post || post.status !== "published") return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
      await db.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
      return NextResponse.json(post);
    }
    const posts = await db.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      select: { id: true, title: true, slug: true, excerpt: true, authorName: true, category: true, image: true, publishedAt: true, views: true, likes: true },
    });
    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}