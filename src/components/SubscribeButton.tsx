"use client";

import { useState, useEffect, useCallback } from "react";

// Access the global OneSignal object set by react-onesignal
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getOneSignal = (): any => (typeof window !== "undefined" ? (window as any).OneSignal : null);

// Check if notifications are supported (computed once on client)
const checkSupported = () =>
  typeof window !== "undefined" &&
  "Notification" in window &&
  "serviceWorker" in navigator;

export function SubscribeButton() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported] = useState(checkSupported);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isSupported || !process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) return;

    // Poll until OneSignal is initialized on window
    const checkReady = setInterval(() => {
      const OneSignal = getOneSignal();
      if (OneSignal?.Notifications) {
        clearInterval(checkReady);
        setIsReady(true);
        setIsSubscribed(OneSignal.Notifications.permission);
      }
    }, 500);

    // Cleanup after 10 seconds
    setTimeout(() => clearInterval(checkReady), 10000);

    return () => clearInterval(checkReady);
  }, [isSupported]);

  const handleSubscribe = useCallback(async () => {
    try {
      const OneSignal = getOneSignal();
      if (!OneSignal?.Slidedown) {
        console.error("OneSignal not ready");
        return;
      }
      await OneSignal.Slidedown.promptPush();

      // Check subscription status after prompt
      if (OneSignal?.Notifications) {
        setIsSubscribed(OneSignal.Notifications.permission);
      }
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
