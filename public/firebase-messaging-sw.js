importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);
firebase.initializeApp({
  apiKey: 'AIzaSyCTObgaMgnLGOi2sNJ6ijPFIpQo9hMBS1Q',
  authDomain: "pwa-poc-3055a.firebaseapp.com",
  projectId: "pwa-poc-3055a",
  storageBucket: "pwa-poc-3055a.appspot.com",
  messagingSenderId: '829575784826',
  appId: '1:829575784826:web:ee2d68e4ef12aa01ad8ec3',
});
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
