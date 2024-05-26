/* eslint-disable no-restricted-globals */
import { Workbox } from "workbox-window";

export default function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const wb = new Workbox("/service-worker.js");

    wb.addEventListener("installed", async (event) => {
      if (event.isUpdate) {
        if (confirm("New app update is available! Click OK to refresh.")) {
          // Unregister all service workers
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          for (let registration of registrations) {
            registration.unregister();
          }

          // Clear all caches
          if (window.caches) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((cache) => caches.delete(cache)));
          }

          // Clear all IndexedDB databases
          const databases = await indexedDB.databases();
          for (let dbInfo of databases) {
            indexedDB.deleteDatabase(dbInfo.name);
          }

          // Reload the page to apply the new service worker and updates
          window.location.reload();
        }
      }
    });

    wb.register()
      .then((registration) => {
        console.log("Service worker registered:", registration);
        return registration;
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  } else {
    console.warn("Service workers are not supported in this browser.");
  }
}
