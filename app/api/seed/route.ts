// /api/seed — تعبئة أولية لقاعدة البيانات (يُستدعى مرة واحدة)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // حماية بـ Secret
  const auth = req.headers.get("authorization") || req.nextUrl.searchParams.get("secret");
  const expected = process.env.SEED_SECRET || "default-seed-secret-change-me";
  if (auth !== expected) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await db.user.count();
    if (existing > 0) {
      return NextResponse.json({ success: false, message: `DB has ${existing} users already. Reset DB first.` }, { status: 400 });
    }

    // ===== Users =====
    const passwordHash = await hashPassword("Admin@2026");
    const [admin, sara, khalid, noura, fahad] = await Promise.all([
      db.user.create({ data: { email: "admin@goldenmile.com.sa", name: "أحمد العتيبي", password: passwordHash, role: "admin", phone: "+966 50 123 4567" } }),
      db.user.create({ data: { email: "sara@goldenmile.com.sa", name: "سارة المطيري", password: passwordHash, role: "manager", phone: "+966 50 234 5678" } }),
      db.user.create({ data: { email: "khalid@goldenmile.com.sa", name: "خالد القحطاني", password: passwordHash, role: "editor", phone: "+966 50 345 6789" } }),
      db.user.create({ data: { email: "noura@goldenmile.com.sa", name: "نورة الحربي", password: passwordHash, role: "editor", phone: "+966 50 456 7890" } }),
      db.user.create({ data: { email: "fahad@goldenmile.com.sa", name: "فهد الشمري", password: passwordHash, role: "viewer", phone: "+966 50 567 8901" } }),
    ]);

    // ===== Customers =====
    await db.customer.createMany({
      data: [
        { name: "محمد العنزي", email: "mohamed.alenzi@example.com", phone: "+966 55 111 1111", city: "الرياض", status: "active", totalSpent: 450000, projectsCount: 2, source: "website" },
        { name: "فاطمة الزهراني", email: "fatima.z@example.com", phone: "+966 55 222 2222", city: "جدة", status: "active", totalSpent: 320000, projectsCount: 1, source: "referral" },
        { name: "عبدالله الدوسري", email: "abdullah.d@example.com", phone: "+966 55 333 3333", city: "الدمام", status: "lead", totalSpent: 0, projectsCount: 0, source: "social_media" },
        { name: "هند السلمي", email: "hind.s@example.com", phone: "+966 55 444 4444", city: "الرياض", status: "active", totalSpent: 890000, projectsCount: 3, source: "website" },
        { name: "سلطان الغامدي", email: "sultan.g@example.com", phone: "+966 55 555 5555", city: "مكة", status: "prospect", totalSpent: 0, projectsCount: 0, source: "exhibition" },
        { name: "نوال الشهري", email: "nawal.sh@example.com", phone: "+966 55 666 6666", city: "أبها", status: "inactive", totalSpent: 150000, projectsCount: 1, source: "referral" },
      ],
    });

    // ===== Projects =====
    const now = new Date();
    await db.project.createMany({
      data: [
        { name: "فيلا النخيل - الرياض", clientName: "محمد العنزي", clientPhone: "+966 55 111 1111", type: "residential", status: "in_progress", progress: 65, budget: 1200000, spent: 780000, startDate: new Date(now.getTime() - 90 * 86400000), endDate: new Date(now.getTime() + 60 * 86400000), manager: "سارة المطيري", location: "حي النخيل، الرياض", description: "فيلا فاخرة بمساحة 600 متر مربع تشمل ديكورات داخلية وأعمال تشطيب كاملة" },
        { name: "برج جدة التجاري", clientName: "مجموعة الجبر التجارية", type: "commercial", status: "in_progress", progress: 40, budget: 3500000, spent: 1400000, startDate: new Date(now.getTime() - 60 * 86400000), endDate: new Date(now.getTime() + 180 * 86400000), manager: "أحمد العتيبي", location: "كورنيش جدة", description: "برج مكاتب من 12 طابق بتشطيبات راقية" },
        { name: "مجمع الزهور السكني", clientName: "شركة دار العقارية", type: "residential", status: "planning", progress: 15, budget: 2800000, spent: 420000, startDate: new Date(now.getTime() - 30 * 86400000), endDate: new Date(now.getTime() + 365 * 86400000), manager: "خالد القحطاني", location: "شمال الرياض", description: "40 وحدة سكنية فاخرة" },
        { name: "مستودعات المنطقة الصناعية", clientName: "شركة الشحن السريع", type: "industrial", status: "completed", progress: 100, budget: 800000, spent: 820000, startDate: new Date(now.getTime() - 180 * 86400000), endDate: new Date(now.getTime() - 10 * 86400000), manager: "فهد الشمري", location: "المدينة الصناعية الثانية، الرياض" },
        { name: "صالة الأفراح الكبرى", clientName: "مؤسسة المناسبات الفاخرة", type: "commercial", status: "on_hold", progress: 30, budget: 1500000, spent: 450000, startDate: new Date(now.getTime() - 45 * 86400000), endDate: new Date(now.getTime() + 120 * 86400000), manager: "نورة الحربي", location: "طريق الملك فهد، الرياض" },
        { name: "تطوير شقة سكنية - جدة", clientName: "هند السلمي", type: "residential", status: "completed", progress: 100, budget: 350000, spent: 340000, startDate: new Date(now.getTime() - 120 * 86400000), endDate: new Date(now.getTime() - 20 * 86400000), manager: "سارة المطيري", location: "حي الروضة، جدة" },
      ],
    });

    // ===== Inquiries =====
    await db.inquiry.createMany({
      data: [
        { name: "يوسف العتيبي", email: "yousef.o@example.com", phone: "+966 55 777 7777", subject: "استفسار عن خدمات التشطيب", message: "أرغب في الحصول على عرض سعر لتشطيب فيلا بمساحة 450 متر", status: "new", priority: "high", source: "contact_form", assignedToId: sara.id },
        { name: "ريم الفيفي", email: "reem.f@example.com", phone: "+966 55 888 8888", subject: "تصميم داخلي لشقة", message: "أحتاج مصمم داخلي محترف لشقة 200 متر", status: "in_progress", priority: "medium", source: "contact_form", assignedToId: khalid.id },
        { name: "بدر الحربي", email: "badr.h@example.com", phone: "+966 55 999 9999", subject: "صيانة دورية", message: "أبحث عن عقد صيانة سنوية لمبنى تجاري", status: "new", priority: "low", source: "contact_form" },
        { name: "أمل القرشي", email: "amal.q@example.com", phone: "+966 55 101 0101", subject: "مشروع بناء جديد", message: "نخطط لبناء عمارة سكنية ونحتاج مقاول", status: "resolved", priority: "high", source: "contact_form", assignedToId: admin.id },
        { name: "طارق الشهري", email: "tariq.sh@example.com", phone: "+966 55 202 0202", subject: "تجديد مكتب", message: "نريد تجديد مكتب الشركة بمساحة 300 متر", status: "closed", priority: "medium", source: "contact_form", assignedToId: noura.id },
      ],
    });

    // ===== Design Requests =====
    await db.designRequest.createMany({
      data: [
        { customerName: "هند السلمي", customerEmail: "hind.s@example.com", customerPhone: "+966 55 444 4444", projectName: "تصميم صالة المعيشة", roomType: "living_room", style: "modern", status: "in_review", budget: 45000, deadline: new Date(now.getTime() + 14 * 86400000), images: "[]", notes: "ألوان هادئة مع لمسات ذهبية", assignedToId: khalid.id },
        { customerName: "محمد العنزي", customerEmail: "mohamed.alenzi@example.com", customerPhone: "+966 55 111 1111", projectName: "تصميم الفيلا كامل", roomType: "full_villa", style: "classic", status: "approved", budget: 180000, deadline: new Date(now.getTime() + 30 * 86400000), images: "[]", assignedToId: sara.id },
        { customerName: "فاطمة الزهراني", customerEmail: "fatima.z@example.com", customerPhone: "+966 55 222 2222", projectName: "تصميم مطبخ", roomType: "kitchen", style: "contemporary", status: "completed", budget: 35000, deadline: new Date(now.getTime() - 5 * 86400000), images: "[]", assignedToId: noura.id },
      ],
    });

    // ===== Products =====
    await db.product.createMany({
      data: [
        { name: "أرضيات رخام كرارا", sku: "MR-CRA-001", category: "flooring", price: 450, stock: 500, sold: 120, status: "active", description: "رخام كرارا إيطالي فاخر بجودة عالية" },
        { name: "دهان جدران فاخر", sku: "PT-LX-002", category: "paint", price: 180, stock: 200, sold: 80, status: "active", description: "دهان لاتكس فاخر مقاوم للرطوبة" },
        { name: "إضاءة LED ذكية", sku: "LT-SM-003", category: "lighting", price: 1200, stock: 50, sold: 35, status: "active", description: "نظام إضاءة ذكي قابل للتحكم عن بعد" },
        { name: "أبواب خشب طبيعي", sku: "DR-WD-004", category: "doors", price: 2500, stock: 30, sold: 22, status: "active", description: "أبواب من خشب البلوط الطبيعي" },
        { name: "مغاسل رخام", sku: "WS-MR-005", category: "bathroom", price: 3200, stock: 25, sold: 18, status: "active", description: "مغاسل رخام بتصاميم عصرية" },
        { name: "بلاط سيراميك ثلاثي الأبعاد", sku: "TL-3D-006", category: "flooring", price: 320, stock: 300, sold: 95, status: "active", description: "بلاط بتصميم ثلاثي الأبعاد للجدران" },
      ],
    });

    // ===== Blog Posts =====
    await db.blogPost.createMany({
      data: [
        { title: "أحدث اتجاهات التصميم الداخلي لعام 2026", slug: "interior-design-trends-2026", excerpt: "تعرف على أبرز صيحات التصميم الداخلي لهذا العام", content: "محتوى تفصيلي...", authorId: khalid.id, authorName: khalid.name, category: "design", status: "published", views: 1245, likes: 89, image: "/blog/design-trends.jpg", publishedAt: new Date(now.getTime() - 7 * 86400000) },
        { title: "كيف تختار المقاول المناسب لمشروعك", slug: "choose-right-contractor", excerpt: "دليلك الشامل لاختيار أفضل مقاول", content: "محتوى تفصيلي...", authorId: sara.id, authorName: sara.name, category: "tips", status: "published", views: 892, likes: 56, image: "/blog/contractor-tips.jpg", publishedAt: new Date(now.getTime() - 14 * 86400000) },
        { title: "أهمية الصيانة الدورية للمباني", slug: "building-maintenance", excerpt: "لماذا تحتاج مبناك لصيانة دورية", content: "محتوى تفصيلي...", authorId: noura.id, authorName: noura.name, category: "maintenance", status: "published", views: 567, likes: 34, image: "/blog/maintenance.jpg", publishedAt: new Date(now.getTime() - 21 * 86400000) },
        { title: "مشروع فيلا النخيل: من التصميم إلى التنفيذ", slug: "palm-villa-project", excerpt: "رحلة مشروع فيلا النخيل من البداية", content: "محتوى تفصيلي...", authorId: admin.id, authorName: admin.name, category: "projects", status: "draft", views: 0, likes: 0 },
      ],
    });

    // ===== Testimonials =====
    await db.testimonial.createMany({
      data: [
        { customerName: "محمد العنزي", customerRole: "مالك فيلا - الرياض", rating: 5, content: "تجربة رائعة مع الميل الذهبي. أنجزوا مشروع فيلتي في الوقت المحدد وبجودة استثنائية. أنصح بهم بشدة.", status: "approved", featured: true },
        { customerName: "هند السلمي", customerRole: "مالكة شقة - جدة", rating: 5, content: "فريق محترف ومتعاون. التصميم الداخلي لشقتي فاق توقعاتي. شكراً لكم على الإبداع.", status: "approved", featured: true },
        { customerName: "فاطمة الزهراني", customerRole: "مالكة منزل - جدة", rating: 4, content: "جودة عالية واهتمام بالتفاصيل. أنصح بالتعامل معهم.", status: "approved", featured: false },
      ],
    });

    // ===== Settings =====
    const settings: [string, string][] = [
      ["site_name", "الميل الذهبي"],
      ["site_name_en", "Golden Mile"],
      ["tagline", "نحول أحلامك إلى واقع بتصاميم فاخرة"],
      ["phone", "+966 11 234 5678"],
      ["whatsapp", "+966 50 123 4567"],
      ["email", "info@goldenmile.com.sa"],
      ["address", "الرياض، المملكة العربية السعودية"],
      ["working_hours", "السبت - الخميس: 9 صباحاً - 9 مساءً"],
      ["facebook", "https://facebook.com/goldenmile"],
      ["instagram", "https://instagram.com/goldenmile"],
      ["twitter", "https://twitter.com/goldenmile"],
    ];
    await db.setting.createMany({ data: settings.map(([key, value]) => ({ key, value })) });

    // ===== Activities =====
    await db.activity.createMany({
      data: [
        { type: "project_completed", title: "اكتمال مشروع تطوير شقة سكنية", userId: sara.id },
        { type: "inquiry_received", title: "استفسار جديد من يوسف العتيبي" },
        { type: "product_added", title: "إضافة منتج جديد: أرضيات رخام كرارا", userId: khalid.id },
        { type: "blog_published", title: "نشر مقال: أحدث اتجاهات التصميم", userId: khalid.id },
        { type: "customer_added", title: "عميل جديد: هند السلمي", userId: admin.id },
        { type: "login", title: "تسجيل دخول: أحمد العتيبي", userId: admin.id },
      ],
    });

    return NextResponse.json({
      success: true,
      message: "✅ تم تعبئة قاعدة البيانات بنجاح!",
      counts: { users: 5, customers: 6, projects: 6, inquiries: 5, designRequests: 3, products: 6, blogPosts: 4, testimonials: 3, activities: 6, settings: settings.length },
    });
  } catch (e: any) {
    console.error("Seed error:", e);
    return NextResponse.json({ success: false, message: "خطأ في التعبئة", error: e?.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    info: "POST to /api/seed with header: Authorization: <SEED_SECRET>",
    message: "This endpoint populates the database with sample data",
  });
}