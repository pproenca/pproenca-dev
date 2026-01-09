"use client";

import { useEffect } from "react";

// Module-level flag to prevent multiple initializations
let isInitialized = false;

export function OneSignalProvider() {
  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

    if (!appId) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "OneSignal: Skipping - NEXT_PUBLIC_ONESIGNAL_APP_ID not set",
        );
      }
      return;
    }

    // Prevent multiple initializations (React Strict Mode, HMR)
    if (isInitialized) {
      return;
    }
    isInitialized = true;

    const initOneSignal = async () => {
      try {
        const OneSignal = (await import("react-onesignal")).default;

        await OneSignal.init({
          appId,
          serviceWorkerPath: "/OneSignalSDKWorker.js",
          allowLocalhostAsSecureOrigin: process.env.NODE_ENV === "development",
        });

        console.log("OneSignal: Initialized successfully");
      } catch (error) {
        // Push service errors are expected on localhost (non-HTTPS)
        // These manifest as AbortError or messages about push service
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
  }, []);

  return null;
}
