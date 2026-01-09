# Spec: Push Notifications

## Overview

Web push notification capability allowing readers to subscribe and receive notifications when new posts are published.

---

## ADDED Requirements

### Requirement: OneSignal Service Worker

The application MUST provide a OneSignal service worker file that enables push subscription registration.

#### Scenario: Service worker file available

**Given** a browser requests `/OneSignalSDKWorker.js`
**When** the request completes
**Then** the response status is 200
**And** the response contains OneSignal's push handling code

---

### Requirement: OneSignal SDK Initialization

The OneSignal SDK MUST initialize with explicit service worker configuration.

#### Scenario: SDK initializes on page load

**Given** the environment variable `NEXT_PUBLIC_ONESIGNAL_APP_ID` is set
**When** the page loads
**Then** the OneSignal SDK initializes with `serviceWorkerPath: "/OneSignalSDKWorker.js"`
**And** the console logs "OneSignal: Initialized successfully"

#### Scenario: SDK skipped when env var missing

**Given** the environment variable `NEXT_PUBLIC_ONESIGNAL_APP_ID` is not set
**When** the page loads
**Then** the OneSignal SDK does not initialize
**And** the console logs a warning in development mode

---

### Requirement: Subscribe Button Integration

The subscribe button MUST use OneSignal's subscription API to register users.

#### Scenario: Button appears after SDK ready

**Given** the OneSignal SDK has initialized successfully
**When** the user views a post page
**Then** the subscribe button is visible

#### Scenario: Button hidden before SDK ready

**Given** the OneSignal SDK has not finished initializing
**When** the user views a post page
**Then** the subscribe button is not visible

#### Scenario: User subscribes successfully

**Given** the subscribe button is visible
**And** the user has not previously subscribed
**When** the user clicks the subscribe button
**Then** OneSignal's permission prompt is shown
**And** after granting permission, the subscription is registered with OneSignal servers
**And** the button shows "Subscribed" state

#### Scenario: Already subscribed user sees subscribed state

**Given** the user has previously granted push notification permission
**When** the user views a post page
**Then** the button shows "Subscribed" state

---

## Related Capabilities

- **PWA (Serwist)**: Separate service worker for caching; must coexist without conflict
- **New Post Workflow**: `.github/workflows/notify-new-post.yml` sends notifications to subscribers
