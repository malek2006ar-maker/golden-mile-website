/**
 * 🔌 Admin Dashboard Integration
 * ربط نموذج الاتصال بلوحة التحكم (goldmil-admin)
 * ============================================
 * 
 * هذا الملف يرسل بيانات النماذج من الموقع الرئيسي
 * إلى API لوحة التحكم (Inquiries API)
 */

const ADMIN_API_URL = "https://admin.goldmil.matrxe.com/api/inquiries";

/**
 * دالة إرسال الاستفسار إلى لوحة التحكم
 * @param {Object} inquiryData - بيانات الاستفسار
 */
async function sendInquiryToAdmin(inquiryData) {
  try {
    console.log("📤 إرسال الاستفسار إلى لوحة التحكم...", inquiryData);

    const response = await fetch(ADMIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        name: inquiryData.name || "بدون اسم",
        email: inquiryData.email || "",
        phone: inquiryData.phone || "",
        subject: inquiryData.subject || "استفسار عام",
        message: inquiryData.message || "",
        source: "website_contact_form",
        priority: inquiryData.priority || "medium",
        status: "new",
      }),
      credentials: "include", // إرسال cookies إن وجدت
    });

    const data = await response.json();

    if (data.success) {
      console.log("✅ تم استلام الرسالة بنجاح في لوحة التحكم!");
      return {
        success: true,
        message: "تم إرسال رسالتك بنجاح. سيتواصل معك الفريق قريباً.",
        data: data,
      };
    } else {
      console.warn("⚠️ خطأ من لوحة التحكم:", data.message);
      return {
        success: false,
        message: data.message || "حدث خطأ أثناء الإرسال",
        error: data.error,
      };
    }
  } catch (error) {
    console.error("❌ خطأ في الاتصال بلوحة التحكم:", error);
    return {
      success: false,
      message: "خطأ في الاتصال بالخادم. تحقق من الاتصال بالإنترنت.",
      error: error.message,
    };
  }
}

/**
 * ربط نموذج الاتصال بهذه الدالة
 * استخدم هذا في معالج الـ form submit
 * 
 * مثال:
 * const form = document.getElementById("contact-form");
 * form.addEventListener("submit", handleContactFormSubmit);
 */
async function handleContactFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const submitBtn = form.querySelector("button[type='submit']");
  const originalText = submitBtn?.textContent;

  try {
    // تعطيل الزر وتغيير النص
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "⏳ جاري الإرسال...";
    }

    // جمع البيانات من النموذج
    const formData = new FormData(form);
    const inquiryData = {
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      subject: formData.get("subject") || "",
      message: formData.get("message") || "",
      priority: formData.get("priority") || "medium",
    };

    // التحقق من البيانات المطلوبة
    if (!inquiryData.name.trim()) {
      throw new Error("⚠️ يرجى إدخال الاسم");
    }
    if (!inquiryData.email.trim() || !isValidEmail(inquiryData.email)) {
      throw new Error("⚠️ يرجى إدخال بريد إلكتروني صحيح");
    }
    if (!inquiryData.message.trim()) {
      throw new Error("⚠️ يرجى إدخال الرسالة");
    }

    // إرسال البيانات إلى لوحة التحكم
    const result = await sendInquiryToAdmin(inquiryData);

    if (result.success) {
      // نجاح ✅
      showNotification(result.message, "success");
      form.reset(); // مسح النموذج

      // يمكنك أيضاً عرض رسالة شكر
      console.log("✅ تم استقبال الرسالة بنجاح!");
    } else {
      // خطأ من الـ API
      showNotification(result.message || "حدث خطأ ما", "error");
    }
  } catch (error) {
    // خطأ في المعالجة
    showNotification(error.message || "حدث خطأ ما", "error");
    console.error("❌ خطأ:", error);
  } finally {
    // إعادة حالة الزر
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
}

/**
 * دالة مساعدة للتحقق من صحة البريد الإلكتروني
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * دالة مساعدة لعرض الإشعارات
 * عدّل هذا حسب نظام الإشعارات الموجود في الموقع
 */
function showNotification(message, type = "info") {
  // إذا كان لديك مكتبة مثل Toastr أو SweetAlert
  if (typeof toast !== "undefined") {
    toast[type](message);
  }
  // وإلا استخدم alert بسيط
  else if (type === "success") {
    alert("✅ " + message);
  } else if (type === "error") {
    alert("❌ " + message);
  } else {
    alert("ℹ️ " + message);
  }
}

/**
 * 🎯 استخدام في HTML
 * ============================================
 * 
 * <form id="contact-form">
 *   <input type="text" name="name" placeholder="الاسم" required>
 *   <input type="email" name="email" placeholder="البريد الإلكتروني" required>
 *   <input type="tel" name="phone" placeholder="الهاتف">
 *   <input type="text" name="subject" placeholder="الموضوع">
 *   <textarea name="message" placeholder="الرسالة" required></textarea>
 *   <select name="priority">
 *     <option value="low">منخفض</option>
 *     <option value="medium" selected>متوسط</option>
 *     <option value="high">عالي</option>
 *   </select>
 *   <button type="submit">إرسال</button>
 * </form>
 * 
 * <script src="/js/admin-integration.js"></script>
 * <script>
 *   const form = document.getElementById("contact-form");
 *   form.addEventListener("submit", handleContactFormSubmit);
 * </script>
 */

// تصدير الدوال للاستخدام
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    sendInquiryToAdmin,
    handleContactFormSubmit,
    isValidEmail,
    showNotification,
  };
}
