const CACHE_NAME = "2025-07-15 00:00";
const urlsToCache = [
  "/tegaki-50masu/",
  "/tegaki-50masu/index.js",
  "/tegaki-50masu/worker.js",
  "/tegaki-50masu/model/model.json",
  "/tegaki-50masu/model/group1-shard1of1.bin",
  "/tegaki-50masu/mp3/end.mp3",
  "/tegaki-50masu/mp3/correct3.mp3",
  "/tegaki-50masu/favicon/favicon.svg",
  "https://marmooo.github.io/fonts/textar-light.woff2",
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
