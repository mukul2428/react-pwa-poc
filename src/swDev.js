/* eslint-disable no-restricted-globals */
// import { Workbox } from "workbox-window";

export default async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration)
          return registration = await navigator.serviceWorker.register('/service-worker.js');
  }
}
