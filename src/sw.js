var CACHE_NAME = "2023-07-04 00:00";
var urlsToCache = [
  "/tegaki-50masu/",
  "/tegaki-50masu/index.js",
  "/tegaki-50masu/worker.js",
  "/tegaki-50masu/model/model.json",
  "/tegaki-50masu/model/group1-shard1of1.bin",
  "/tegaki-50masu/mp3/end.mp3",
  "/tegaki-50masu/mp3/correct3.mp3",
  "/tegaki-50masu/favicon/favicon.svg",
  "https://marmooo.github.io/fonts/textar-light.woff2",
  "https://cdn.jsdelivr.net/npm/signature_pad@4.1.5/dist/signature_pad.umd.min.js",
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.6.0/dist/tf.min.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
