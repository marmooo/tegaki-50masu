const CACHE_NAME="2023-10-05 10:40",urlsToCache=["/tegaki-50masu/","/tegaki-50masu/index.js","/tegaki-50masu/worker.js","/tegaki-50masu/model/model.json","/tegaki-50masu/model/group1-shard1of1.bin","/tegaki-50masu/mp3/end.mp3","/tegaki-50masu/mp3/correct3.mp3","/tegaki-50masu/favicon/favicon.svg","https://marmooo.github.io/fonts/textar-light.woff2","https://cdn.jsdelivr.net/npm/signature_pad@4.1.6/dist/signature_pad.umd.min.js","https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.min.js"];self.addEventListener("install",a=>{a.waitUntil(caches.open(CACHE_NAME).then(a=>a.addAll(urlsToCache)))}),self.addEventListener("fetch",a=>{a.respondWith(caches.match(a.request).then(b=>b||fetch(a.request)))}),self.addEventListener("activate",a=>{a.waitUntil(caches.keys().then(a=>Promise.all(a.filter(a=>a!==CACHE_NAME).map(a=>caches.delete(a)))))})