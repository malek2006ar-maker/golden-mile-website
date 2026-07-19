/**
 * سكربت النسخ الاحتياطي التلقائي
 * شغّله مع cron يومياً:
 *   0 3 * * * cd /var/www/html/admin && npm run db:backup
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const db = new PrismaClient();

async function backup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(process.cwd(), "backups");

  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  // SQLite database file copy
  const dbPath = process.env.DATABASE_URL?.replace("file:", "") || "./prisma/dev.db";
  const sourceFile = path.isAbsolute(dbPath) ? dbPath : path.join(process.cwd(), dbPath);

  if (fs.existsSync(sourceFile)) {
    const backupFile = path.join(backupDir, `backup-${timestamp}.db`);
    fs.copyFileSync(sourceFile, backupFile);
    console.log(`✅ تم نسخ قاعدة البيانات: ${backupFile}`);
  }

  // JSON export
  const data = {
    timestamp,
    users: await db.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true } }),
    projects: await db.project.findMany(),
    customers: await db.customer.findMany(),
    inquiries: await db.inquiry.findMany(),
    designRequests: await db.designRequest.findMany(),
    products: await db.product.findMany(),
    blogPosts: await db.blogPost.findMany(),
    testimonials: await db.testimonial.findMany(),
    activities: await db.activity.findMany({ take: 1000 }),
    settings: await db.setting.findMany(),
  };

  const jsonFile = path.join(backupDir, `backup-${timestamp}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ تم تصدير JSON: ${jsonFile}`);

  // حذف النسخ الأقدم من 30 يوم
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  fs.readdirSync(backupDir).forEach((file) => {
    const filePath = path.join(backupDir, file);
    const stat = fs.statSync(filePath);
    if (stat.mtimeMs < thirtyDaysAgo) {
      fs.unlinkSync(filePath);
      console.log(`🗑️  حذف نسخة قديمة: ${file}`);
    }
  });

  console.log(`\n🎉 اكتمل النسخ الاحتياطي!`);
}

backup()
  .catch((e) => {
    console.error("❌ خطأ في النسخ الاحتياطي:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());