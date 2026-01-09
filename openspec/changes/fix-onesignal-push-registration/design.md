# Design: Fix OneSignal Push Registration

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser                                   │
├─────────────────────────────────────────────────────────────────┤
│  Page Context                     Service Worker Context         │
│  ┌─────────────────┐              ┌──────────────────────┐      │
│  │ OneSignalProvider│─────init───▶│ OneSignalSDKWorker.js│      │
│  │   (SDK init)    │              │ (push subscription)  │      │
│  └────────┬────────┘              └──────────┬───────────┘      │
│           │                                  │                   │
│  ┌────────▼────────┐              ┌──────────▼───────────┐      │
│  │ SubscribeButton │              │ OneSignal CDN SDK    │      │
│  │ (user prompt)   │              │ (subscription mgmt)  │      │
│  └─────────────────┘              └──────────────────────┘      │
│                                              │                   │
└──────────────────────────────────────────────┼───────────────────┘
                                               │
                                    ┌──────────▼───────────┐
                                    │   OneSignal Servers   │
                                    │  (subscription store) │
                                    └──────────────────────┘
```

## Key Design Decisions

### 1. Separate Service Workers (Serwist + OneSignal)

**Decision**: Keep OneSignal's service worker separate from Serwist's PWA worker.

**Rationale**:

- Serwist (`public/sw.js`) handles caching and PWA functionality
- OneSignal (`public/OneSignalSDKWorker.js`) handles push notifications
- Browsers support multiple service workers with different scopes
- Simpler maintenance - each worker handles one concern
- OneSignal's CDN worker is maintained by them

**Alternative Rejected**: Integrating OneSignal into Serwist worker would require:

- Manual maintenance of OneSignal's complex push handling code
- Version tracking when OneSignal updates their SDK
- Risk of breaking PWA caching or push functionality

### 2. Use OneSignal's Slidedown API (Not Native Notification API)

**Decision**: Use `OneSignal.Slidedown.promptPush()` instead of `Notification.requestPermission()`.

**Rationale**:

- Native API only grants browser permission
- OneSignal's Slidedown registers the subscription with their servers
- Provides consistent UX with OneSignal's permission flow
- Handles edge cases (denied permission recovery, iOS Safari)

### 3. Polling for SDK Readiness

**Decision**: Poll for OneSignal initialization before showing the subscribe button.

**Rationale**:

- OneSignal SDK initializes asynchronously
- No reliable event fired when fully ready
- Prevents user clicking before SDK can handle subscription
- 500ms polling interval balances responsiveness and efficiency

## Service Worker Lifecycle

```
1. Page loads
2. OneSignalProvider calls OneSignal.init({ serviceWorkerPath: '/OneSignalSDKWorker.js' })
3. SDK registers OneSignalSDKWorker.js with browser
4. User clicks subscribe button
5. OneSignal.Slidedown.promptPush() triggers permission prompt
6. On grant: Service worker registers subscription with OneSignal servers
7. Subscriber appears in OneSignal dashboard
```

## Error Handling

| Scenario                          | Handling                             |
| --------------------------------- | ------------------------------------ |
| Missing env var                   | Log warning, don't render button     |
| SDK init fails                    | Log error, don't render button       |
| Permission denied                 | Button remains in unsubscribed state |
| Service worker registration fails | Subscription fails, log error        |

## Security Considerations

- Service worker loaded from same origin (`/OneSignalSDKWorker.js`)
- CDN script loaded via HTTPS only
- No sensitive data exposed in client code
- App ID is public (designed to be visible in frontend)
