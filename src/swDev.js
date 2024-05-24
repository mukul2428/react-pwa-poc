/* eslint-disable no-restricted-globals */
import { Workbox } from "workbox-window";

export default function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    const wb = new Workbox("/service-worker.js");

    wb.addEventListener("installed", (event) => {
      if (event.isUpdate) {
        if (confirm(`New app update is available!. Click OK to refresh`)) {
          window.location.reload();
        }
      }
    });

    wb.addEventListener("activated", (event) => {
      console.log("Service worker activated:", event);
    });

    wb.addEventListener("waiting", (event) => {
      console.log("Service worker waiting:", event);
    });

    wb.addEventListener("controlling", (event) => {
      console.log("Service worker controlling:", event);
    });

    wb.addEventListener("redundant", (event) => {
      console.error("Service worker redundant:", event);
    });

    return wb
      .register()
      .then((registration) => {
        console.log("Service worker registered:", registration);
        return registration;
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  } else {
    console.warn("Service workers are not supported in this browser.");
    return Promise.resolve(undefined);
  }
}
