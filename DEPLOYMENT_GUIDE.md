
# 🚀 دليل رفع الموقع على السيرفر وGitHub

## 📤 رفع الملفات على GitHub Pages (مجاني)

### الخطوة 1: إنشاء حساب GitHub
1. اذهب إلى https://github.com
2. سجل حساب جديد (مجاني)

### الخطوة 2: إنشاء مستودع Repository
1. اضغط على الزر الأخضر "New"
2. اسم المستودع: `golden-mile-website`
3. اجعله Public (عام)
4. ✅ اضف علامة "Add a README file"
5. اضغط "Create repository"

### الخطوة 3: رفع الملفات
1. افتح المستودع
2. اضغط على "Add file" → "Upload files"
3. اسحب وأفلت هذه الملفات:
   - index.html
   - README.md
   - .gitignore
   - CNAME
4. اضغط "Commit changes"

### الخطوة 4: تفعيل GitHub Pages
1. اذهب إلى Settings (الإعدادات)
2. انزل لأسفل إلى "Pages"
3. في "Source" اختر "Deploy from a branch"
4. اختر الفرع "main" والمجلد "/ (root)"
5. اضغط "Save"
6. انتظر 2-5 دقائق
7. ستحصل على رابط: `https://username.github.io/golden-mile-website`

---

## 🖥️ رفع الموقع على استضافة مدفوعة (cPanel)

### الطريقة 1: File Manager
1. سجل دخول إلى cPanel
2. افتح "File Manager"
3. اذهب إلى `public_html`
4. اضغط "Upload"
5. ارفع ملف `index.html`
6. الموقع جاهز!

### الطريقة 2: FTP
استخدم برنامج FileZilla:
- **Host:** your-domain.com
- **Username:** username
- **Password:** password
- **Port:** 21

ارفع `index.html` إلى مجلد `public_html`

---

## 🌐 ربط دومين مخصص

### في GitHub Pages:
1. أنشئ ملف `CNAME` يحتوي على:
   ```
   goldenmile.sa
   www.goldenmile.sa
   ```
2. اذهب إلى إعدادات DNS في شركة الدومين
3. أضف سجل A يشير إلى:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153
4. انتظر 24-48 ساعة للتفعيل

---

## ✅ قائمة التحقق قبل النشر

- [ ] اللوجو يظهر بشكل صحيح
- [ ] جميع الأقسام تعمل
- [ ] روابط التواصل صحيحة
- [ ] معرض الأعمال يعمل
- [ ] لوحة الإدارة تظهر بالضغط على زر "الإدارة"
- [ ] الموقع يعمل على الجوال
- [ ] معلومات VAT و CR صحيحة

---

## 🆘 الدعم الفني

للمساعدة، تواصل معنا:
- 📧 info@goldenmile.sa
- 📱 +966 50 XXX XXXX

