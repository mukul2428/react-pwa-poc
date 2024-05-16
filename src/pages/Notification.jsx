import React from "react";
import Button from "react-bootstrap/Button";
import swDev from "../swDev";

const Notification = () => {
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      // eslint-disable-next-line no-useless-escape
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleSendNotification = async () => {
    try {
      const registration = await swDev();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BFWCMiao-muL2to_SGKzfNoUDRI0cZYNwD9kP1yn3j1rwRG5u-qtrP0OSb6NXCEkbmk8NNY0V5cglYeg8P1f3jo'
        ),
      });
      console.log("Push Registered...");

      // Send Push Notification
      await fetch("https://pwa-poc-backend.vercel.app/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json",
        },
      });
    } catch (error) {
      console.error(
        "Error registering service worker or subscribing to push:",
        error
      );
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <Button variant="primary" onClick={handleSendNotification}>
        Send Notification
      </Button>
    </div>
  );
};

export default Notification;
