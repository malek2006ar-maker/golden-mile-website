# 🚀 دليل النشر الكامل على Hostinger

> لوحة تحكم الميل الذهبي — نشر على `/var/www/html/admin` مع Apache

---

## 📋 المتطلبات الأساسية

| المتطلب | الإصدار |
|--------|---------|
| Node.js | 18.17+ أو 20.x |
| npm | 9+ |
| مساحة القرص | 500MB على الأقل |
| RAM | 1GB على الأقل |

---

## 🔧 الخطوة 1: تجهيز السيرفر

```bash
# اتصل بالسيرفر عبر SSH
ssh root@your-server-ip

# تحقق من Node.js
node -v

# لو مو موجود، ثبّته (Hostinger عادة يأتي مع Node)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# ثبّت PM2
sudo npm install -g pm2
```

---

## 📂 الخطوة 2: رفع الملفات

```bash
# من جهازك المحلي:
scp -r goldmil-admin.zip root@YOUR-SERVER:/tmp/

# على السيرفر:
ssh root@YOUR-SERVER
cd /tmp
unzip goldmil-admin.zip
sudo mkdir -p /var/www/html/admin
sudo cp -r goldmil-admin/* /var/www/html/admin/
sudo cp -r goldmil-admin/.next /var/www/html/admin/ 2>/dev/null || true
sudo chown -R www-data:www-data /var/www/html/admin
sudo chmod -R 755 /var/www/html/admin
```

---

## 🗄️ الخطوة 3: إعداد قاعدة البيانات

```bash
cd /var/www/html/admin

# 1. انسخ ملف البيئة وعدّله
cp .env.example .env
nano .env
```

**مثال على `.env` للإنتاج:**
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://goldmil.matrxe.com
DATABASE_URL="file:/var/www/html/admin/prisma/production.db"

# ⚠️ غيّر هذا إلى قيمة عشوائية طويلة جداً (32+ حرف)
JWT_SECRET="$(openssl rand -hex 32)"
JWT_EXPIRES_IN="7d"

ADMIN_EMAIL="admin@goldenmile.com.sa"
ADMIN_PASSWORD="كلمة-مرور-قوية-جديدة"
ADMIN_NAME="أحمد العتيبي"

PUBLIC_SITE_URL="https://goldmil.matrxe.com"
```

```bash
# 2. ثبّت الاعتماديات
npm install --production

# 3. أنشئ قاعدة البيانات
npx prisma db push

# 4. عبّ البيانات التجريبية (اختياري)
npm run db:seed

# 5. ابنِ المشروع
npm run build
```

---

## 🌐 الخطوة 4: إعداد Apache

### أ) فعّل الـ modules المطلوبة:

```bash
sudo a2enmod proxy proxy_http proxy_wstunnel rewrite ssl headers deflate expires
sudo systemctl restart apache2
```

### ب) أنشئ Virtual Host للوحة الإدارة:

```bash
sudo nano /etc/apache2/sites-available/admin-goldmil.conf
```

**المحتوى:**
```apache
# ===== HTTP → HTTPS Redirect =====
<VirtualHost *:80>
    ServerName admin.goldmil.matrxe.com
    ServerAdmin info@goldenmile.com.sa
    
    RewriteEngine On
    RewriteRule ^(.*)$ https://%{HTTP_HOST}$1 [R=301,L]
</VirtualHost>

