# Proposal: Remove OneSignal Integration

## Problem Statement

The OneSignal push notification integration adds complexity without providing sufficient value for a personal blog. The integration requires:

- External service dependency (OneSignal API)
- Service worker configuration
- GitHub Actions workflow for notifications
- React component and npm dependency

This conflicts with the project constraint of "No external APIs or services currently" stated in project.md.

## Proposed Solution

Remove all OneSignal-related code, configuration, and dependencies from the codebase.

## Scope

### In Scope

- Delete `src/components/SubscribeButton.tsx`
- Delete `public/OneSignalSDKWorker.js`
- Delete `.github/workflows/notify-new-post.yml`
- Delete `openspec/changes/fix-onesignal-push-registration/` directory
- Delete `openspec/changes/simplify-onesignal-integration/` directory
- Remove `react-onesignal` from package.json
- Remove OneSignal headers config from next.config.ts
- Remove SubscribeButton usage from post page

### Out of Scope

- Adding alternative notification mechanisms (RSS already exists)
- Modifying the post page layout beyond removing the subscribe section

## Impact

- **Dependencies**: Removes 1 npm package (`react-onesignal`)
- **Bundle size**: Reduces client-side JavaScript
- **Maintenance**: Eliminates external service dependency
- **User experience**: Removes subscribe-to-notifications feature (RSS remains available)

## Risks

| Risk                               | Mitigation                                 |
| ---------------------------------- | ------------------------------------------ |
| Users lose notification capability | RSS feed available at /feed.xml            |
| Existing subscribers affected      | Low subscriber count expected for new blog |

## Success Criteria

- Build completes successfully
- No OneSignal references in source files
- Lint passes without errors
