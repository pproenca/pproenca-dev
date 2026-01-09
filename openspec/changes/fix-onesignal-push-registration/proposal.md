# Proposal: Fix OneSignal Push Registration

## Summary

Push notification permission is granted via the browser, but **no subscribers are registered in OneSignal's dashboard**. The root cause is a missing OneSignal service worker file that's required for the SDK to communicate with OneSignal's servers.

## Problem

- `react-onesignal` v3.4.6 is installed and initializing
- `SubscribeButton` requests browser notification permission
- Permission is granted successfully
- **No subscribers appear in OneSignal dashboard**

### Root Cause

OneSignal requires `OneSignalSDKWorker.js` in the public folder to:
1. Register push subscription endpoints with OneSignal servers
2. Handle incoming push notifications
3. Manage the push subscription lifecycle

Without this file, OneSignal SDK initializes but cannot complete the subscription registration.

## Current State

| Component | Status |
|-----------|--------|
| `react-onesignal` package | Installed (v3.4.6) |
| `OneSignalProvider` | Initializes SDK, missing service worker path |
| `SubscribeButton` | Uses native `Notification.requestPermission()` (bypasses OneSignal) |
| `public/OneSignalSDKWorker.js` | **Missing** |
| `public/sw.js` | Present (Serwist PWA caching - separate concern) |

## Proposed Solution

1. **Create** `public/OneSignalSDKWorker.js` - imports OneSignal's CDN service worker
2. **Update** `OneSignalProvider` - specify service worker path explicitly
3. **Update** `SubscribeButton` - use OneSignal's methods instead of native API

## Scope

- **In scope**: Service worker setup, provider configuration, button integration
- **Out of scope**: OneSignal dashboard configuration, notification content/styling

## Success Criteria

- [ ] Clicking subscribe button registers a subscriber in OneSignal dashboard
- [ ] Test notification from dashboard is received in browser
- [ ] Service worker coexists with existing Serwist PWA worker

## Related Changes

None - this is a new capability.

## Status

**Proposed** - Awaiting approval
