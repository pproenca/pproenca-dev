# Push Notifications Capability

## REMOVED Requirements

### Requirement: Subscribe Button Component

The blog no longer provides a subscribe button for push notifications.

#### Scenario: User visits post page

- Given a user is reading a blog post
- Then no subscribe button is displayed
- And no OneSignal SDK is loaded

### Requirement: Push Notification Workflow

The blog no longer sends push notifications when new posts are published.

#### Scenario: New post published

- Given a new MDX file is pushed to the repository
- Then no push notification is sent to subscribers
- And no GitHub Action triggers for notifications

### Requirement: OneSignal Service Worker

The blog no longer registers a OneSignal service worker.

#### Scenario: Page load

- Given a user loads any page on the blog
- Then no OneSignalSDKWorker.js is registered
- And no service worker requests are made to OneSignal
