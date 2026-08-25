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
  - **Incidental finding, deferred to Phase 1 and fixed there** (see below): `src/app/screens/homePage/ActiveUsers.tsx:30`'s missing-image fallback bug.

**Not done in this session** (explicitly out of Phase 0's scope, per the plan): no visual/theming changes, no `/checkout` route or screen (Phase 4), no re-theme of `ordersPage`'s "Paused" tab labels (Phase 5).

## Session — Phase 1: Homepage (functional-only pass)

**Type**: One bug fix. Per explicit instruction, this pass skips all
CSS/theming, copy, and asset-swap work for every phase — a separate later
session with design skills loaded handles that. Everything Phase 1 in the
original plan called for was visual/copy work (hero copy, stats, video ad,
event copy) and is deferred to `docs/ai/NEXT_STEPS.md`'s new "Visual pass
— not yet done" section, untouched here.

| Change | File(s) | What changed |
|---|---|---|
| Missing-image fallback fix | `src/app/screens/homePage/ActiveUsers.tsx` | `imagePath` now falls back to `/icons/default-user.svg` when `member.memberImage` is unset, matching the existing pattern in `HomeNavbar.tsx`. Previously built `${serverApi}/undefined`, which the browser blocked (`ERR_BLOCKED_BY_ORB`) — flagged during Phase 0's live verification. |

**Verification**:
- `npx tsc --noEmit` — zero errors.
- `npm run build` — succeeds (exit 0).
- Live check (Playwright, real headless Chromium): loaded `/`, confirmed zero failed requests (previously one `FAILED GET http://localhost:3005/undefined`), and confirmed the `ActiveUsers` card's `<img>` now renders `src="/icons/default-user.svg"` for `qa_tester_002` (the only top user, who has no `memberImage`).

**Not done in this session** (deferred to a later visual-design pass, see `docs/ai/NEXT_STEPS.md`): `HomeNavbar.tsx` hero copy, `Statistics.tsx` stats/labels, `Advertisement.tsx` video asset, any remaining `Events.tsx`/`plans.ts` copy, the `burak.svg` logo reference.

## Session — Phase 2: Products List (functional-only pass)

**Type**: One logic bug fix. Category filters, search, sort, and the page
title were already contract-fixed in an earlier commit (`6ae04fe`) — this
session's job was to live-verify that wiring against the real backend and
fix any actual logic bugs found, not re-theme.

| Change | File(s) | What changed |
|---|---|---|
| Pagination "phantom next page" fix | `src/app/screens/productsPage/Products.tsx` | `Pagination`'s `count` was `products.length !== 0 ? page + 1 : page` — always offered one more page than the current one, even when the current page had already returned fewer items than `limit` (i.e., was genuinely the last page). The backend's `GET /product/all` returns no total-count field, so there's no authoritative page count to read — fixed using the one signal that is available client-side: `count = products.length === limit ? page + 1 : page`. A full page still offers a tentative next page (unavoidable without backend support); a short page now correctly stops offering one. |

**Verification**:
- `npx tsc --noEmit` — zero errors.
- `npm run build` — succeeds (exit 0).
- Live check (Playwright, real headless Chromium) against `/products`:
  - All 8 category buttons (CLIMBING/CAMPING/HIKING/TREKKING/CYCLING/APPAREL/FOOTWEAR/OTHER) send correct `productCollection` query values.
  - Search box (type + Enter) sends a correctly URL-encoded `search` param; the clear (×) button resets it.
  - All three sort buttons (NEW/PRICE/VIEWS) send the correct `order` value.
  - **Pagination fix confirmed live with 0 results**: the control renders only page `1` with the next-page button disabled, instead of the old bug's phantom enabled next page.
  - Zero failed requests, zero console errors throughout.

**Full-page → short-page transition, re-verified with real data (follow-up)**: the dev DB had only 1 product total at the time of the check above (`PAUSE` status, not even publicly visible), so the transition itself hadn't been observed, only code-reviewed. 5 `qa_`-tagged `PROCESS`-status test products were added directly to MongoDB (`qa_pagination_test_1` CAMPING/$45, `_2` HIKING/$60, `_3` APPAREL/$30, `_4` CAMPING/$55, `_5` CAMPING/$65 — 3 of the 5 share the CAMPING category, since the UI's category buttons are the only way to view a filtered subset and each of 3 lone categories alone wouldn't have enough volume). This went through direct DB insertion, not `POST /admin/product/create` — the two existing `ADMIN` accounts' credentials aren't known/documented anywhere in this repo or the backend's, and creating a third is blocked by the single-tenant constraint; confirmed with the user this fallback was acceptable, so the real admin endpoint/auth/multer path was **not** exercised, only `GET /product/all` + the frontend's pagination logic.

`Products.tsx`'s `limit` was temporarily changed from `8` to `2` (no UI control exists to adjust it) to make the transition observable with a small dataset, then reverted immediately after — confirmed via `git diff` that only the real pagination fix remains, and `tsc`/build re-run clean post-revert.

Real click-through result, filtering to CAMPING (3 `PROCESS` products, `limit=2`):
- Page 1: `GET /product/all/?...&page=1&limit=2&productCollection=CAMPING` → 2 products, pagination shows `["1", "2"]`, next-page button **enabled**.
- Clicked next → Page 2: `GET /product/all/?...&page=2&limit=2&productCollection=CAMPING` → 1 product (`qa_pagination_test_1`), next-page button **correctly disabled** — screenshotted, confirmed visually (the `→` arrow greyed out vs. the active `←`).

The `qa_pagination_test_1`–`_5` products are left in the dev database intentionally, matching the backend's own prior-session convention for `qa_`-tagged test data — not cleaned up.

**Not done in this session** (deferred to a later visual-design pass, see `docs/ai/NEXT_STEPS.md`): `products.css`/grid imagery re-theme, the "Our Family Brands" Burak-image section, the "Our address" placeholder map section.

## Session — Phase 3: Product Detail (functional-only pass)

**Type**: Two fixes — the planned rating-wiring fix, plus one additional
latent bug found while in the file per the standing "flag, don't ignore
what's sitting right there" rule.

| Change | File(s) | What changed |
|---|---|---|
| Real rating fields on `Product` type | `src/lib/types/product.ts` | Added `averageRating: number` and `reviewCount: number` — both genuinely exist on the backend schema (added in the backend's Session 6) but were missing from this frontend's `Product` interface entirely. |
| Wired real rating display | `src/app/screens/productsPage/ChosenProduct.tsx` | `<Rating defaultValue={2.5} precision={0.5} />` (hardcoded, and — since it had no `readOnly`/controlled `value` — silently interactive with no submit handler, i.e. a second decorative/misleading control) replaced with `<Rating value={chosenProduct.averageRating ?? 0} precision={0.5} readOnly />`. Now reads real backend data and can no longer be clicked to show a fake, unsubmitted rating change. |
| Stale-product-on-navigation bug (found, not planned) | `src/app/screens/productsPage/ChosenProduct.tsx` | The data-fetch `useEffect` had `productsId` read via closure but an empty `[]` dependency array — if a future feature ever links from one product detail page directly to another (no such link exists today, so currently dormant/unreachable, but React Router v5 does *not* remount this component on a params-only route change), the page would keep showing the previous product's data forever. Added `productsId` to the dependency array. Did **not** add the `setChosenProduct`/`setRestaurant` dispatch-wrapper functions the ESLint rule also flags — those are reconstructed on every render by this file's `actionDispatch(useDispatch())` pattern, so including them would refetch on every render instead of only when the id changes; that's pre-existing lint debt already tracked in `docs/ai/NEXT_STEPS.md`'s ESLint section, not part of this fix. |

**Explicitly not built** (per instruction): a review-*submission* UI (`POST /review/create`) — a new feature, not a fix to existing UI, out of scope for this pass.

**Verification**:
- `npx tsc --noEmit` — zero errors.
- `npm run build` — succeeds (exit 0).
- Live check (Playwright, real headless Chromium) against `qa_pagination_test_4` (0 reviews at the time): rating renders `aria-label="0 Stars"`, 0 filled star icons, 0 `<input type=radio>` elements present (confirms genuinely read-only, not just visually static) — the empty-state path renders correctly, no crash, no fallback to the old hardcoded `2.5`.
- **End-to-end confirmation**: logged in as `qa_tester_002` (real credentials from Phase 0), submitted a real review via `POST /review/create` (`rating: 4`, `qa_`-tagged comment) — `201 Created`. Reloaded the product detail page: rating now renders `aria-label="4 Stars"`, screenshot confirms 4 filled / 1 empty star. The review is left in place as `qa_`-tagged test data, matching this repo's established convention for such data (see Phase 2).

**Not done in this session** (deferred to a later visual-design pass, see `docs/ai/NEXT_STEPS.md`): `ChosenProduct.tsx`/`products.css` re-theme; `reviewCount` is now on the `Product` type but not yet surfaced in the UI (no "(N reviews)" label) — available for a future targeted addition, not built since it wasn't asked for.

## Session — Phase 4: Cart / Checkout (functional-only pass)

**Type**: New page + two existing files rewired. Highest-risk phase so
far — the previous "dropdown → immediate order" pattern was already
confirmed hard-broken by Phase 0 (backend requires `shippingAddress`,
which nothing collected), so this replaces it with a real checkout step
per the plan's locked decisions.

| Change | File(s) | What changed |
|---|---|---|
| New checkout screen | `src/app/screens/checkoutPage/index.tsx` (new) | Single page — address form (street/city/state/zip/country, all required, never pre-filled from `Member.memberAddress` per the locked decision, since that field is free-text and doesn't match the backend's structured `ShippingAddress` shape) + order summary (items, delivery-fee-inclusive total, same calc as `Basket.tsx`) + one submit button. Auth-gated the same way `ordersPage`/`userPage` already are (`if (!authMember) history.push("/")`). Empty-cart state shows a plain message instead of a broken form. No custom CSS file — relies on MUI component defaults only, deliberately, since this pass is functional-only. |
| Route wired | `src/app/App.tsx` | Added `/checkout` → `CheckoutPage`, passed `cartItems`/`onDeleteAll` (same props `Basket.tsx` already receives). |
| Basket simplified | `src/app/components/headers/Basket.tsx` | `proceedOrderHandler` no longer calls `OrderService.createOrder` (removed the now-unused import), no longer calls `onDeleteAll()`, no longer pushes to `/orders` — it now just does `history.push("/checkout")`. The `authMember` check was **kept** (not explicitly named in the instructions as something to preserve, but removing it would have silently regressed the UX: an unauthenticated user clicking "Order" would previously get an immediate clear "Please login first!" toast; without the check they'd instead flash through to `/checkout` and get silently bounced back to `/` with no message, since the new page has its own auth-redirect. Flagging this as a deliberate small preservation, not scope creep — happy to remove it if unintended.) |
| Phase 0's placeholder removed | `src/app/components/headers/Basket.tsx` | The `TODO(Phase 4)`-marked empty placeholder `ShippingAddress` (`street: "", city: "", ...`) that Phase 0 left in `createOrder`'s call site is gone entirely, along with the call itself — the real address now comes from `CheckoutPage`'s form. |

**Explicitly not touched** (per instruction): the decorative payment-card `<input>` fields in `ordersPage/index.tsx:136-157` — unrelated to this phase, Phase 5's job.

**Verification**:
- `npx tsc --noEmit` — zero errors.
- `npm run build` — succeeds (exit 0). Also confirmed via a `CI=true` build that the new `checkoutPage/index.tsx` introduces zero new ESLint warnings, and `App.tsx`/`Basket.tsx`'s existing warnings are unchanged in kind (same pre-existing ones, no new ones added by this session's edits).
- **Full live end-to-end flow** (Playwright, real headless Chromium, real backend, real `qa_tester_002` login):
  1. Logged in — confirmed authed UI state.
  2. Added 2 real products to cart from `/products` (CAMPING category, `qa_pagination_test_4`/`_5`) via the actual "add to cart" button — confirmed cart badge shows `2` and `localStorage.cartData` holds both real items.
  3. Opened the basket dropdown, clicked "Order" — confirmed it navigated to `/checkout` **and that zero `POST /order/create` calls had fired yet** (proving the create-order call genuinely moved out of `Basket.tsx`, not just UI navigation).
  4. Filled a real address (street/city/state/zip/country) on `/checkout` — screenshotted.
  5. Submitted — `POST /order/create` returned **`201`** with the real created order: `orderTotal: 120`, `orderDelivery: 0` (correct — $55 + $65 = $120, at/above the $100 free-shipping threshold), `orderStatus: "PENDING"` (confirms Phase 0's enum rename is live end-to-end), and the exact submitted `shippingAddress` echoed back.
  6. Confirmed the cart was **genuinely** cleared, not just visually: `localStorage.cartData` → `null` (not just an empty array), cart badge → `0`.
  7. Landed on `/orders`, screenshotted: the new order appears under the (still old-labeled, Phase-5-scoped) "PAUSED ORDERS" tab showing "Product price $120 + Delivery cost $0 = Total $120" — matching the created order exactly.
  - Only console errors seen were pre-existing MUI `findDOMNode`/StrictMode deprecation warnings from `AuthenticationModal`, a component untouched by this session.

**Failure-path verification (follow-up, live-tested)**: the happy path alone doesn't prove `onDeleteAll()`/the `/orders` redirect are correctly gated on actual success rather than just "the button was clicked" — tested both explicitly, real backend, real login:
- **Blank address**: submitted `/checkout` with all 5 fields empty. Result: **0** `POST /order/create` calls fired (client-side `Object.values(address).every(...)` check blocks before any network request — confirms validation is client-side, not "POST and let the backend 400"), a real SweetAlert error (`"Please fulfill all inputs!"`) rendered on screen (not swallowed), user stayed on `/checkout`, `localStorage.cartData` byte-for-byte unchanged before vs. after.
- **Partial address**: filled Street/City/State/Zip, left Country blank. Identical result — 0 network calls, same error shown, stayed on `/checkout`, cart unchanged. Confirms the check catches a single missing field, not just "all blank."
- Both screenshotted; the partial-address screenshot shows the error modal open with the form data still intact underneath and the cart badge still reading `1`.
- **Code-path confirmation matching the live result**: `submitOrderHandler`'s validation throw happens *before* `order.createOrder(...)` is ever called, and `onDeleteAll()`/`setOrderBuilder`/`history.push("/orders")` all sit *after* that `await` inside the same `try` block — so any failure (client-side validation throw, or a hypothetical backend rejection) skips straight to the `catch`, which only calls `sweetErrorHandling`. There is no code path that reaches `onDeleteAll()` without a real `201` from `order.createOrder` resolving first.
- Not exercised: a genuine backend-side rejection (client validation requires all 5 fields non-empty by the same rule the backend enforces, so there's no way to pass client validation while still failing the backend's schema check through the actual UI — would require bypassing the form entirely, which wouldn't be testing this screen's real code path).

**Other bugs found while in these files**: none beyond what's already fixed above — no additional hardcoded values or broken logic noticed in `App.tsx`/`Basket.tsx` outside the scope of this phase's own changes.

**Not done in this session** (deferred to a later visual-design pass, see `docs/ai/NEXT_STEPS.md`): all styling/layout for the new checkout page (currently bare MUI defaults).
