const PREFIX='stock-garden-secret-door-';
const CACHE=PREFIX+'v1';
const APP_ROOT=new URL('./',self.registration.scope).href;
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(name=>name.startsWith(PREFIX)&&name!==CACHE).map(name=>caches.delete(name)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const req=event.request;const url=new URL(req.url);if(req.method!=='GET'||url.origin!==self.location.origin||!req.url.startsWith(APP_ROOT))return;event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{if(response.ok){const clone=response.clone();caches.open(CACHE).then(cache=>cache.put(req,clone));}return response;})));});