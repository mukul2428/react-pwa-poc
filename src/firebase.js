// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";
// const firebaseConfig = {
//   apiKey: 'AIzaSyCTObgaMgnLGOi2sNJ6ijPFIpQo9hMBS1Q',
//   authDomain: "pwa-poc-3055a.firebaseapp.com",
//   projectId: "pwa-poc-3055a",
//   storageBucket: "pwa-poc-3055a.appspot.com",
//   messagingSenderId: '829575784826',
//   appId: '1:829575784826:web:ee2d68e4ef12aa01ad8ec3',
// };
// const app = initializeApp(firebaseConfig);
// export const messaging = getMessaging(app);

// export const generateToken = async () => {
//   const permission = await Notification.requestPermission();
//   console.log(permission);
//   if (permission === "granted") {
//     const token = await getToken(messaging, {
//       vapidKey: process.env.REACT_APP_VAPID_KEY,
//     });
//     console.log(token);
//   }
// };
