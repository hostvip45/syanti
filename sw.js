const CACHE_NAME = 'siyanti-v2-cache-v1';

// تخزين الروابط الخارجية لضمان عمل الواجهة حتى لو ضعف الإنترنت
const ASSETS_TO_CACHE = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// التثبيت
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // استخدام cache.addAll لضمان تخزين المكتبات الأساسية
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.log("تحذير: فشل تخزين بعض الملفات في الكاش ولكن سيستمر العمل"));
    })
  );
  self.skipWaiting(); // تفعيل السيرفس وركر فوراً
});

// التفعيل وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim(); // السيطرة على الصفحة فوراً
});

// استراتيجية (Network First)
self.addEventListener('fetch', (event) => {
  // لا نقوم بتخزين طلبات Google Script لأنها متغيرة وتعتمد على السيرفر
  if (event.request.url.includes('google.com')) {
    return; 
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
