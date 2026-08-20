# FinSight — React Native App

A production-structured React Native CLI + TypeScript client for the FinSight
expense-tracking backend. Auth, profile setup, dashboard analytics, expense
CRUD, and OCR receipt scanning, wired to your existing API — no invented
endpoints.

## Before you run this

The app expects three fixes on the backend (you said you'd handle these):

1. **Mount `/api/dashboard`** in `app.ts` — the route file exists but wasn't registered.
2. **Rename `receiptImageUrl` -> `receiptUrl`** in `createExpense`/`updateExpense` controllers to match the Prisma column, or the frontend's `receiptUrl` field won't persist.
3. **Fix `deleteExpense`** to check `req.user?.userId` instead of `req.user?.id` (the JWT payload only carries `userId`).

The frontend already calls the corrected shapes (`GET/POST/PUT /api/expenses`
with `receiptUrl`, `GET /api/dashboard`), so once those three fixes land, no
frontend changes are needed.

## Setup

```bash
npm install --legacy-peer-deps

# iOS only - links vector-icon fonts into the Xcode project (one-time)
npx react-native-asset
cd ios && pod install && cd ..

# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

### Pointing at your backend

Edit `src/constants/config.ts`:

- **Android emulator** hits your machine via `10.0.2.2` - already set as the default dev URL.
- **iOS simulator** uses `localhost` - already set.
- **Physical device** - replace with your machine's LAN IP (e.g. `http://192.168.1.23:5000`).
- **Production build** - set `PROD_API_URL` to your deployed backend.

## Architecture

```
src/
  assets/            images, icons
  components/
    common/          Screen, AppText, LoadingIndicator, EmptyState, ErrorState
    buttons/          PrimaryButton, IconButton, FAB
    cards/            Card, BudgetCard, ExpenseListItem
    charts/           CategoryPieChart (custom SVG, no external chart lib)
    inputs/           FormTextInput (react-hook-form), DateInput, CategoryPicker
    modals/           ConfirmModal
  navigation/         Root/Auth/MainTab/Dashboard/Expense/Profile/Settings navigators
  screens/            One file per screen, grouped by feature
  services/api/       axios client + one service file per backend resource
  context/            AuthContext (session), ProfileContext (budget gate)
  hooks/               useProfile, useExpenses, useDashboard - data + loading/error state
  utils/               formatters, validators, ocrParser, eventEmitter
  constants/           storage keys, API config, category metadata
  types/               models/api types mirrored from the Prisma schema, navigation types
  theme/               colors (light/dark), typography, ThemeContext
  storage/             typed AsyncStorage wrapper
```

### Navigation flow

`RootNavigator` gates the app in this order:
1. Auth bootstrapping from `AsyncStorage` -> branded splash
2. Not logged in -> Login/Register
3. Logged in, no profile yet -> `CreateProfileScreen` (blocks Main until a profile exists, matching the backend's `GET /api/profile` 404-when-missing behavior)
4. Logged in + has profile -> bottom tabs (Dashboard, Expenses, Profile, Settings)

### Auth

JWT is stored in `AsyncStorage`, injected on every request via an axios
request interceptor. A response interceptor watches for `401`s and emits a
global event that `AuthContext` listens for to auto-logout - no manual
token-expiry handling needed in individual screens.

### OCR (Google ML Kit)

`OCRScanScreen` -> `@react-native-ml-kit/text-recognition` extracts raw text
from a captured/picked receipt photo -> `src/utils/ocrParser.ts` heuristically
pulls out an amount (biased toward "total"-labeled lines), a date, and a
suggested category (keyword matching in `constants/categories.ts`) -> results
are passed as `prefill` params into `AddExpenseScreen`, where the user reviews
and edits before saving via the real `POST /api/expenses`.

**Note:** the backend has no file-upload endpoint. Receipt images are stored
as local device URIs in `receiptUrl` - viewable in-app, but not synced to a
server. Wire this up once you add real object storage (S3/Cloudinary/etc.).

### Theming

Light/dark mode via `ThemeContext`, persisted to `AsyncStorage`, togglable in
Settings (Light / Dark / System). All colors, spacing, radius, and shadows
are tokenized in `src/theme/` - no hardcoded hex values in screens.

## Verified

- `npx tsc --noEmit` - 0 errors
- `npx eslint src App.tsx --ext .ts,.tsx` - 0 errors (remaining warnings are
  intentional inline-style usage, not bugs)
- `npm install` completes cleanly against the pinned dependency set
