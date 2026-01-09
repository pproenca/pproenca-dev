"use client";

import * as React from "react";

const checkSupported = () =>
  typeof window !== "undefined" &&
  "Notification" in window &&
  "serviceWorker" in navigator;

export interface SubscribeButtonProps {
  ref?: React.Ref<HTMLButtonElement>;
  className?: string;
}

export function SubscribeButton({ ref, className }: SubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const isSupported = checkSupported();

  const isInitialized = React.useRef(false);
  const oneSignalRef = React.useRef<
    typeof import("react-onesignal").default | null
  >(null);

  React.useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

    if (!isSupported || !appId) {
      if (process.env.NODE_ENV === "development" && !appId) {
        console.log(
          "OneSignal: Skipping - NEXT_PUBLIC_ONESIGNAL_APP_ID not set",
        );
      }
      return;
    }

    if (isInitialized.current) {
      return;
    }
    isInitialized.current = true;

    let cancelled = false;

    const initOneSignal = async () => {
      try {
        const OneSignal = (await import("react-onesignal")).default;

        await OneSignal.init({
          appId,
          serviceWorkerPath: "/OneSignalSDKWorker.js",
          allowLocalhostAsSecureOrigin: process.env.NODE_ENV === "development",
        });

        if (cancelled) return;

        oneSignalRef.current = OneSignal;
        setIsReady(true);
        setIsSubscribed(OneSignal.Notifications.permission);

        if (process.env.NODE_ENV === "development") {
          console.log("OneSignal: Initialized successfully");
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development" && error instanceof Error) {
          const isExpectedError =
            error.name === "AbortError" ||
            error.message.includes("push service") ||
            error.message.includes("Registration failed");
          if (isExpectedError) {
            console.log(
              "OneSignal: Push registration skipped on localhost (requires HTTPS)",
            );
            return;
          }
        }
        console.error("OneSignal: Initialization failed", error);
      }
    };

    initOneSignal();

    return () => {
      cancelled = true;
    };
  }, [isSupported]);

  const [isPending, startTransition] = React.useTransition();

  const handleSubscribe = () => {
    if (isPending) return;

    startTransition(async () => {
      try {
        const OneSignal = oneSignalRef.current;
        if (!OneSignal?.Slidedown) {
          console.error("OneSignal not ready");
          return;
        }
        await OneSignal.Slidedown.promptPush();

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
      ref={ref}
      onClick={handleSubscribe}
      aria-disabled={isPending || undefined}
      aria-pressed={isSubscribed}
      data-subscribed={isSubscribed ? "" : undefined}
      data-pending={isPending ? "" : undefined}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
      }
    >
      {isPending ? (
        <>
          <span className="h-4 w-4 animate-pulse" aria-hidden="true">
            ...
          </span>
          Subscribing...
        </>
      ) : isSubscribed ? (
        <>
          <BellIcon className="h-4 w-4" />
          Subscribed
        </>
      ) : (
        <>
          <BellIcon className="h-4 w-4" showPlus />
          Get notified of new posts
        </>
      )}
    </button>
  );
}

interface BellIconProps {
  className?: string;
  showPlus?: boolean;
}

function BellIcon({ className, showPlus }: BellIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
      {showPlus && (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v3m0 0v3m0-3h3m-3 0H9"
        />
      )}
    </svg>
  );
}
