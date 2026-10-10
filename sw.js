/* ───────────────────────────────────────────────────────────
   Black MOON Portal — Service Worker

   ★ নতুন আপডেট দিলে শুধু নিচের VERSION বদলান (যেমন '2026.10.10-2')।
     ব্যবহারকারী পরের বার অ্যাপ খুললে (বা অ্যাপ খোলা থাকলে কিছুক্ষণের মধ্যে)
     "নতুন আপডেট এসেছে" নোটিফিকেশন ও আপডেট বাটন পাবে।
   ─────────────────────────────────────────────────────────── */
const VERSION    = '2026.10.10-2';
const CACHE_NAME = 'black-moon-' + VERSION;
const ICON = 'data:image/png;base64,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';
const ASSETS = [
    './index.html',
    './manifest.json'
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
                    icon: ICON,
                    badge: ICON,
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
        icon:    data.icon  || ICON,
        badge:   data.badge || ICON,
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
