# 🚀 نشر الميل الذهبي على Vercel

دليل كامل خطوة بخطوة لرفع المشروع على Vercel مع قاعدة بيانات Postgres.

---

## 📋 المتطلبات
- حساب GitHub (لرفع الكود)
- حساب Vercel ([vercel.com](https://vercel.com) - مجاني)
- ~5 دقائق

---

## الخطوة 1: ارفع المشروع على GitHub

### الخيار A: عبر git
```bash
cd goldmil-vercel
git init
git add .
git commit -m "Initial commit"
# أنشئ repo جديد على GitHub باسم goldmil-vercel
git remote add origin https://github.com/YOUR_USERNAME/goldmil-vercel.git
git branch -M main
git push -u origin main
```

### الخيار B: ارفع ZIP مباشرة على Vercel
في الخطوة 2 عندك خيار "Browse" لرفع المجلد بدون GitHub.

---

## الخطوة 2: أنشئ مشروع Vercel

1. اذهب إلى [vercel.com/new](https://vercel.com/new)
2. اضغط **"Import"** بجانب الـ repo `goldmil-vercel`
3. **Framework Preset**: Next.js (تلقائي)
4. **Root Directory**: `.` (افتراضي)
5. اضغط **Deploy** (سيفشل أول مرة لأن DB ما انضبطت، عادي!)

---

## الخطوة 3: أنشئ قاعدة البيانات Postgres

1. في صفحة Vercel للمشروع، اضغط **Storage** (أعلى)
2. اضغط **Create Database** ← **Postgres** ← **Continue**
3. اسم الـ DB: `golden-mile-db` (أو أي شي)
4. **Region**: Frankfurt (fra1) أو الأقرب لك
5. اضغط **Create**

✅ Vercel هيضيف تلقائياً `DATABASE_URL` في Environment Variables.

---

## الخطوة 4: أضف Environment Variables

في Vercel: **Settings** → **Environment Variables** → أضف القيم التالية:

| Key | Value | ملاحظة |
|---|---|---|
| `DATABASE_URL` | (مضاف تلقائياً من Postgres) | لا تلمسه |
| `JWT_SECRET` | `Gld-Ml-2026-sUp3r-S3cr3t-K3y!@#$%^&*` | **غيّره لقيمة عشوائية قوية** |
| `JWT_EXPIRES_IN` | `7d` | اختياري |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` | ضع رابط Vercel بتاعك |
| `SEED_SECRET` | `seed-2026-secret-key` | للقطة التعبئة |

⚠️ **مهم**: JWT_SECRET ضع قيمة عشوائية قوية. مثلاً:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

**Environment**: اختر **Production** (و **Preview** إذا حبيت).

اضغط **Save**.

---

## الخطوة 5: أعد النشر

روح لصفحة المشروع → **Deployments** → اضغط على آخر deploy → **⋯** → **Redeploy**
(أو اضغط على branch وارفع commit جديد)

انتظر حتى يخلص البناء (2-3 دقائق).

---

## الخطوة 6: عبّي قاعدة البيانات

بعد ما يخلص البناء بنجاح، نفّذ الأمر التالي من جهازك:

```bash
# استبدل YOUR-APP باسم تطبيقك على Vercel
# استبدل YOUR-SEED-SECRET بالقيمة اللي حطيتها في SEED_SECRET
curl -X POST https://YOUR-APP.vercel.app/api/seed \
  -H "Authorization: YOUR-SEED-SECRET"
```

✅ لازم تشوف رد زي:
```json
{
  "success": true,
  "message": "✅ تم تعبئة قاعدة البيانات بنجاح!",
  "counts": {
    "users": 5, "customers": 6, "projects": 6, "inquiries": 5,
    "designRequests": 3, "products": 6, "blogPosts": 4,
    "testimonials": 3, "activities": 6, "settings": 11
  }
}
```

> 💡 **ملاحظة**: إذا قلت "DB has X users already" معناته البيانات موجودة، عادي.

---

## الخطوة 7: جرّب الموقع! 🎉

### الموقع العام
```
https://your-app.vercel.app
```

### صفحة تسجيل الدخول للوحة التحكم
```
https://your-app.vercel.app/admin/login
```

### بيانات الدخول الافتراضية
| البريد | كلمة المرور | الدور |
|---|---|---|
| `admin@goldenmile.com.sa` | `Admin@2026` | **Admin (كامل الصلاحيات)** |
| `sara@goldenmile.com.sa` | `Admin@2026` | Manager |
| `khalid@goldenmile.com.sa` | `Admin@2026` | Editor |

---

## 🎨 اربط دومين مخصص (اختياري)

1. Vercel → **Settings** → **Domains**
2. اكتب الدومين (مثلاً `goldmil.com`)
3. أضف السجلات في مزود الدومين:
   ```
   Type: A     Name: @    Value: 76.76.21.21
   Type: CNAME Name: www  Value: cname.vercel-dns.com
   ```
4. انتظر 5-60 دقيقة حتى ينتشر DNS.

---

## 🛠️ التشغيل المحلي (للتطوير)

```bash
# 1. انسخ ملف البيئة
cp .env.example .env
# عدّل DATABASE_URL إلى SQLite للتطوير:
# DATABASE_URL="file:./dev.db"

# 2. غيّر Prisma schema provider مؤقتاً إلى "sqlite" للتجريب

# 3. install + generate + migrate
npm install
npx prisma generate
npx prisma db push

# 4. شغّل السيرفر
npm run dev
# يفتح على http://localhost:3000
```

---

## 📁 بنية المشروع

```
goldmil-vercel/
├── app/
│   ├── api/                    ← كل الـ API كـ Serverless functions
│   │   ├── auth/               ← login, logout, me
│   │   ├── admin/              ← كل CRUDs + analytics
│   │   ├── inquiries/          ← public + admin
│   │   ├── products/           ← public
│   │   ├── blog/               ← public
│   │   ├── testimonials/       ← public
│   │   ├── settings/           ← public
│   │   └── seed/               ← تعبئة DB (مرة واحدة)
│   ├── admin/
│   │   ├── login/              ← صفحة تسجيل الدخول
│   │   └── (dashboard)/        ← كل صفحات اللوحة (محمية)
│   ├── contact/                ← نموذج الاتصال
│   ├── page.jsx                ← الصفحة الرئيسية (بدون رابط admin)
│   └── globals.css
├── components/                 ← UI components
├── lib/
│   ├── db.ts                   ← Prisma client
│   └── auth.ts                 ← JWT + bcrypt
├── prisma/
│   └── schema.prisma           ← 10 جداول
├── .env.example
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── VERCEL_DEPLOY.md            ← هذا الملف
```

---

## 🔐 ملاحظات أمنية

1. **JWT_SECRET** لازم يكون قوي. غيّره!
2. **SEED_SECRET** لازم يكون مختلف عن JWT_SECRET.
3. كل APIs محمية بـ `getCurrentUser()` (httpOnly cookies).
4. **CORS**: الكوكيز `httpOnly` و `sameSite=lax` — آمن.
5. **Rate Limiting**: للإصدار الإنتاجي، استخدم Vercel Edge Middleware أو Upstash.
6. **DB backups**: Vercel Postgres يحفظ snapshots تلقائياً.

---

## 🆘 حل المشاكل الشائعة

### ❌ Build failed: "Prisma Client not generated"
**الحل**: تأكد من وجود `postinstall: prisma generate` في package.json (موجود ✓).

### ❌ API يرجع 500 / "Environment variable not found: DATABASE_URL"
**الحل**: Vercel → Storage → Postgres → تأكد إنها مرتبطة بالمشروع. أعد النشر.

### ❌ Login يرجع 401 مع بيانات صحيحة
**الحل**: شغّل seed endpoint أولاً (الخطوة 6).

### ❌ "Cannot find module '@prisma/client'"
**الحل**: `vercel.json` فيه `buildCommand: "prisma generate && next build"` — أعد النشر.

### ❌ بطيء في أول request
**الحل**: Vercel serverless functions تتوقف في البرد. أول request قد يأخذ 1-2 ثانية.

---

## 📊 حدود Vercel المجانية

| المورد | الحد |
|---|---|
| Bandwidth | 100 GB/شهر |
| Serverless Executions | 100 GB-hours |
| Postgres Storage | 256 MB (يكفي آلاف السجلات) |
| Postgres Compute | 60 hours/شهر |
| Deployments | غير محدود |

للمشاريع الصغيرة والمتوسطة، الخطة المجانية كافية جداً.

---

## ✅ قائمة التحقق النهائية

- [ ] رفعت المشروع على GitHub
- [ ] ربطت GitHub بـ Vercel
- [ ] أنشأت Postgres DB
- [ ] أضفت Environment Variables
- [ ] أعدت النشر (Redeploy)
- [ ] شغّلت seed endpoint
- [ ] جرّبت `/admin/login`
- [ ] غيّرت JWT_SECRET و SEED_SECRET لقيم عشوائية قوية

🎉 **مبروك! مشروعك الآن على الهواء!**

---

📞 للدعم: info@goldenmile.com.sa
🌐 [vercel.com/docs](https://vercel.com/docs)