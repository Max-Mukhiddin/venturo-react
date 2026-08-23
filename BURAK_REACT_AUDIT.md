# Burak-React Frontend Audit

Scope: everything in the `burak-react` repository as of the current working tree on branch `develop` (latest commit `4e9e0f8 feat: develop updateMember business logic and modify ordersPage componennt`, plus one uncommitted whitespace-only change to `src/app/components/headers/Basket.tsx`). This audit is independent of [VENTURO_AUDIT.md](../venturo/VENTURO_AUDIT.md) (the backend audit) but cross-checks every API assumption against it. No code changes were made while producing this document.

---

## 1. Structure First

### 1.1 Folder layout

This **is** a standalone React single-page app — the client the backend's `app.ts` comment (`// SPA: REACT`) refers to, and the piece that was missing from the backend repo.

```
burak-react/
├── package.json / yarn.lock          ("name": "burak-react" — never renamed)
├── tsconfig.json
├── .env                               (REACT_APP_API_URL=http://localhost:3003)
├── public/                            CRA static root: index.html, manifest.json, icons/, img/, video/
├── build/                             stale production build output (generated, not audited further)
└── src/
    ├── index.tsx                      ReactDOM root, wraps <App/> in <Router>, <Provider>, <ContextProvider>
    ├── react-app-env.d.ts, declarations.d.ts, reportWebVitals.ts, setupTests.ts
    ├── css/                           one hand-written .css file per page/section
    └── app/
        ├── App.tsx                    top-level layout + <Switch> route table
        ├── store.ts                   Redux Toolkit store
        ├── hooks.ts, hooks/useGlobals.ts, hooks/useBasket.ts
        ├── context/ContextProvider.tsx  auth-member + orderBuilder context (backed by localStorage + cookie check)
        ├── MaterialTheme/             MUI theme overrides (shadow, typography, styled)
        ├── components/
        │   ├── auth/index.tsx         signup/login modal
        │   ├── divider/index.tsx
        │   ├── footer/index.tsx
        │   └── headers/               HomeNavbar, OtherNavbar, Basket
        ├── screens/
        │   ├── homePage/              index + Statistics, PopularDishes, NewDishes, Advertisement, ActiveUsers, Events (+ slice/selector)
        │   ├── productsPage/          index (nested router) + Products, ChosenProduct (+ slice/selector)
        │   ├── ordersPage/            index (tabs) + PausedOrders, ProcessOrders, FinishedOrders (+ slice/selector)
        │   ├── userPage/              index + Settings
        │   ├── helpPage/              index (TERMS/FAQ/CONTACT tabs, static data)
        │   └── Test.tsx               unused scratch screen, not routed
        └── services/                  MemberService, ProductService, OrderService (axios wrappers)
    └── lib/
        ├── config.ts                  serverApi, Messages
        ├── sweetAlert.ts
        ├── enums/                     member, order, product, view — mirror backend enums 1:1 in shape
        ├── types/                     member, order, product, search, screen, common
        └── data/                      faq.ts, plans.ts, terms.ts — static marketing copy
```

### 1.2 Real tech stack (from config files, not guesses)

