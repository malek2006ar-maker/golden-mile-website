# 🔌 دليل ربط لوحة التحكم (goldmil-admin) بالموقع الرئيسي

> هذا الدليل يشرح كيفية ربط الموقع الرئيسي بلوحة التحكم لاستقبال النماذج والاستفسارات

---

## 📚 محتويات الدليل

1. [الطرق المتاحة للربط](#الطرق-المتاحة-للربط)
2. [الطريقة 1: استقبال النماذج (الأسهل)](#الطريقة-1-استقبال-النماذج-الأسهل-)
3. [الطريقة 2: زر الدخول للوحة](#الطريقة-2-زر-الدخول-للوحة)
4. [الطريقة 3: SSO متقدم](#الطريقة-3-sso-متقدم)
5. [معالجة الأخطاء والمراقبة](#معالجة-الأخطاء-والمراقبة)

---

## 🎯 الطرق المتاحة للربط

| الطريقة | المميزات | الصعوبة |
|--------|---------|--------|
| **استقبال النماذج** | سهل، آمن، لا يحتاج مصادقة | ⭐ سهل جداً |
| **زر الدخول** | بسيط جداً | ⭐ سهل جداً |
| **SSO متقدم** | تسجيل دخول موحد | ⭐⭐⭐ متقدم |

---

## ✅ الطريقة 1: استقبال النماذج (الأسهل) ⭐

### الخطوة 1️⃣: تضمين ملف التكامل

أضف هذا السطر في ملف HTML الأساسي (`index.html`) قبل إغلاق الـ `</body>`:

```html
<!-- 🔌 ربط لوحة التحكم -->
<script src="/js/admin-integration.js"></script>
```

### الخطوة 2️⃣: ربط نموذج الاتصال

في نموذج الاتصال الموجود في الموقع، أضف معالج الـ form:

```html
<form id="contact-form">
  <div>
    <label for="name">الاسم *</label>
    <input 
      type="text" 
      id="name"
      name="name" 
      placeholder="أدخل اسمك الكامل"
      required
    >
  </div>

  <div>
    <label for="email">البريد الإلكتروني *</label>
    <input 
      type="email" 
      id="email"
      name="email" 
      placeholder="your@email.com"
      required
    >
  </div>

  <div>
    <label for="phone">رقم الهاتف</label>
    <input 
      type="tel" 
      id="phone"
      name="phone" 
      placeholder="+966 50 000 0000"
    >
  </div>

  <div>
    <label for="subject">الموضوع</label>
    <input 
      type="text" 
      id="subject"
      name="subject" 
      placeholder="موضوع الاستفسار"
    >
  </div>

  <div>
    <label for="message">الرسالة *</label>
    <textarea 
      id="message"
      name="message" 
      placeholder="اكتب رسالتك هنا..."
      required
    ></textarea>
  </div>

  <div>
    <label for="priority">الأولوية</label>
    <select id="priority" name="priority">
      <option value="low">منخفض</option>
      <option value="medium" selected>متوسط</option>
      <option value="high">عالي</option>
    </select>
  </div>

  <button type="submit" class="btn-gold">
    إرسال الرسالة
  </button>
</form>

<!-- 🔌 ربط لوحة التحكم -->
<script src="/js/admin-integration.js"></script>
<script>
  // ربط معالج النموذج
  const form = document.getElementById("contact-form");
  form?.addEventListener("submit", handleContactFormSubmit);
</script>
```

### ✨ النتيجة:

- ✅ عند إرسال النموذج، تُرسل البيانات إلى لوحة التحكم
- ✅ الاستفسارات تظهر في قسم **📨 الاستفسارات** في اللوحة
- ✅ لا تحتاج إلى أي مصادقة أو توكن
- ✅ معالجة أخطاء ذكية وإشعارات للمستخدم

---

## 🔗 الطريقة 2: زر الدخول للوحة

أضف زر في الموقع يأخذ المستخدم إلى لوحة التحكم:

```html
<!-- في Header أو في صفحة الإعدادات -->
<a 
  href="https://admin.goldmil.matrxe.com" 
  target="_blank" 
  rel="noopener noreferrer" 
  class="btn btn-gold"
>
  📊 لوحة التحكم
</a>
```

أو مع أيقونة أكثر احترافية:

```html
<a 
  href="https://admin.goldmil.matrxe.com" 
  target="_blank" 
  rel="noopener noreferrer" 
  class="btn-outline-gold"
>
  <i class="fas fa-dashboard"></i> لوحة التحكم
</a>
```

---

## 🔐 الطريقة 3: SSO متقدم

لربط SSO (تسجيل دخول موحد)، تحتاج إلى تعديل middleware اللوحة:

### في الموقع الرئيسي:

```javascript
// حفظ JWT token بعد تسجيل الدخول
function handleLogin(email, password) {
  // ... منطق تسجيل الدخول الخاص بك
  
  // حفظ الـ token في cookie
  document.cookie = `auth_token=${jwtToken}; 
    path=/; 
    secure; 
    samesite=strict`;
}
```

### في لوحة التحكم:

```typescript
// في middleware.ts
import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
  // التحقق من cookie من الموقع الأصلي
  const token = request.cookies.get("auth_token")?.value;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch {
      // Token غير صحيح
      return redirectToLogin(request);
    }
  }

  return NextResponse.next();
}
```

---

## 📊 البيانات المرسلة من النموذج

عند إرسال النموذج، يتم إرسال هذه البيانات:

```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "phone": "+966 50 123 4567",
  "subject": "استفسار عن المشاريع",
  "message": "أريد معرفة المزيد عن خدماتكم...",
  "source": "website_contact_form",
  "priority": "medium",
  "status": "new",
  "createdAt": "2026-07-19T10:30:00Z"
}
```

---

## 🔍 مثال عملي كامل

هنا مثال كامل لتطبيق الربط:

### HTML (contact.html)

```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>اتصل بنا - الميل الذهبي</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <main>
    <section class="contact-section">
      <h1>اتصل بنا</h1>
      <p>نحن هنا للإجابة على أسئلتك</p>

      <form id="contact-form" class="contact-form">
        <input 
          type="text" 
          name="name" 
          placeholder="الاسم الكامل" 
          required
        >
        <input 
          type="email" 
          name="email" 
          placeholder="البريد الإلكتروني" 
          required
        >
        <input 
          type="tel" 
          name="phone" 
          placeholder="رقم الهاتف"
        >
        <input 
          type="text" 
          name="subject" 
          placeholder="الموضوع"
        >
        <textarea 
          name="message" 
          placeholder="الرسالة" 
          required
        ></textarea>

        <button type="submit" class="btn btn-gold">
          إرسال
        </button>
      </form>
    </section>
  </main>

  <!-- 🔌 تضمين التكامل -->
  <script src="/js/admin-integration.js"></script>
  <script>
    document.getElementById("contact-form")
      .addEventListener("submit", handleContactFormSubmit);
  </script>
</body>
</html>
```

---

## ⚠️ معالجة الأخطاء والمراقبة

### مراقبة الرسائل المرسلة

في لوحة التحكم (`goldmil-admin`)، اذهب إلى:
- **📨 الاستفسارات** → سترى جميع الرسائل من الموقع

### الأخطاء الشائعة وحلولها

| المشكلة | السبب | الحل |
|--------|------|------|
| الرسالة لا تُرسل | مشكلة CORS | تأكد من أن CORS مفعّل في اللوحة |
| 404 Not Found | URL اللوحة خاطئة | تحقق من `ADMIN_API_URL` |
| Timeout | خادم اللوحة معطل | تحقق من حالة اللوحة |

### تفعيل logging

في ملف `admin-integration.js`، سترى رسائل في console:

```javascript
// افتح أدوات المتصفح (F12) ثم الـ Console
📤 إرسال الاستفسار إلى لوحة التحكم...
✅ تم استلام الرسالة بنجاح في لوحة التحكم!
```

---

## 🚀 خطوات التطبيق الفورية

### ✓ في الموقع الرئيسي:

1. انسخ ملف `js/admin-integration.js`
2. أضف السطر `<script src="/js/admin-integration.js"></script>` في HTML
3. أضف معالج الـ form: `form.addEventListener("submit", handleContactFormSubmit)`

### ✓ في لوحة التحكم:

لا تحتاج إلى أي تعديل! الـ API موجودة بالفعل في `/api/inquiries`

### ✓ اختبر:

1. اذهب إلى صفحة الاتصال في الموقع
2. املأ النموذج وأرسله
3. اذهب إلى اللوحة الإدارية → **📨 الاستفسارات**
4. ستجد الرسالة هناك! ✅

---

## 📞 التواصل والدعم

إذا واجهت مشكلة:
1. تحقق من console (F12) للأخطاء
2. تأكد من أن لوحة التحكم تعمل
3. تحقق من CORS headers

---

## 📄 الملفات المرتبطة

- **`/js/admin-integration.js`** - ملف التكامل الرئيسي
- **`goldmil-admin/README.md`** - دليل لوحة التحكم
- **`goldmil-admin/app/api/inquiries/route.ts`** - API النماذج

---

**صنع بـ ❤️ للميل الذهبي** | v1.0.0
