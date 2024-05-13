const cacheData = "appV1";
const cacheName = [
  "/static/js/main.chunk.js",
  "/static/js/0.chunk.js",
  "/static/js/bundle.js",
  "/static/css/main.chunk.css",
  "/bootstrap.min.css",
  "/index.html",
  "/",
  "/pokemon",
];
this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheData).then((cache) => {
      cache.addAll(cacheName);
    })
  );
});
let notificationSent = false;
this.addEventListener("fetch", (event) => {
  if (!navigator.onLine && notificationSent === false) {
    notificationSent = true;
    event.waitUntil(
      this.registration.showNotification("Internet", {
        body: "internet not working",
      })
    );
  }
  if (navigator.onLine) {
    notificationSent = false;
  }
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If the fetch was successful, clone the response and cache it
        const responseClone = response.clone();
        caches.open(cacheData).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // If the fetch fails (due to being offline), try to serve the response from cache
        return caches.match(event.request).then((response) => {
          // If response is found in cache, return it
          if (response) {
            return response;
          } else {
            // If response is not found in cache, return a fallback response
            return new Response("Offline", {
              status: 503,
              statusText: "Service Unavailable",
            });
          }
        });
      })
  );
});
