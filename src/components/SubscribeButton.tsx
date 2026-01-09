"use client";

import { useState, useEffect, useTransition } from "react";

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

  // Condition-based waiting with exponential backoff (replaces polling)
  useEffect(() => {
    if (!isSupported || !process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const checkReady = (attempt = 0) => {
      if (cancelled || attempt > 20) return; // Max ~10s with backoff

      const OneSignal = getOneSignal();
      if (OneSignal?.Notifications) {
        setIsReady(true);
        setIsSubscribed(OneSignal.Notifications.permission);
        return;
      }

      // Exponential backoff: 100ms, 200ms, 400ms... capped at 1000ms
      const delay = Math.min(100 * Math.pow(2, attempt), 1000);
      timeoutId = setTimeout(() => checkReady(attempt + 1), delay);
    };

    checkReady();
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isSupported]);

  // useTransition for async operations (React 19 pattern)
  const [isPending, startTransition] = useTransition();

  const handleSubscribe = () => {
    startTransition(async () => {
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
    });
  };

  if (!isSupported || !isReady) return null;

  return (
    <button
      onClick={handleSubscribe}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
    >
      {isPending ? (
        <>
          <span className="h-4 w-4 animate-pulse">...</span>
          Subscribing...
        </>
      ) : isSubscribed ? (
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
