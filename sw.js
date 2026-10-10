/* ───────────────────────────────────────────────────────────
   Black MOON Portal — Service Worker

   ★ নতুন আপডেট দিলে শুধু নিচের VERSION বদলান (যেমন '2026.10.10-2')।
     ব্যবহারকারী পরের বার অ্যাপ খুললে (বা অ্যাপ খোলা থাকলে কিছুক্ষণের মধ্যে)
     "নতুন আপডেট এসেছে" নোটিফিকেশন ও আপডেট বাটন পাবে।
   ─────────────────────────────────────────────────────────── */
const VERSION    = '2026.10.10-1';
const CACHE_NAME = 'black-moon-' + VERSION;
const ASSETS = [
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-512.png',
    './icons/apple-touch-icon.png',
    './icons/favicon-32.png',
    './icons/favicon-48.png',
    './icons/favicon.ico'
];

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#090a12">
<title>Offline — Black MOON Portal</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{min-height:100vh;background:radial-gradient(60% 40% at 50% 30%,#171a3a 0%,#090a12 70%);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;text-align:center;padding:28px}
  .moon{width:84px;height:84px;margin-bottom:26px}
  h1{color:#f2f3fb;font-size:22px;font-weight:650;margin-bottom:10px}
  p{color:rgba(242,243,251,.62);font-size:14px;line-height:1.75;margin-bottom:30px;max-width:300px}
  button{padding:14px 30px;border-radius:14px;background:#eef0ff;color:#090a12;font-size:15px;font-weight:700;border:none;cursor:pointer}
  button:active{transform:scale(.97)}
</style>
</head>
<body>
  <svg class="moon" viewBox="0 0 100 100" aria-hidden="true">
    <defs><radialGradient id="g"><stop offset=".55" stop-color="#8f9cff" stop-opacity=".55"/><stop offset="1" stop-color="#8f9cff" stop-opacity="0"/></radialGradient></defs>
    <circle cx="50" cy="50" r="48" fill="url(#g)"/>
    <circle cx="50" cy="50" r="31" fill="#eef0ff"/>
    <circle cx="53.2" cy="47.5" r="29.2" fill="#000"/>
  </svg>
  <h1>ইন্টারনেট নেই</h1>
  <p>নেটওয়ার্ক সংযোগ পাওয়া যাচ্ছে না। WiFi বা Mobile Data চালু করে আবার চেষ্টা করুন।</p>
  <button onclick="location.reload()">আবার চেষ্টা করুন</button>
</body>
</html>`;

/* ── INSTALL ── */
self.addEventListener('install', e => {
    const isUpdate = !!self.registration.active;   // আগে থেকে কোনো SW চালু থাকলে এটা আপডেট

    e.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.put('offline.html', new Response(OFFLINE_HTML, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }));
        // একটা ফাইল না পেলেও যেন বাকিগুলো cache হয়
        await Promise.all(ASSETS.map(url =>
            cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
        ));

        // আপডেট এলে সিস্টেম নোটিফিকেশন (permission দেওয়া থাকলে)
        if (isUpdate) {
            try {
                await self.registration.showNotification('নতুন আপডেট এসেছে 🌙', {
                    body: 'Black MOON Portal-এর নতুন সংস্করণ তৈরি। ট্যাপ করে আপডেট করুন।',
                    icon: 'icons/icon-192.png',
                    badge: 'icons/favicon-48.png',
                    tag: 'app-update',
                    renotify: true,
                    vibrate: [200, 100, 200],
                    data: { url: self.registration.scope, update: true }
                });
            } catch (_) { /* permission নেই — অ্যাপের ভেতরের ব্যানার দেখাবে */ }
        }
    })());
    // skipWaiting এখানে নেই: ব্যবহারকারী "আপডেট করুন" চাপলে page থেকে মেসেজ আসবে
});

/* ── ACTIVATE ── */
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

/* ── MESSAGES FROM PAGE ── */
self.addEventListener('message', e => {
    const msg = e.data || {};
    if (msg.type === 'SKIP_WAITING') self.skipWaiting();
    if (msg.type === 'GET_VERSION' && e.source) e.source.postMessage({ type: 'VERSION', version: VERSION });
});

/* ── FETCH ── */
self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;   // বাইরের রিসোর্স সরাসরি network-এ

    // HTML / পেজ: আগে network (সবসময় লেটেস্ট), না পেলে cache, তাও না পেলে offline পেজ
    if (req.mode === 'navigate' || req.destination === 'document') {
        e.respondWith((async () => {
            try {
                const fresh = await fetch(req);
                const copy = fresh.clone();
                caches.open(CACHE_NAME).then(c => c.put(req, copy));
                return fresh;
            } catch (_) {
                return (await caches.match(req, { ignoreSearch: true }))
                    || (await caches.match('./index.html'))
                    || (await caches.match('offline.html'));
            }
        })());
        return;
    }

    // বাকি ফাইল (আইকন, manifest): cache থেকে দেখাও, পেছনে নতুন করে আনো
    e.respondWith((async () => {
        const cached = await caches.match(req);
        const refresh = fetch(req).then(resp => {
            if (resp && resp.ok) {
                const copy = resp.clone();
                caches.open(CACHE_NAME).then(c => c.put(req, copy));
            }
            return resp;
        }).catch(() => null);
        return cached || (await refresh) || Response.error();
    })());
});

/* ── BACKGROUND UPDATE CHECK (Chrome/Android installed app) ── */
self.addEventListener('periodicsync', e => {
    if (e.tag === 'check-update') e.waitUntil(self.registration.update());
});

/* ── PUSH NOTIFICATIONS ── */
self.addEventListener('push', e => {
    let data = {};
    try { data = e.data ? e.data.json() : {}; } catch (_) {}
    e.waitUntil(self.registration.showNotification(data.title || 'Black MOON Portal', {
        body:    data.body  || 'নতুন আপডেট এসেছে!',
        icon:    data.icon  || 'icons/icon-192.png',
        badge:   data.badge || 'icons/favicon-48.png',
        vibrate: [200, 100, 200],
        data:    { url: data.url || self.registration.scope }
    }));
});

self.addEventListener('notificationclick', e => {
    e.notification.close();
    const target = (e.notification.data && e.notification.data.url) || self.registration.scope;
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
            for (const c of list) {
                if ('focus' in c) return c.focus();
            }
            if (clients.openWindow) return clients.openWindow(target);
        })
    );
});
