/* eslint-disable no-restricted-globals */
/* eslint-env serviceworker */
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { BackgroundSyncPlugin, Queue } from "workbox-background-sync";
import { setCacheNameDetails } from "workbox-core";
import { clientsClaim } from "workbox-core";
import { createHandlerBoundToURL } from "workbox-precaching";
import { v4 as uuidv4 } from "uuid";

clientsClaim();
self.skipWaiting();

// Set custom cache names
setCacheNameDetails({
  prefix: "my-app",
  suffix: "v1",
  precache: "precache",
  runtime: "runtime-cache",
});

// Precache files
precacheAndRoute(self.__WB_MANIFEST || []);
cleanupOutdatedCaches();

// Handle navigation requests (for SPA routing)
const handler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);

// Runtime caching for API calls
registerRoute(
  new RegExp(process.env.REACT_APP_URL),
  new NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      new BackgroundSyncPlugin("api-queue", {
        maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
      }),
    ],
  })
);

// Runtime caching for images
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      {
        cacheWillUpdate: async ({ request, response }) => {
          if (response && response.type === "opaqueredirect") {
            return new Response(response.body, {
              status: 200,
              statusText: "OK",
              headers: response.headers,
            });
          }
          return response;
        },
      },
    ],
  })
);

self.addEventListener("push", (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      vibrate: [100, 50, 100],
      icon: "logo192.png",
      badge: "badge192.png",
      data: { primaryKey: 1 },
      actions: [
        { action: "go", title: "Go to Site", icon: "tick-icon.jpg" },
        { action: "close", title: "No Thank You", icon: "cancel-icon.jpg" },
      ],
    })
  );
});

let notificationSent = false;

self.addEventListener("fetch", (event) => {
  if (!navigator.onLine && notificationSent === false) {
    notificationSent = true;
    event.waitUntil(
      self.registration.showNotification("Oops! Something Wrong", {
        body: "Internet Is Not working",
        vibrate: [100, 50, 100],
        icon: "logo192.png",
        badge: "badge192.png",
        data: { primaryKey: 2 },
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

  //background sync
  let queue = "";
  if (!navigator.onLine) {
    // Add in your own criteria here to return early if this
    // isn't a request that should use background sync.
    if (event.request.method !== "POST") {
      return;
    }
    if (!event.request.url.includes("/create-policy")) {
      return;
    }
    queue = new Queue(`backApiSync-${uuidv4()}`);
  }
  const bgSyncLogic = async () => {
    try {
      const response = await fetch(event.request.clone());
      return response;
    } catch (error) {
      await queue.pushRequest({ request: event.request });
      return error;
    }
  };
  event.respondWith(bgSyncLogic());
});

// const bgSyncPlugin = new BackgroundSyncPlugin('myQueueName', {
//   maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
// });

// registerRoute(
//   /\/api\/.*\/*.json/,
//   new NetworkOnly({
//     plugins: [bgSyncPlugin],
//   }),
//   'POST'
// );

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});

// // Background sync
// self.addEventListener("sync", (event) => {
//   if (event.tag === "sync-tag") {
//     event.waitUntil(syncFunction());
//   }
// });

// async function syncFunction() {
//   // Your background sync logic here
// }
