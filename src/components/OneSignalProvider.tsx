"use client";

import { useEffect } from "react";

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
        console.error("OneSignal: Initialization failed", error);
      }
    };

    initOneSignal();
  }, []);

  return null;
}
