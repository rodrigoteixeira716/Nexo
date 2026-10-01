const CACHE='nexo-pwa-v0.7.2';
const ROOT='/Nexo/';
const CORE=[
  ROOT,
  ROOT+'index.html',
  ROOT+'manifest.webmanifest',
  ROOT+'icons/icon-180.png',
  ROOT+'icons/icon-192.png',
  ROOT+'icons/icon-512.png'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(fetch(event.request).then(response=>{
    const copy=response.clone();
    caches.open(CACHE).then(c=>c.put(event.request,copy));
    return response;
  }).catch(()=>caches.match(event.request).then(r=>r||caches.match(ROOT+'index.html'))));
});
