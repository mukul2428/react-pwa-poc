import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import toast, { Toaster } from "react-hot-toast";

const SendNoti = () => {
  const [loading, setLoading] = useState(false);

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

  const isIOS = () => {
    const userAgent = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(userAgent);
    const iOSVersion =
      parseFloat(
        (
          "" +
          (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(
            userAgent
          ) || [0, ""])[1]
        )
          .replace("undefined", "3_2")
          .replace("_", ".")
          .replace("_", "")
      ) || false;

    return iOS && iOSVersion >= 16.4;
  };

  const handleSendNotification = async () => {
    if (isIOS() || ("Notification" in window && "serviceWorker" in navigator)) {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        if (!("serviceWorker" in navigator)) {
          toast("Service workers are not supported in this browser.");
          return;
        }

        if (!("PushManager" in window)) {
          toast("Push notifications are not supported on this device.");
          return;
        }

        setLoading(true);
        try {
          const registration = await navigator.serviceWorker.ready;
          if (!registration.pushManager) {
            throw new Error("PushManager not supported in this browser");
          }

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
              process.env.REACT_APP_VAPID_PUBLIC_KEY
            ),
          });
          console.log("Push Registered...");

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
          console.log("Notification sent successfully.");
        } catch (error) {
          console.error(
            "Error registering service worker or subscribing to push:",
            error
          );
          if (!navigator.onLine) {
            toast("Internet Not Available");
            return;
          }
          toast("Something went wrong");
        } finally {
          setLoading(false);
        }
      } else if (result === "denied") {
        toast("Cannot Send Notification");
      }
    } else {
      toast("Notifications not supported in this browser.");
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <Button
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
