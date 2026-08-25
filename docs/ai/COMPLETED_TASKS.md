# Completed Tasks — Burak-React → Venturo-React Frontend Migration

Chronological, grouped by session. This is this repo's own completed-tasks
log — separate from the backend's `../venturo/docs/ai/COMPLETED_TASKS.md`.
Tracks execution against the plan in this session's approved migration
plan (Phase 0–6, plus flagged follow-ups for Wishlist/Blog/Review UI).

## Session — Phase 0: Contract & Config Stabilization

**Type**: Code changes, no visual/theming work. Verified with
`npx tsc --noEmit`, `npm run build`, and a live browser smoke test
(Playwright against the running dev server + live backend).

| Change | File(s) | What changed |
|---|---|---|
| API URL port fix | `.env` | `REACT_APP_API_URL` was `http://localhost:3003`; backend's own `.env` sets `PORT = 3005`. Every API call was hitting the wrong port. Fixed to `http://localhost:3005`. |
| `OrderStatus` enum rename | `src/lib/enums/order.enum.ts` | `PAUSE` → `PENDING`; `SHIPPED` inserted between `PROCESS` and `FINISH`. Matches the backend's current `OrderStatus` (`PENDING, PROCESS, SHIPPED, FINISH, DELETE`). |
| `OrderStatus.PAUSE` call-site fix | `src/app/screens/ordersPage/index.tsx` | Two references (`orderInquiry` initial state, the paused-orders fetch) updated to `OrderStatus.PENDING` so the app still compiles/functions after the enum rename — copy/label re-theming for this screen is still Phase 5, not done here. |
| `CreateOrderInput` contract | `src/lib/types/order.ts` | Added `ShippingAddress { street, city, state, zip, country }` and `CreateOrderInput { shippingAddress, items: OrderItemInput[] }`, matching the backend's `POST /order/create` body shape (it now requires a `shippingAddress`, not a bare item array). |
| `OrderService.createOrder` signature | `src/app/services/OrderService.ts` | Now takes `(input: CartItem[], shippingAddress: ShippingAddress)` and POSTs `{ shippingAddress, items }` instead of a bare `OrderItemInput[]`. |
| Temporary placeholder call site | `src/app/components/headers/Basket.tsx` | `proceedOrderHandler` now passes a placeholder empty `ShippingAddress` to `createOrder`, marked `TODO(Phase 4 — checkout)`. This unblocks the typecheck/build now; the real address form is Phase 4's job — this placeholder must be replaced there, not left in place. |
| Duplicate `id` fix | `src/app/components/auth/index.tsx` | Every `TextField` shared `id="outlined-basic"` (found live during Phase 0's login verification, see below). Gave each field a unique, purpose-tied id: `signup-nick`, `signup-phone`, `signup-password`, `login-nick`, `login-password`. |

**Verification**:
- `npx tsc --noEmit` — zero errors.
- `npm run build` — succeeds (exit 0). Note: `CI=true npm run build` fails on pre-existing ESLint warnings — **65 warnings across 23 files**, none introduced by Phase 0. Full itemized list moved to `docs/ai/NEXT_STEPS.md` (an earlier draft of this entry under-counted this as "~15 files"; corrected here). This is a real risk on any CI platform that sets `CI=true` automatically, not a non-issue — tracked as a follow-up, not fixed in Phase 0.
- **Live smoke test**, backend running on `localhost:3005`, dev server on `localhost:3000`, driven with a real headless Chromium instance via a cached Playwright install (`require()`'d directly from `~/.npm/_npx/.../node_modules/playwright`, since neither `chromium-cli` nor an npm-installed Playwright/Puppeteer was available in this environment — no fallback to curl-only checks; scripts and raw output are preserved in the session transcript, not committed to the repo):
  - Confirmed backend CORS is enabled and credential-compatible: `../venturo/src/app.ts` has `app.use(cors({ credentials: true, origin: true }))` — `origin: true` reflects the request origin per-request, which is required (not `origin: "*"`) for `withCredentials: true` requests to succeed with cookies. No CORS errors appeared in the real browser console.
  - All API calls from the browser correctly hit `localhost:3005` (not `3003`), all `200`.
  - Homepage and Products page render; category filter buttons (all 8: CLIMBING/CAMPING/HIKING/TREKKING/CYCLING/APPAREL/FOOTWEAR/OTHER) present and functional.
  - **Product count corrected**: initial unfiltered `GET /product/all` returning `[]` was mis-read as "zero products in the DB." A direct `db.products.countDocuments({})` against the same `MONGO_URL` the backend's `.env` uses (via the backend's own installed `mongodb` driver, since this frontend repo has no `MONGO_URL`/DB access of its own — it's a pure REST client) found **1 product** ("QA Test Trekking Poles", `productStatus: "PAUSE"`, `productCollection: "TREKKING"`). The public `GET /product/all` correctly excludes non-`PROCESS` products (per the backend's own `DECISIONS.md` #4) — so the empty list was correct filtering behavior, not missing data or a broken fetch. Also confirmed via the `members` collection that this DB is the same one referenced in the backend's test history (`qa_tester_002`, `memberPoints: 1`, present).
  - **Login round-trip confirmed live**, using `qa_tester_002` / `TestPass123!`: `POST /member/login` → `200`, `accessToken`/`connect.sid` cookies set, `localStorage.memberData` populated, navbar switches to the authenticated avatar state, and the auth-gated `/orders` route renders (not redirected to `/`) showing the real profile (nickname, `USER` type, address). Product browsing while authenticated (`/products`) also confirmed.
    - First attempt at this test produced a false-negative `404` — traced to the test script's own selector, not the app at the time: `getByLabel("username"/"password")` landed on the wrong field because every `TextField` in `components/auth/index.tsx` shared the identical `id="outlined-basic"`. Retested with position/type-based selectors to confirm the underlying login flow worked; the duplicate-`id` bug itself was then fixed (see table above) and **re-verified with `getByLabel` directly — now resolves the correct field with no workaround needed**: `POST /member/login` → `200`, `connect.sid`/`accessToken` cookies set, same authenticated round-trip confirmed. Removed from `docs/ai/NEXT_STEPS.md` now that it's fixed and re-verified.
  - **Incidental finding, not fixed in Phase 0 (deferred to Phase 1)**: `src/app/screens/homePage/ActiveUsers.tsx:30` builds `${serverApi}/${member.memberImage}` with no fallback when a member has no uploaded image, producing a request to `http://localhost:3005/undefined` that the browser blocks (`ERR_BLOCKED_BY_ORB`). `HomeNavbar.tsx` already has the right pattern for this (`memberImage ? ... : "/icons/default-user.svg"`) — `ActiveUsers.tsx` should adopt the same fallback. Still logged in `docs/ai/NEXT_STEPS.md` until fixed.

**Not done in this session** (explicitly out of Phase 0's scope, per the plan): no visual/theming changes, no `/checkout` route or screen (Phase 4), no re-theme of `ordersPage`'s "Paused" tab labels (Phase 5).