# ===== HTTPS =====
<VirtualHost *:443>
    ServerName admin.goldmil.matrxe.com
    ServerAdmin info@goldenmile.com.sa
    
    # SSL Configuration (Let's Encrypt)
    SSLEngine on
    SSLCertificateFile      /etc/letsencrypt/live/admin.goldmil.matrxe.com/fullchain.pem
    SSLCertificateKey       /etc/letsencrypt/live/admin.goldmil.matrxe.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/admin.goldmil.matrxe.com/chain.pem
    
    # Security Headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
    
    # Gzip Compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain
        AddOutputFilterByType DEFLATE text/html
        AddOutputFilterByType DEFLATE text/xml
        AddOutputFilterByType DEFLATE text/css
        AddOutputFilterByType DEFLATE application/javascript
        AddOutputFilterByType DEFLATE application/json
    </IfModule>
    
    # Cache static assets
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/jpg "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/svg+xml "access plus 1 year"
        ExpiresByType text/css "access plus 1 month"
        ExpiresByType application/javascript "access plus 1 month"
    </IfModule>
    
    # Proxy to Next.js
    ProxyPreserveHost On
    ProxyPass /_next/static http://127.0.0.1:3001/_next/static
    ProxyPassReverse /_next/static http://127.0.0.1:3001/_next/static
    ProxyPass / http://127.0.0.1:3001/
    ProxyPassReverse / http://127.0.0.1:3001/
    
    ErrorLog ${APACHE_LOG_DIR}/admin-goldmil-error.log
    CustomLog ${APACHE_LOG_DIR}/admin-goldmil-access.log combined
</VirtualHost>
```

```bash
# فعّل الموقع
sudo a2ensite admin-goldmil.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### ج) شهادة SSL مجانية:

```bash
sudo apt install -y certbot python3-certbot-apache
sudo certbot --apache -d admin.goldmil.matrxe.com
# يجدد تلقائياً
```

### د) DNS Record:

في Hostinger DNS Panel:
| النوع | الاسم | القيمة |
|------|------|--------|
| A | `admin` | `IP-السيرفر-بتاعك` |

---

## 🚀 الخطوة 5: تشغيل اللوحة بـ PM2

### أ) أنشئ ملف PM2:

```bash
cd /var/www/html/admin
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'goldmil-admin',
    cwd: '/var/www/html/admin',
    script: 'npm',
    args: 'start',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
    },
    error_file: '/var/log/goldmil-admin-error.log',
    out_file: '/var/log/goldmil-admin-out.log',
    time: true,
  }],
};
```

### ب) شغّل:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# اتبع التعليمات التي تظهر (تسمح لـ PM2 بالبدء تلقائياً مع السيرفر)
```

---

## ⏰ الخطوة 6: النسخ الاحتياطي التلقائي (Cron)

```bash
# افتح crontab
crontab -e

# أضف هذه السطور:
# نسخ احتياطي يومي الساعة 3 صباحاً
0 3 * * * cd /var/www/html/admin && /usr/bin/npm run db:backup >> /var/log/goldmil-backup.log 2>&1

# تجديد SSL تلقائياً
0 4 1 * * certbot renew --quiet
```

---

## ✅ الخطوة 7: التحقق من العمل

```bash
# حالة PM2
pm2 status

# السجلات
pm2 logs goldmil-admin --lines 50

# اختبار HTTP
curl -I https://admin.goldmil.matrxe.com

# اختبار API
curl -X POST https://admin.goldmil.matrxe.com/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"اختبار","email":"test@test.com","phone":"+966500000000","message":"اختبار"}'
```

---

## 🔗 الخطوة 8: ربط نموذج الاتصال من الموقع الرئيسي

### في `goldmil.matrxe.com`، حدّث نموذج الاتصال ليُرسل للوحة:

**افتح ملف نموذج الاتصال في مشروع الموقع الرئيسي** (مثلاً `app/contact/page.tsx`) واستبدل الـ handler بهذا:

```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

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
    toast.success("تم استلام رسالتك، سنتواصل معك قريباً");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  } else {
    toast.error(data.message || "حدث خطأ");
  }
  setLoading(false);
}
```

### أو ضع زر دخول للوحة من الهيدر:

```tsx
// في components/Header.tsx أو أي مكون navigation
<a
  href="https://admin.goldmil.matrxe.com"
  target="_blank"
  rel="noopener noreferrer"
  className="btn-outline-gold text-xs py-2 px-4"
>
  <Shield className="w-3.5 h-3.5 inline-block ml-1" />
  لوحة التحكم
</a>
```

---

## 🛠️ أوامر الإدارة اليومية

```bash
# إعادة تشغيل اللوحة
pm2 restart goldmil-admin