| Concern | What's actually used | Evidence |
|---|---|---|
| Framework | **Create React App** (`react-scripts` 5.0.0) — not Vite, not Next.js | `package.json` scripts (`react-scripts start/build/test`), no `vite.config.*`, no `next.config.*` |
| Language | TypeScript ~4.1.5, `strict: true` | `tsconfig.json` |
| Router | **react-router-dom v5** (`Switch`/`Route`/`useHistory`/`useRouteMatch`, not v6's `Routes`/`useNavigate`) | `package.json` (`"react-router-dom": "^5.1.9"`, `@types/react-router-dom: "5"`), usage throughout `App.tsx`, `productsPage/index.tsx` |
| State management | **Redux Toolkit** (`@reduxjs/toolkit` 1.9.7, `react-redux` 8.1.3) per-screen slices (`homePage/slice.ts`, `productsPage/slice.ts`, `ordersPage/slice.ts`) + `reselect` selectors, **plus** a separate React Context (`ContextProvider.tsx`) for auth member / order-refresh trigger, **plus** raw `localStorage` for persisting `memberData` and `cartData`. Three different state mechanisms coexist by design (global slices for server data, context for cross-cutting auth state, localStorage for persistence). | `store.ts`, `context/ContextProvider.tsx`, `hooks/useBasket.ts` |
| API client | **Plain axios** (`axios` 0.27.2) — no React Query/SWR, no codegen | `services/*.ts` |
| API style | **REST only.** No GraphQL/Apollo anywhere. | `grep` for `graphql`/`apollo` in `package.json`/source: no matches. All service calls use `axios.get`/`axios.post` against REST paths. **No mismatch with the backend here** — both sides agree on REST. |
| UI kit | Mixed: MUI v7 (`@mui/material`), MUI Joy (`@mui/joy`, homepage cards), MUI Lab (`@mui/lab`, tab panels), **and** the legacy `@material-ui/core` v4 (used only in `components/auth/index.tsx` for its `makeStyles`/`Modal`/`Backdrop`/`Fade`) — two generations of MUI installed side by side | `package.json` deps; `components/auth/index.tsx` imports from `@material-ui/core/styles` while everything else imports from `@mui/material` |
| Styling | `styled-components` (one usage, in the auth modal) + hand-written CSS per page/section, imported directly into components (`import "../../../css/home.css"` etc.) — no CSS modules, no Tailwind | `src/css/*.css`, scattered `import ".../css/*.css"` lines |
| Other notable deps | `swiper` (image/event carousels), `sweetalert2` (`lib/sweetAlert.ts`, all user-facing error/success toasts), `moment` (date formatting in orders), `universal-cookie` (reads the `accessToken` cookie set by the backend's JWT auth) | |
| Testing | CRA default Jest + Testing Library, but only the untouched boilerplate `App.test.tsx` exists (imports the old CRA "learn react" text — will fail as-is against current `App.tsx`) | `src/app/App.test.tsx` |

**No GraphQL/Apollo usage found anywhere** — confirmed consistent with the backend being REST-only.

---

## 2. API Contract Check — against the current (renamed) backend

Cross-checked every `axios` call in `src/app/services/*.ts` and every enum in `src/lib/enums/*.ts` against the routes/enums documented as current in VENTURO_AUDIT.md.

### 2.1 Route-by-route

| Frontend call | File:line | Backend route it hits | Match? |
|---|---|---|---|
| `GET /member/top-users` | `MemberService.ts:14` | `/member/top-users` | ✅ |
| `GET /member/restaurant` | `MemberService.ts:27` | `/member/restaurant` | ✅ |
| `POST /member/signup` | `MemberService.ts:41` | `/member/signup` | ✅ |
| `POST /member/login` | `MemberService.ts:56` | `/member/login` | ✅ |
| `POST /member/logout` | `MemberService.ts:72` | `/member/logout` | ✅ |
| `POST /member/update` | `MemberService.ts:91` | `/member/update` | ✅ (multipart form, matches backend's single `memberImage` upload) |
| — | — | `/member/detail` | ⚠️ **Never called anywhere in this frontend.** `MemberService` has no `getMemberDetail`-style method, and no screen fetches the current member's own detail record from the server — the "auth member" the UI displays is only ever what was returned from signup/login/update and cached in `localStorage`/context. Not a breakage (nothing calls a wrong URL), just an unused backend capability. |
| `GET /product/all?...` | `ProductService.ts:14` | `/product/all` | ✅ query params (`order`, `page`, `limit`, `productCollection`, `search`) look backend-compatible in shape |
| `GET /product/:id` | `ProductService.ts:31` | `/product/:id` | ✅ |
| `POST /order/create` | `OrderService.ts:28` | `/order/create` | ✅ payload shape (`OrderItemInput[]`) matches `OrderItem` schema fields |
| `GET /order/all?...` | `OrderService.ts:43` | `/order/all` | ✅ |
| `POST /order/update` | `OrderService.ts:58` | `/order/update` | ✅ |

**Endpoint paths themselves are 100% aligned with the current backend.** The mismatches are entirely in the *enum values* sent to/expected from those endpoints — see below.

### 2.2 `MemberType` — flagged mismatch

**`src/lib/enums/member.enum.ts:3`**
```ts
export enum MemberType {
    USER = "USER",
    RESTAURANT = "RESTAURANT",   // ← backend renamed this to ADMIN
}
```
Backend (per VENTURO_AUDIT.md) now uses `USER, ADMIN`. This frontend still defines and actively branches on `RESTAURANT`:

- `src/app/screens/ordersPage/index.tsx:113` — `authMember?.memberType === MemberType.RESTAURANT ? "/icons/restaurant.svg" : "/icons/user-badge.svg"`
- `src/app/screens/userPage/index.tsx:50` — identical badge-icon branch

**Effect:** once the backend only ever issues `memberType: "ADMIN"`, both of these checks become permanently `false` — every account (including the restaurant/admin account) would show the generic user badge instead of the admin badge. Not a hard crash, but a silent UI regression. Also, `component/auth/index.tsx`'s `MemberInput` never explicitly sets `memberType`, so this is only read, not written, by the frontend — no signup path forces the stale value onto the backend.

### 2.3 `ProductCollection` — flagged mismatch (pervasive)

**`src/lib/enums/product.enum.ts:22-28`**
```ts
export enum ProductCollection {
    DISH = "DISH",
    SALAD = "SALAD",
    DESSERT = "DESSERT",
    DRINK = "DRINK",
    OTHER = "OTHER"
}
```
Backend now uses `CLIMBING, CAMPING, HIKING, TREKKING, CYCLING, APPAREL, FOOTWEAR, OTHER`. Only `OTHER` survives the rename; every other value is stale food terminology, and it is used **throughout the product-browsing flow**, not just cosmetically:

- `src/app/screens/homePage/index.tsx:38` — initial "Popular Dishes" fetch is filtered by `productCollection: ProductCollection.DISH`
- `src/app/screens/productsPage/Products.tsx:52` — default product-search state filters on `ProductCollection.DISH`
- `src/app/screens/productsPage/Products.tsx:190-243` — the entire category sidebar is five buttons hardcoded to `DISH / SALAD / DRINK / DESSERT / OTHER`
- `src/app/screens/homePage/NewDishes.tsx:39` — branches display logic on `ProductCollection.DRINK`
- `src/app/screens/productsPage/Products.tsx:252` — same `DRINK` branch, second copy

**Effect:** with the backend's `ProductCollection` enum now `CLIMBING/CAMPING/.../FOOTWEAR/OTHER`, sending `productCollection=DISH` (or any of the other four) to `GET /product/all` will not match any real product — the homepage's "Popular Dishes" query, and every category-tab click except (coincidentally) `OTHER`, would return an empty result set against the live backend today.

### 2.4 `ProductVolume` — flagged mismatch (dead backend field)

**`src/lib/enums/product.enum.ts:8-14`** still defines `ProductVolume` (`HALF/ONE/ONE_POINT_TWO/ONE_POINT_FIVE/TWO`), and:

- `src/lib/types/product.ts:1,11` — `Product.productVolume?: ProductVolume` is still part of the shared `Product` interface
- `src/app/screens/productsPage/Products.tsx:251-254` — branches display text on it: `product.productCollection === ProductCollection.DRINK ? product.productVolume + " litr" : product.productSize + " size"`
- `src/app/screens/homePage/NewDishes.tsx:39` — identical branch, second copy

Per VENTURO_AUDIT.md, `ProductVolume` no longer exists on the backend at all. Since the field is optional (`productVolume?`) and only read (never sent in a request payload), this won't cause a request to fail — but any product returned by the current backend will simply have `productVolume === undefined`, and because the `DRINK` branch of the ternary is itself unreachable (see 2.3, `ProductCollection.DRINK` no longer exists backend-side), this code path is now fully dead in both directions.

### 2.5 Fields that *do* still line up

`Member`, `Order`, `OrderItem` interfaces (`src/lib/types/member.ts`, `order.ts`) match the backend's current field names 1:1 (`memberNick`, `memberPhone`, `memberPoints`, `orderTotal`, `orderDelivery`, `orderStatus`, `itemQuantity`, `itemPrice`, etc.) — the rename evidently touched only the `MemberType`/`ProductCollection` enum *values* and dropped `ProductVolume`, not the surrounding schema field names, and the frontend's field names were never touched to begin with, so they still agree.

---

## 3. Visual/Content State

### 3.1 Domain content: 100% food/restaurant, zero hiking/outdoor-gear content

This frontend has had **no adaptation whatsoever** toward the hiking/outdoor-gear design. Every static asset, copy string, and layout is Turkish-restaurant-branded:

- Product images referenced in static data / used in fetched cards: `kebab.webp`, `kebab-fresh.webp`, `doner.webp`, `lavash.webp`, `cutlet.webp`, `gurme.webp`, `seafood.webp`, `sweets.webp` (public/img/)
- Category tabs are literally `DISH / SALAD / DRINK / DESERT / OTHER` (`Products.tsx:196-242`)
- Homepage hero copy: `"World's Most Delicious Cousine"`, `"The Choice, not just a choice"`, `"24 hours service"` (`HomeNavbar.tsx:161-163`)
- Homepage stats: `"Restaurants: 12"`, `"Menu: 50+"` (`Statistics.tsx:12,26`)
- Footer / brand copy explicitly names the real restaurant chain: `"...society, CZN Burak Gurme aims to bring Turkish cuisine back. CZN Burak Gurme creates an illusion with its cuisine."` (`components/footer/index.tsx:27-28`)
- FAQ/terms static copy (`lib/data/faq.ts`, `terms.ts`) talks about "order," "delivery," "basket" in generic-enough terms that they'd mostly survive a re-theme, but `lib/data/plans.ts` events copy is food-specific (`"Hot Discount Days"`, `"Chef Deming"`, `"New Restaurant is opening in Florida"`)
- Browser tab title and PWA manifest name are literally `"Burak"` (`public/index.html:27`, `public/manifest.json:2`)

### 3.2 "burak" / "venturo" search (mirroring the backend audit's method)

**"burak" (case-insensitive) — 8 matches, all still live/rendered, none are dead template cruft:**

| File:line | Context |
|---|---|
| `public/index.html:27` | `<title>Burak</title>` — literal browser tab title |
| `public/manifest.json:2` | `"name": "Burak"` — PWA app name |
| `src/app/components/headers/HomeNavbar.tsx:48` | `<img className="brand-logo" src="/icons/burak.svg" />` |
| `src/app/components/headers/OtherNavbar.tsx:54` | same brand-logo image, non-home pages |
| `src/app/components/footer/index.tsx:23` | `<img ... src={"/icons/burak.svg"} />` |
| `src/app/components/footer/index.tsx:27-28` | "CZN Burak Gurme" descriptive paragraph (two-line span, quoted above) |
| `src/app/screens/homePage/Advertisement.tsx:14` | `<source type="video/mp4" src="video/burak-ads.mp4" />` |
| `src/app/screens/productsPage/Products.tsx:115` | `<Typography className="products-title">Burak Restaurant</Typography>` |

Unlike the backend (where "Burak" survived only as one stale `<title>` tag amid an otherwise-renamed codebase), here "Burak" is the **active, intentional brand** across logo assets, page titles, marketing copy, and video ads — this frontend was never touched by the rename effort at all.

**"venturo" (case-insensitive) — 0 matches anywhere** in `src/`, `public/`, `package.json`, or `README.md`. Confirms the rename that reached the backend's `package.json`/`package-lock.json` never touched this repository in any form.

### 3.3 Page-by-page build state vs. the hiking/outdoor-gear target design

| Page | State | Notes |
|---|---|---|
| **Homepage** (`screens/homePage/`) | Fully built and styled — **wrong domain content** | Statistics, Popular Dishes, New Dishes, Advertisement (video ad), Active Users, Events carousel — all wired to live data where applicable, all food-themed copy/imagery. No resemblance to a hiking/outdoor storefront homepage. |
| **Category grid / product listing** (`screens/productsPage/Products.tsx`) | Fully built and styled — **wrong domain content + broken filters** | Grid layout, search box, sort buttons (NEW/PRICE/VIEWS), category sidebar, pagination all present and functional against a REST backend — but the category sidebar's five buttons are the stale food enum (2.3), so filtering is broken against the current backend regardless of re-theming. |
| **Product detail** (`screens/productsPage/ChosenProduct.tsx`) | Fully built and styled — **wrong domain content** | Image swiper/gallery, rating stub (hardcoded `defaultValue={2.5}`, not wired to any backend rating field — `Product` has no rating field at all), description, price, "Add To Basket." Structurally close to a generic e-commerce PDP; would need re-theming, not rebuilding. |
| **Cart** | **No dedicated cart page** — implemented as a dropdown menu (`components/headers/Basket.tsx`) opened from the navbar cart icon | Shows line items, +/-/delete controls, running total with flat delivery-fee logic (`< 100 → $5, else $0`, mirroring the backend's `OrderService.createOrder` rule), and an "Order" button that immediately calls `POST /order/create`. There is no full-page or route-based cart view (no `/cart` route in `App.tsx`). |
| **Checkout** | **Not present as a distinct step** | Basket's "Order" button *is* the checkout action — no address form, no payment step. `ordersPage/index.tsx` renders decorative, non-functional card-number/expiry/CVV `<input>` fields (`lines 136-157`) with no state, no validation, no submit handler — pure static UI dressing, not a real payment form. |
| **Login/Signup** (`components/auth/index.tsx`) | Fully built — modal-based, not page-based | Two `@material-ui/core` `Modal`s (signup/login) triggered from the navbar, calling `MemberService.signup`/`.login`. Functionally complete (client-side required-field check, Enter-to-submit, error toasts via `sweetalert2`) but has **no restyle risk assessment needed** since it's mostly form fields + one shared background image (`img/auth.webp`, food-styled). |
| **Account / order history** (`screens/ordersPage/`, `screens/userPage/`) | Fully built and styled — **wrong domain content in places, but structurally generic** | Tabbed Paused/Process/Finished orders, per-item breakdown, "Verify to Fulfil" status-advance action (`ProcessOrders.tsx`), Settings form for profile editing with image upload (`userPage/Settings.tsx`). Structurally this is close to what a generic order-history page needs regardless of product domain. |
| **Help page** (`screens/helpPage/`) | Fully built | TERMS/FAQ/CONTACT tabs, static copy mostly domain-neutral enough to reuse, contact form is non-functional (`action="#"`, no submit handler). |

**Overall visual verdict:** every page in the hiking/outdoor design brief (homepage, category grid, product listing, product detail, cart, checkout, login/signup) has a corresponding screen here that is **built and styled**, not stub-only — but every one of them is skinned for a Turkish restaurant, and there is no partial/mixed page (no page is "half-built" — it's either fully food-themed or, for cart/checkout, a UI pattern that doesn't match the brief's implied page-per-step structure at all).

---

## 4. Completion State

| Feature area | State | Notes |
|---|---|---|
| **Auth (signup/login/logout)** | Fully implemented | JWT-cookie flow via `axios(..., {withCredentials: true})`, matches backend's cookie-based auth exactly. Client-side required-field validation only (no password strength/format rules). `MemberType` is never sent by the frontend on signup, so backend defaults apply — no risk from the stale `RESTAURANT` enum value on the write path (see 2.2). |
| **Product browsing (list/search/filter/detail)** | Partially implemented (structurally complete, contract-broken) | Search, sort, pagination, and detail view all call the right endpoints with the right shapes — but collection filtering sends stale enum values (2.3) that won't match any current-backend product, and the `DRINK`-vs-size display branch (2.3, 2.4) is dead code against the new schema. View-count increment on detail load relies on `retrieveAuth`/cookie exactly as the backend expects. |
| **Cart** | Fully implemented, as a dropdown-menu pattern rather than a page | Add/remove/delete/clear, localStorage-persisted (`useBasket.ts`), live total with delivery-fee calculation mirroring backend logic. No `/cart` route exists — this is a deliberate UI pattern (menu, not page), worth flagging if the target design expects a dedicated cart page. |
| **Checkout** | Not present as a distinct flow | "Order" button in the basket dropdown calls `POST /order/create` directly — no address entry, no payment collection (the "card" fields on the orders page are static decoration, not a checkout form), no order review/confirmation step before submission. |
| **Account / order history** | Fully implemented | Tabbed order lifecycle view (Paused/Process/Finished) backed by `GET /order/all`, status-advance action backed by `POST /order/update`, profile editing (nickname/phone/address/desc/image) backed by `POST /member/update` with multipart image upload. All match the backend contract field-for-field (2.5). |

### 4.1 Things that look broken or inconsistent (independent of the enum mismatches above)

1. **Two MUI generations installed and used simultaneously** — `@material-ui/core` v4 (legacy) only in `components/auth/index.tsx`, everything else on `@mui/material` v7/`@mui/joy`/`@mui/lab`. Functions today, but is dead weight / inconsistency that would need resolving in any serious refactor.
2. **`App.test.tsx`** is untouched CRA boilerplate (`screen.getByText(/learn react/i)`) — will fail if run; not representative of the app's actual content. No other test files exist anywhere in `src/`.
3. **`screens/Test.tsx`** — an unrouted scratch screen, not referenced by `App.tsx`'s `<Switch>` or anywhere else. Leftover, harmless.
4. **`ContextProvider.tsx:5`** — `import exp from "constants";` is an unused, accidental import (Node's built-in `constants` module, almost certainly an editor auto-import mistake) with no effect on behavior but is dead code.
5. **`ordersPage/index.tsx:136-157`** — the payment-card `<input>` fields have no `value`/`onChange`/form state at all; they are purely decorative and would silently do nothing if a user tried to "pay" with them.
6. **`helpPage/index.tsx`** contact form (`action={"#"}`, `method={"POST"}`) has no `onSubmit` handler — clicking "Send" does a full-page GET/POST to `#`, i.e., effectively a no-op page reload.
7. **`ChosenProduct.tsx:97`** — star rating (`<Rating defaultValue={2.5} />`) is hardcoded and not backed by any field on the `Product` model (there is no rating field on the backend or in `lib/types/product.ts`) — purely decorative, not wired to real data.
8. **Stale/unused REST capability**: no screen calls `GET /member/detail` — the frontend re-derives "current user" purely from what signup/login/update last returned, cached client-side. Not broken, but means the frontend never re-syncs member state with the server on page load/refresh beyond what's in `localStorage`.
9. **`build/`** directory (a stale production build) is committed to the repo working directory — not gitignored per `.gitignore`... actually worth a quick note that it exists on disk; not counted as source-of-truth but flagged as repo clutter.

---

## 5. Frontend Route Map (`src/app/App.tsx` `<Switch>`)

| Route | Component | Auth-gated? |
|---|---|---|
| `/` | `HomePage` | No |
| `/products` | `ProductsPage` → `Products` (list) | No |
| `/products/:productsId` | `ProductsPage` → `ChosenProduct` (detail) | No (uses `retrieveAuth`-style optional auth on the backend call) |
| `/orders` | `OrdersPage` | Yes — `if (!authMember) history.push("/")` |
| `/member-page` | `UserPage` (profile settings) | Yes — same client-side redirect pattern |
| `/help` | `HelpPage` | No |
| *(no `/cart` or `/checkout` route — see Section 3.3/4)* | | |

Primary customer flow as actually wired: `/` (browse popular/new dishes) → `/products` (search/filter/paginate) → `/products/:id` (detail, add to basket) → basket dropdown (review, "Order" = immediate checkout) → `/orders` (post-order tracking, redirected here automatically after `POST /order/create`) → `/member-page` (profile editing). Login/signup happen via modal from any page, not a route.

---

## Reuse vs. Rebuild

**Structurally, this is a strong asset — the API/data layer is closer to the target than it first appears.** The stack (CRA + TS + Redux Toolkit + react-router v5 + axios REST client) is coherent, every backend route is called correctly, every response/request field name still matches the backend's current schema, and the page inventory already covers homepage, category grid, product listing, product detail, cart-equivalent, and account/order-history end to end with real, working business logic (order lifecycle, delivery-fee calc, image upload, cookie-based auth) — not stubs. The three contract breaks (`MemberType.RESTAURANT`→`ADMIN`, five stale `ProductCollection` values→eight outdoor-gear values, and the now-nonexistent `ProductVolume`) are **narrow and mechanical**: they live in four enum/type files and roughly a dozen call sites, all found and listed above — this is a find-and-replace-plus-UI-copy problem, not an architectural one.

**Visually and content-wise, the gap to the hiking/outdoor design is total**, but that is a *styling and copy* problem layered on top of a sound structural skeleton, not evidence the skeleton is wrong. Every screen the design brief calls for already exists as a real, data-wired component — none would need to be built from scratch, all would need to be re-skinned (new imagery, new copy, new CSS, and — per Section 3.3 — a decision about whether to introduce a real cart/checkout page-flow instead of the current dropdown-and-immediate-order pattern, since that's a UX-shape gap the design brief may expect resolved, not just a re-theme).

**Recommendation: rename-and-fix in place, the same way the backend was handled** — not a fresh `venturo-react` project. The rework is: (1) fix the four enum/type files and their ~12 call sites for the contract breaks, (2) swap image/copy assets and CSS for the outdoor-gear theme, (3) decide and implement a real cart/checkout page-flow if the design brief requires one, (4) resolve the `@material-ui/core` v4 vs `@mui/material` v7 duplication while touching the auth modal anyway, (5) drop the dead `screens/Test.tsx`, the unused `import exp from "constants"`, and update the CRA boilerplate test. None of this requires re-architecting routing, state management, or the API layer — those are already correct. A fresh rebuild would be discarding a working, backend-compatible data/business-logic layer to solve what is fundamentally a re-skin plus a handful of targeted fixes.
