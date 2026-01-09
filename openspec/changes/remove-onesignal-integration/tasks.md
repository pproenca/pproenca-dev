# Tasks: Remove OneSignal Integration

## Task List

- [x] 1. Delete SubscribeButton component (`src/components/SubscribeButton.tsx`)
- [x] 2. Delete OneSignal service worker (`public/OneSignalSDKWorker.js`)
- [x] 3. Delete GitHub Actions workflow (`.github/workflows/notify-new-post.yml`)
- [x] 4. Delete openspec proposal directories for OneSignal changes
- [x] 5. Remove `react-onesignal` dependency from package.json
- [x] 6. Remove OneSignal headers config from next.config.ts
- [x] 7. Remove SubscribeButton import and usage from post page
- [x] 8. Run `pnpm install` to update lockfile
- [x] 9. Run `pnpm build` to verify build succeeds
- [x] 10. Run `pnpm lint` to verify no errors
- [x] 11. Verify no OneSignal references remain in source files

## Dependencies

Tasks 1-7 can be executed in parallel.
Tasks 8-11 must run sequentially after 1-7 complete.

## Validation

```bash
# After all deletions and edits
pnpm install
pnpm build
pnpm lint

# Verify no references remain
rg -i "onesignal" --type ts --type tsx --type js
```
