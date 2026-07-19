# 🛡️ GoldMil Admin — لوحة تحكم الميل الذهبي

> لوحة تحكم احترافية كاملة بالعربية (RTL) لمؤسسة الميل الذهبي للمقاولات والديكورات
> مدمجة مع [`goldmil.matrxe.com`](https://goldmil.matrxe.com)

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)](https://prisma.io)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57)](https://sqlite.org)

---

## ⚡ تشغيل سريع (دقيقة واحدة)

```bash
npm install
npm run db:push        # إنشاء قاعدة البيانات
npm run db:seed        # بيانات تجريبية
npm run dev            # تشغيل بيئة التطوير

# افتح
http://localhost:3000

# بيانات الدخول:
# البريد: admin@goldenmile.com.sa
# كلمة المرور: Admin@2026
```

---

## 🎯 المميزات الكاملة

### الوحدات الإدارية (10 وحدات)
- 📊 **نظرة عامة** — KPIs + Charts + أحدث النشاط
- 📈 **التحليلات** — تحليلات تفصيلية من قاعدة البيانات
- 📁 **المشاريع** — إدارة كاملة مع تتبع التقدم والميزانيات
- 👥 **العملاء** — CRM مع تتبع الإنفاق والتواصل
- 📨 **الاستفسارات** — استقبال من الموقع + إدارة الأولويات
- 🎨 **استوديو التصميم** — طلبات التصاميم ثلاثية الأبعاد
- 🛍️ **المتجر** — منتجات + مخزون + تنبيهات
- 📝 **المدونة** — إدارة المقالات والإحصائيات
- ⭐ **آراء العملاء** — تقييمات ومراجعات
- 👤 **المستخدمون** — 4 أدوار (admin, manager, editor, viewer)
- ⚙️ **الإعدادات** — ملف شخصي + أمان + موقع + تكاملات

### المميزات التقنية
- 🎨 **نفس هوية الموقع** — ألوان `#c8962e` و`#f0c75e`، خطوط Cairo + Tajawal
- 🗄️ **Prisma + SQLite** — جاهز للإنتاج بدون أي إعدادات
- 🔐 **JWT Authentication** — مع HTTP-Only cookies + bcrypt
- 🛡️ **Middleware Protection** — حماية تلقائية لكل المسارات
- 🌐 **CORS مفعّل** — لاستقبال النماذج من الموقع الرئيسي
- 📱 **متجاوب 100%** — جوال، تابلت، ديسكتوب
- 🌗 **RTL عربي كامل** — مع دعم الأرقام LTR
- 🔔 **Toasts + Notifications** — تجربة مستخدم سلسة
- 💾 **Auto Backup** — سكربت نسخ احتياطي يومي
- 📊 **3 أنواع Charts** — Area, Bar, Donut عبر Recharts
- 🔍 **Data Tables ذكية** — بحث + ترتيب + pagination
- 🎯 **TypeScript كامل** — types لكل شيء
- 📡 **REST API** — 10 endpoints موثقة

---

## 📁 هيكل المشروع

```
goldmil-admin/
├── app/                              # Next.js App Router
│   ├── api/                          # REST API endpoints
│   │   ├── auth/                     #   تسجيل دخول + logout + me
│   │   ├── analytics/route.ts        #   بيانات الـ dashboard
│   │   ├── projects/route.ts         #   CRUD المشاريع
│   │   ├── customers/route.ts        #   CRUD العملاء
│   │   ├── inquiries/route.ts        #   CRUD + استقبال خارجي
│   │   ├── store/route.ts            #   CRUD المنتجات
│   │   ├── blog/route.ts             #   CRUD المقالات
│   │   ├── testimonials/route.ts     #   CRUD الآراء
│   │   ├── users/route.ts            #   إدارة المستخدمين
│   │   └── settings/route.ts         #   إعدادات الموقع
│   ├── dashboard/                    # صفحات اللوحة
│   │   ├── page.tsx                  #   Overview
│   │   ├── analytics/                #   التحليلات
│   │   ├── projects/                 #   المشاريع
│   │   ├── customers/                #   العملاء
│   │   ├── inquiries/                #   الاستفسارات
│   │   ├── design-studio/            #   استوديو التصميم
│   │   ├── store/                    #   المتجر
│   │   ├── blog/                     #   المدونة
│   │   ├── testimonials/             #   آراء العملاء
│   │   ├── users/                    #   المستخدمون
│   │   └── settings/                 #   الإعدادات
│   ├── login/                        # صفحة تسجيل الدخول
│   ├── globals.css                   # نظام التصميم
│   └── layout.tsx                    # Root layout (RTL, dark)
│
├── components/
│   ├── charts/                       # Area, Bar, Donut
│   ├── forms/                        # Login, Settings
│   ├── layout/                       # Sidebar, Topbar, Shell
│   ├── tables/                       # DataTable
│   └── ui/                           # Button, Avatar, StatCard, ...
│
├── lib/
│   ├── auth.ts                       # JWT + bcrypt utilities
│   ├── db.ts                         # Prisma client singleton
│   ├── cors.ts                       # CORS headers
│   ├── mock-data.ts                  # بيانات تجريبية (للتطوير)
│   └── utils.ts                      # cn(), formatCurrency, timeAgo
│
├── prisma/
│   ├── schema.prisma                 # 10 جداول كاملة
│   └── seed.ts                       # Seed script
│
├── scripts/
│   └── backup.ts                     # نسخ احتياطي تلقائي
│
├── integration/
│   └── contact-form-snippet.tsx      # سنـيبـت ربط نموذج الاتصال
│
├── types/
│   └── index.ts                      # TypeScript types
│
├── middleware.ts                     # Route protection
├── tailwind.config.ts                # متطابق مع ألوان الموقع
├── DEPLOYMENT.md                     # دليل النشر الكامل
├── README.md                         # هذا الملف
└── package.json
```

---

## 🔌 الدمج مع `goldmil.matrxe.com`

### طريقة 1: استقبال النماذج (الأسهل) ⭐

في مشروع الموقع الأصلي، حدّث نموذج الاتصال ليرسل للوحة الإدارة:

```typescript
// في app/contact/page.tsx (أو أي صفحة فيها form)
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  const res = await fetch("https://admin.goldmil.matrxe.com/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      source: "contact_form",
      priority: "medium",
    }),
  });

  const data = await res.json();
  if (data.success) {
    toast.success("تم استلام رسالتك!");
    // ...
  }
}
```

### طريقة 2: زر دخول للوحة من الموقع

```tsx
<a
  href="https://admin.goldmil.matrxe.com"
  target="_blank"
  rel="noopener noreferrer"
  className="btn-outline-gold"
>
  لوحة التحكم
</a>
```

### طريقة 3: SSO متقدم (اختياري)

لو تبي تسجيل دخول موحد بين الموقع واللوحة، عدّل middleware اللوحة ليتحقق من cookies الموقع الأصلي.

---

## 🚀 النشر على Hostinger

راجع **[DEPLOYMENT.md](./DEPLOYMENT.md)** للتفاصيل الكاملة.

### ملخص سريع:

```bash
# 1. رفع
scp -r goldmil-admin.zip root@YOUR-SERVER:/var/www/html/

# 2. فك وتجهيز
cd /var/www/html
unzip goldmil-admin.zip -d admin
cd admin
npm install --production

# 3. قاعدة البيانات
cp .env.example .env
nano .env   # ضع JWT_SECRET قوي
npx prisma db push
npm run db:seed

# 4. بناء
npm run build

# 5. PM2
pm2 start ecosystem.config.js
pm2 save && pm2 startup

# 6. Apache (مع SSL)
sudo a2enmod proxy proxy_http ssl headers
sudo certbot --apache -d admin.goldmil.matrxe.com
```

---

## 🛠️ الأوامر المتاحة

```bash
npm run dev            # بيئة التطوير
npm run build          # بناء Production
npm run start          # تشغيل Production
npm run lint           # ESLint
npm run type-check     # TypeScript check

npm run db:migrate     # إنشاء migration
npm run db:push        # push schema بدون migration
npm run db:seed        # تعبئة بيانات تجريبية
npm run db:studio      # Prisma Studio (GUI)
npm run db:reset       # ⚠️ حذف كل البيانات
npm run db:backup      # نسخ احتياطي

pm2 start ecosystem.config.js   # تشغيل
pm2 logs goldmil-admin          # السجلات
pm2 restart goldmil-admin       # إعادة تشغيل
```

---

## 🎨 نظام التصميم

كل الـ tokens تطابق موقعك الأصلي:

```typescript
// tailwind.config.ts
gold: {
  300: "#f0c75e",  // Hover + accents
  600: "#c8962e",  // Primary gold
  900: "#5a3f10",  // Dark
},
ink: {
  950: "#07070f",  // Background bottom
  900: "#090913",  // Body
  800: "#0d0d1a",  // Cards
  700: "#13131f",  // Borders
}
```

الـ classes الجاهزة:
```html
<button class="btn-gold">...</button>
<button class="btn-outline-gold">...</button>
<div class="card card-hover">...</div>
<span class="badge-gold">...</span>
<span class="badge-success">...</span>
<div class="glass">...</div>
<p class="text-gradient-gold">...</p>
<input class="input">...</input>
```

---

## 🔐 الأدوار والصلاحيات

| الدور | المشاريع | العملاء | الاستفسارات | المتجر | المدونة | المستخدمون |
|------|---------|---------|-------------|--------|---------|------------|
| **admin** | ✓ كل شيء | ✓ كل شيء | ✓ كل شيء | ✓ كل شيء | ✓ كل شيء | ✓ كل شيء |
| **manager** | ✓ CRUD | ✓ CRUD | ✓ CRUD | ✓ CRUD | عرض فقط | ✗ |
| **editor** | ✓ CRUD | ✓ CRUD | ✓ CRUD | ✓ CRUD | ✓ CRUD | ✗ |
| **viewer** | عرض فقط | عرض فقط | عرض فقط | عرض فقط | عرض فقط | ✗ |

---

## 📡 REST API Reference

### المصادقة
```
POST /api/auth          # تسجيل دخول (body: email, password)
POST /api/auth/logout   # تسجيل خروج
GET  /api/auth/me       # المستخدم الحالي
```

### البيانات (تتطلب مصادقة)
```
GET    /api/projects       # قائمة المشاريع
POST   /api/projects       # إنشاء مشروع
PATCH  /api/projects       # تحديث (يحتاج id في body)

GET    /api/customers
POST   /api/customers
PATCH  /api/customers

GET    /api/inquiries
POST   /api/inquiries      # ⚡ مفتوح للنماذج الخارجية
PATCH  /api/inquiries      # تحديث حالة

GET    /api/store
POST   /api/store
PATCH  /api/store

GET    /api/blog
POST   /api/blog

GET    /api/testimonials
PATCH  /api/testimonials   # موافقة/رفض

GET    /api/users
POST   /api/users          # admin فقط
PATCH  /api/users

GET    /api/settings
POST   /api/settings

GET    /api/analytics      # dashboard data
```

---

## 📋 بيانات الدخول الافتراضية

| الحقل | القيمة |
|------|--------|
| البريد | `admin@goldenmile.com.sa` |
| كلمة المرور | `Admin@2026` |

**⚠️ غيّرها فوراً في الإنتاج!**

---

## 📄 الترخيص

MIT — استخدمه، عدّله، وزّعه كما تشاء.

---

**صنع بـ ❤️ للميل الذهبي** | [goldmil.matrxe.com](https://goldmil.matrxe.com)