# إيقاف
pm2 stop goldmil-admin

# حذف
pm2 delete goldmil-admin

# عرض السجلات الحية
pm2 logs goldmil-admin

# معلومات النظام
pm2 monit

# تحديث الكود
cd /var/www/html/admin
git pull  # لو تستخدم git
npm install --production
npm run build
pm2 restart goldmil-admin

# نسخ احتياطي يدوي
npm run db:backup

# عرض قاعدة البيانات
npm run db:studio
# يفتح على http://localhost:5555

# إعادة تعيين قاعدة البيانات (⚠️ يحذف كل البيانات!)
npm run db:reset
npm run db:seed
```

---

## 🐛 حل المشاكل الشائعة

### ❌ 502 Bad Gateway

```bash
# تأكد إن Next.js شغّال
pm2 status
pm2 logs goldmil-admin

# لو متوقف، شغّله
pm2 restart goldmil-admin
```

### ❌ 500 Internal Server Error

```bash
# راجع السجلات
pm2 logs goldmil-admin --err --lines 100

# أو سجلات Apache
sudo tail -f /var/log/apache2/admin-goldmil-error.log
```

### ❌ خطأ في قاعدة البيانات

```bash
# تحقق من ملف قاعدة البيانات
ls -la /var/www/html/admin/prisma/

# أعد إنشاءها
cd /var/www/html/admin
npx prisma db push --force-reset
npm run db:seed
pm2 restart goldmil-admin
```

### ❌ SSL لا يعمل

```bash
# جدد الشهادة
sudo certbot renew --force-renewal

# تحقق من الإعدادات
sudo apache2ctl configtest
sudo systemctl reload apache2
```

### ❌ CORS عند إرسال النموذج من الموقع

تأكد إن `lib/cors.ts` يحتوي على `https://goldmil.matrxe.com` في `ALLOWED_ORIGINS`.

### ❌ نسيت كلمة مرور الأدمن

```bash
cd /var/www/html/admin
# شغّل سكربت تغيير كلمة المرور
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const db = new PrismaClient();
(async () => {
  const hash = await bcrypt.hash('كلمة-جديدة', 12);
  await db.user.update({
    where: { email: 'admin@goldenmile.com.sa' },
    data: { password: hash }
  });
  console.log('✅ تم التحديث');
  await db.\$disconnect();
})();
"
pm2 restart goldmil-admin
```

---

## 🔒 نصائح الأمان للإنتاج

1. **غيّر `JWT_SECRET`** إلى قيمة عشوائية قوية:
   ```bash
   openssl rand -hex 32
   ```

2. **غيّر كلمة مرور الأدمن الافتراضية** من داخل اللوحة بعد أول دخول.

3. **فعّل Firewall:**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

4. **احمِ ملف `.env`:**
   ```bash
   chmod 600 /var/www/html/admin/.env
   ```

5. **احمِ قاعدة البيانات:**
   ```bash
   chmod 700 /var/www/html/admin/prisma/
   ```

6. **فعّل Fail2Ban:**
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

7. **النسخ الاحتياطي على سيرفر خارجي** (مثلاً Backblaze B2 أو AWS S3).

---

## 📊 الملخص النهائي

| الخطوة | الوقت المتوقع |
|--------|--------------|
| رفع الملفات | 5 دقائق |
| تثبيت الاعتماديات | 3-5 دقائق |
| إعداد قاعدة البيانات | 2 دقيقة |
| إعداد Apache | 5 دقائق |
| SSL | 2 دقيقة |
| تشغيل PM2 | 1 دقيقة |
| **الإجمالي** | **~20 دقيقة** |

بعدها، اللوحة شغّالة على: **`https://admin.goldmil.matrxe.com`** 🚀

---

**بيانات الدخول الافتراضية:**
- البريد: `admin@goldenmile.com.sa`
- كلمة المرور: حسب `.env` (غيّرها فوراً)

---

**للمساعدة:** `info@goldenmile.com.sa` | +966 53 256 1599