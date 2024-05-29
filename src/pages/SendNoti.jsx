import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import toast, { Toaster } from "react-hot-toast";
import { messaging } from "../firebase-config";
import { getToken } from "firebase/messaging";

const SendNoti = () => {
  const [loading, setLoading] = useState(false);
  const [iosLoading, setIosLoading] = useState(false);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // const isIOS = () => {
  //   const userAgent = window.navigator.userAgent;
  //   const iOS = /iPad|iPhone|iPod/.test(userAgent);
  //   const iOSVersion =
  //     parseFloat(
  //       (
  //         "" +
  //         (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(
  //           userAgent
  //         ) || [0, ""])[1]
  //       )
  //         .replace("undefined", "3_2")
  //         .replace("_", ".")
  //         .replace("_", "")
  //     ) || false;

  //   return iOS && iOSVersion >= 16.4;
  // };

  const handleSendNotification = async () => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        try {
          const registration = await navigator.serviceWorker.ready;
          console.log(registration);
          if (!registration.pushManager) {
            throw new Error("PushManager not supported in this browser");
          }
          setLoading(true);

          // Check if a subscription already exists
          let subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            console.log("Existing subscription found:", subscription);
            // Check if the existing subscription has a different applicationServerKey
            const existingKey = new Uint8Array(
              subscription.options.applicationServerKey
            );
            const newKey = urlBase64ToUint8Array(
              process.env.REACT_APP_VAPID_PUBLIC_KEY
            );
            if (
              existingKey &&
              existingKey.length === newKey.length &&
              existingKey.some((v, i) => v !== newKey[i])
            ) {
              console.log("Unsubscribing from existing subscription...");
              await subscription.unsubscribe();
              subscription = null;
            }
          }

          if (!subscription) {
            // Subscribe with the new applicationServerKey
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(
                process.env.REACT_APP_VAPID_PUBLIC_KEY
              ),
            });
          }

          await fetch(`${process.env.REACT_APP_URL}/subscribe`, {
            method: "POST",
            body: JSON.stringify({
              subscriptionData: subscription,
              message: {
                title: "Hi! You Called Me",
                body: "Do You Want Any Help?",
              },
            }),
            headers: {
              "content-type": "application/json",
            },
          });

          toast.success("Notification sent successfully!");
        } catch (error) {
          console.error(
            "Error registering service worker or subscribing to push:",
            error
          );
          if (!navigator.onLine) {
            toast.error("Internet Not Available");
            return;
          }
          toast.error("Something went wrong");
        } finally {
          setLoading(false);
        }
      } else if (result === "denied") {
        toast.error("Cannot Send Notification");
      }
    } else {
      toast.error("Notifications not supported in this browser.");
    }
  };

  const iosHandleSendNotification = async () => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        try {
          setIosLoading(true);

          // Wait for the service worker to be ready
          const registration = await navigator.serviceWorker.ready;
          console.log(registration);
          const currentToken = await getToken(messaging, {
            vapidKey: process.env.REACT_APP_FIREBASE_KEY,
            serviceWorkerRegistration: registration,
          });

          if (currentToken) {
            console.log("Device token:", currentToken);
            // Send the token to your server
            await fetch(`${process.env.REACT_APP_URL}/send-notification`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: "Hi!! You Called Me from IOS",
                body: "Do You Want Any Help?",
                token: currentToken,
              }),
            });
            toast.success("Notification sent successfully!");
          } else {
            console.log(
              "No registration token available. Request permission to generate one."
            );
          }
        } catch (error) {
          console.error("Error during notification setup:", error);
          toast.error("Something went wrong");
        } finally {
          setIosLoading(false);
        }
      } else {
        toast.error("Notification permission denied");
      }
    } else {
      toast.error("Notifications not supported in this browser");
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <Button
        variant="primary"
        onClick={iosHandleSendNotification}
        disabled={iosLoading}
      >
        {iosLoading ? "IOS Sending Notification..." : "IOS Send Notification"}
      </Button>
      <Button
        className="ms-3"
        variant="primary"
        onClick={handleSendNotification}
        disabled={loading}
      >
        {loading ? "Sending Notification..." : "Send Notification"}
      </Button>
      <Toaster />
    </div>
  );
};

export default SendNoti;
