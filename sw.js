const CACHE_NAME = 'siyanti-pro-v2-cache';

// الملفات الأساسية فقط لضمان عمل الواجهة
const ASSETS_TO_CACHE = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// مرحلة التثبيت: تخزين المكتبات الخارجية
self.addEventListener('install', (event) => {
  self.skipWaiting(); // تفعيل الوركر فوراً دون انتظار إغلاق التبويبات القديمة
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        console.log("تنبيه: تعذر تخزين بعض الملفات مؤقتاً، سيتم جلبها من الإنترنت.");
      });
    })
  );
});

// مرحلة التفعيل: تنظيف أي كاش قديم للنسخ السابقة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim(); // السيطرة على الصفحة فوراً لتفعيل ميزات PWA
});

// معالجة الطلبات: استراتيجية "الإنترنت أولاً" لضمان تحديث البيانات
self.addEventListener('fetch', (event) => {
  // تجاوز طلبات جوجل سكريبت لضمان عدم حدوث تعليق في جلب البيانات
  if (event.request.url.includes('google.com') || event.request.url.includes('googleusercontent.com')) {
    return; 
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      // في حال انقطاع الإنترنت تماماً، ابحث عن الملف في الكاش
      return caches.match(event.request);
    })
  );
});
