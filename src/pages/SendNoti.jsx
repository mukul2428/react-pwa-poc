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

  const handleSendNotification = async () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(async (result) => {
        if (result === "granted") {
          // Notifications allowed
          setLoading(true);
          try {
            const registration = await navigator.serviceWorker.ready;
            if (!registration) {
              throw new Error("Service worker not ready");
            }
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
          // Notifications blocked
          toast("Cannot Send Notification");
        }
      });
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
