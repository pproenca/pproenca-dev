"use client";

import { useState, useEffect, useCallback } from "react";

export function SubscribeButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator;

    setIsSupported(supported);

    if (!supported || !process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) return;

    const checkOneSignal = async () => {
      try {
        const OneSignal = (await import("react-onesignal")).default;

        // Poll until OneSignal is initialized
        const checkReady = setInterval(() => {
          try {
            const permission = OneSignal.Notifications.permission;
            clearInterval(checkReady);
            setIsReady(true);
            setIsSubscribed(permission);
          } catch {
            // Not ready yet
          }
        }, 500);

        // Cleanup after 10 seconds
        setTimeout(() => clearInterval(checkReady), 10000);
      } catch {
        // OneSignal not available
      }
    };

    checkOneSignal();
  }, []);

  const handleSubscribe = useCallback(async () => {
    try {
      const OneSignal = (await import("react-onesignal")).default;
      await OneSignal.Slidedown.promptPush();

      // Check subscription status after prompt
      const permission = OneSignal.Notifications.permission;
      setIsSubscribed(permission);
    } catch (error) {
      console.error("Subscribe error:", error);
    }
  }, []);

  if (!isSupported || !isReady) return null;

  return (
    <button
      onClick={handleSubscribe}
      className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
    >
      {isSubscribed ? (
        <>
          <BellIcon className="h-4 w-4" />
          Subscribed
        </>
      ) : (
        <>
          <BellPlusIcon className="h-4 w-4" />
          Get notified of new posts
        </>
      )}
    </button>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function BellPlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v3m0 0v3m0-3h3m-3 0H9"
      />
    </svg>
  );
}
