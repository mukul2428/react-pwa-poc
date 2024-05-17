const cacheData = "appV1";
const cacheName = [
  "/static/js/main.chunk.js",
  "/static/js/0.chunk.js",
  "/static/js/bundle.js",
  "/static/css/main.chunk.css",
  "/bootstrap.min.css",
  "/index.html",
  "/",
  "/generatedPolicies",
];

this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheData).then((cache) => {
      cache.addAll(cacheName);
    })
  );
});

this.addEventListener("push", (e) => {
  const data = e.data.json();
  console.log(data);
  this.registration.showNotification(data.title, {
    body: data.body,
    vibrate: [100, 50, 100],
    data: { primaryKey: 1 },
    actions: [
      { action: "go", title: "Go to Site", icon: "tick-icon.jpg" },
      { action: "close", title: "No Thank You", icon: "cancel-icon.jpg" },
    ],
  });
});

let notificationSent = false;
this.addEventListener("fetch", (event) => {
  if (!navigator.onLine && notificationSent === false) {
    notificationSent = true;
    event.waitUntil(
      this.registration.showNotification("Oops! Something Wrong", {
        body: "Internet Is Not working",
        vibrate: [100, 50, 100],
        data: { primaryKey: 1 },
        actions: [
          { action: "go", title: "Go to Site", icon: "tick-icon.jpg" },
          { action: "close", title: "No Thank You", icon: "cancel-icon.jpg" },
        ],
      })
    );
  }
  if (navigator.onLine) {
    notificationSent = false;
  }
  event.respondWith(
    (async () => {
      const r = await caches.match(event.request);
      console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
      console.log(r);
      if (r) {
        return r;
      }
      const response = await fetch(event.request);
      const cache = await caches.open(cacheData);
      console.log(
        `[Service Worker] Caching new resource: ${event.request.url}`
      );
      cache.put(event.request, response.clone());
      return response;
    })()
  );
});
