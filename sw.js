/* 합격노트 설치형: 앱 파일을 기기에 담아 두어 인터넷이 없어도 열리게 해요. 온라인이면 항상 새 판을 먼저 받아요. */
const V='hapnote-20261124-1928', FONT='hapnote-fonts';
const CORE=["./", "index.html", "manifest.webmanifest", "version.json", "data/arch.json", "data/archp.json", "data/astudy.json", "data/banks.json", "data/comp.json", "data/cstudy.json", "data/history.json", "data/khist.json", "data/ncs.json", "data/nstudy.json", "data/rc.json", "data/toeic.json", "data/xlab.json", "data/xlab.xlsx", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('hapnote-')&&k!==V&&k!==FONT).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
const net=(req,ms)=>new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('timeout')),ms); fetch(req).then(r=>{clearTimeout(t);res(r)},e=>{clearTimeout(t);rej(e)})});
self.addEventListener('fetch',e=>{
 const req=e.request; if(req.method!=='GET') return;
 let u; try{u=new URL(req.url)}catch(err){return}
 if(u.origin===self.location.origin){
  e.respondWith((async()=>{
   const cache=await caches.open(V);
   try{const r=await net(req,4000); if(r&&r.ok&&r.type==='basic'&&!u.search) cache.put(req,r.clone()); return r}
   catch(err){const m=await cache.match(req,{ignoreSearch:true})||(req.mode==='navigate'?await cache.match('index.html'):null); if(m) return m; return fetch(req)}
  })());
 }else if(/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
  e.respondWith((async()=>{const cache=await caches.open(FONT), m=await cache.match(req); const f=fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque')) cache.put(req,r.clone()); return r}).catch(()=>null); return m||(await f)||Response.error()})());
 }
});
