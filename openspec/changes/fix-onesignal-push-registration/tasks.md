# Tasks: Fix OneSignal Push Registration

## Overview

| Task | File(s) | Status |
|------|---------|--------|
| 1. Create OneSignal service worker | `public/OneSignalSDKWorker.js` | Complete |
| 2. Update OneSignalProvider | `src/components/OneSignalProvider.tsx` | Complete |
| 3. Update SubscribeButton | `src/components/SubscribeButton.tsx` | Complete |
| 4. Verify integration | Manual testing | Pending |

## Tasks

### 1. Create OneSignal Service Worker

**File**: `public/OneSignalSDKWorker.js` (create new)

- [x] Create service worker file that imports OneSignal's SDK

**Validation**: File exists at `/OneSignalSDKWorker.js` and returns 200.

---

### 2. Update OneSignalProvider

**File**: `src/components/OneSignalProvider.tsx`

- [x] Add explicit `serviceWorkerPath` configuration
- [x] Improve error handling with try/catch
- [x] Add initialization success logging

**Validation**: Console shows "OneSignal: Initialized successfully" on page load.

---

### 3. Update SubscribeButton

**File**: `src/components/SubscribeButton.tsx`

- [x] Replace native `Notification.requestPermission()` with `OneSignal.Slidedown.promptPush()`
- [x] Add polling for SDK readiness before showing button
- [x] Use `OneSignal.Notifications.permission` for subscription state

**Validation**: Button only appears after SDK initializes; clicking triggers OneSignal prompt.

---

### 4. Verify Integration

Manual testing steps:

1. Clear browser state:
   - DevTools → Application → Service Workers → Unregister all
   - Clear site data (cookies, storage)

2. Start dev server: `npm run dev`

3. Navigate to a post page

4. Verify console shows "OneSignal: Initialized successfully"

5. Click subscribe button

6. Grant notification permission

7. Check OneSignal dashboard for new subscriber

8. Send test notification from dashboard

9. Verify notification received in browser

**Validation**: Subscriber appears in OneSignal dashboard; test notification received.

## Dependencies

- Task 2 depends on Task 1 (provider references service worker path)
- Task 3 depends on Task 2 (button polls for SDK readiness)
- Task 4 depends on all previous tasks

## Parallelization

Tasks 1-3 can be implemented in sequence within a single session. No parallelization needed - this is a focused 3-file change.
