const C='dsb-v1';
const CDN=['cdn.tailwindcss.com','cdnjs.cloudflare.com','cdn.jsdelivr.net','www.gstatic.com'];
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
async function put(r,res){if(res&&(res.ok||res.type==='opaque')){const c=await caches.open(C);c.put(r,res.clone())}return res}
async function cacheFirst(r){const m=await caches.match(r);if(m)return m;try{return await put(r,await fetch(r))}catch(x){return new Response('',{status:504})}}
async function netFirst(r){try{const res=await Promise.race([fetch(r),new Promise((_,j)=>setTimeout(j,4000))]);return await put(r,res)}catch(x){const m=await caches.match(r,{ignoreSearch:true});return m||new Response('Offline',{status:504})}}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin)e.respondWith(netFirst(r));
 else if(CDN.includes(u.hostname))e.respondWith(cacheFirst(r))});
