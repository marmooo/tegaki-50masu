const CACHE_NAME="2024-06-16 09:37",urlsToCache=["/tegaki-50masu/","/tegaki-50masu/index.js","/tegaki-50masu/worker.js","/tegaki-50masu/model/model.json","/tegaki-50masu/model/group1-shard1of1.bin","/tegaki-50masu/mp3/end.mp3","/tegaki-50masu/mp3/correct3.mp3","/tegaki-50masu/favicon/favicon.svg","https://marmooo.github.io/fonts/textar-light.woff2","https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})