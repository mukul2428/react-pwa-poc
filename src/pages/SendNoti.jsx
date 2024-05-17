import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import swDev from "../swDev";

const SendNoti = () => {
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const registration = await swDev();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.REACT_APP_VAPID_PRIVATE_KEY
        ),
      });
      console.log("Push Registered...");

      // Send Push Notification
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
      setLoading(false);
    } catch (error) {
      console.error(
        "Error registering service worker or subscribing to push:",
        error
      );
    } finally {
      setLoading(false);
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
    </div>
  );
};

export default SendNoti;
