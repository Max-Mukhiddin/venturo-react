# Next Steps — Venturo-React

This repo's own next-steps log — separate from the backend's
`../venturo/docs/ai/NEXT_STEPS.md`. Items are flagged during migration-plan
execution (see `docs/ai/COMPLETED_TASKS.md`) but explicitly deferred, not
fixed, at the time they were found.

## `CI=true npm run build` fails on pre-existing ESLint warnings

Plain `npm run build` succeeds (exit 0) and is what this repo's documented
workflow uses. But most CI platforms set `CI=true` automatically (per
Create React App's own behavior — "Treating warnings as errors because
process.env.CI = true"), which means **a real CI pipeline run against this
repo, as it stands today, would fail the build** — not a false alarm.
None of these were introduced by the Phase 0 session that found them; they
predate it. Flagging as a real deploy-time risk to resolve before this
repo is wired into any CI pipeline, not a cosmetic backlog item.

**65 warnings across 23 files**, verbatim from the `CI=true npm run build`
run:

### `src/app/App.tsx`
```
Line 3:10:   'Link' is defined but never used    @typescript-eslint/no-unused-vars
Line 3:23:   'Router' is defined but never used  @typescript-eslint/no-unused-vars
Line 21:10:  'T' is defined but never used       @typescript-eslint/no-unused-vars
```

### `src/app/MaterialTheme/index.ts`
```
Line 5:10:  'maxWidth' is defined but never used  @typescript-eslint/no-unused-vars
```

### `src/app/MaterialTheme/shadow.ts`
```
Line 1:1:  Assign array to a variable before exporting as module default  import/no-anonymous-default-export
```

### `src/app/MaterialTheme/typography.ts`
```
Line 1:1:  Assign object to a variable before exporting as module default  import/no-anonymous-default-export
```

### `src/app/components/footer/index.tsx`
```
Line 23:15:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 30:15:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 31:15:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 32:15:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 33:15:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
```

### `src/app/components/headers/Basket.tsx`
```
Line 84:11:   img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 150:21:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
```

### `src/app/components/headers/HomeNavbar.tsx`
```
Line 4:17:    'useEffect' is defined but never used                                                                  @typescript-eslint/no-unused-vars
Line 4:28:    'useState' is defined but never used                                                                   @typescript-eslint/no-unused-vars
Line 48:15:   img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 101:15:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 101:15:  The attribute aria-haspopup is not supported by the role img. This role is implicit on the element img  jsx-a11y/role-supports-aria-props
```

### `src/app/components/headers/OtherNavbar.tsx`
```
Line 39:5:    'setSignupOpen' is assigned a value but never used                                                      @typescript-eslint/no-unused-vars
Line 54:15:   img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 105:15:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 105:15:  The attribute aria-haspopup is not supported by the role img. This role is implicit on the element img  jsx-a11y/role-supports-aria-props
```

### `src/app/context/ContextProvider.tsx`
```
Line 5:8:  'exp' is defined but never used  @typescript-eslint/no-unused-vars
```
(This is the stray `import exp from "constants";` — an accidental editor
auto-import, already flagged in `BURAK_REACT_AUDIT.md` §4.1 item 4.)

### `src/app/screens/homePage/ActiveUsers.tsx`
```
Line 10:10:  'ProductCollection' is defined but never used  @typescript-eslint/no-unused-vars
```

### `src/app/screens/homePage/Events.tsx`
```
Line 38:19:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 46:27:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 55:27:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 59:27:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 71:11:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 76:11:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
```

### `src/app/screens/homePage/NewDishes.tsx`
```
Line 15:10:  'ProductCollection' is defined but never used  @typescript-eslint/no-unused-vars
```

### `src/app/screens/homePage/PopularDishes.tsx`
```
Line 16:10:  'ProductCollection' is defined but never used  @typescript-eslint/no-unused-vars
```

### `src/app/screens/homePage/index.tsx`
```
Line 59:6:  React Hook useEffect has missing dependencies: 'setNewDishes', 'setPopularDishes', and 'setTopUsers'. Either include them or remove the dependency array  react-hooks/exhaustive-deps
```

### `src/app/screens/ordersPage/FinishedOrders.tsx`
```
Line 3:8:    'Button' is defined but never used                                                                  @typescript-eslint/no-unused-vars
Line 5:8:    'moment' is defined but never used                                                                  @typescript-eslint/no-unused-vars
Line 36:23:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 40:25:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 42:25:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 87:15:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
```

### `src/app/screens/ordersPage/PausedOrders.tsx`
```
Line 104:23:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 108:25:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 110:25:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 124:19:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 127:19:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 162:15:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
```

### `src/app/screens/ordersPage/ProcessOrders.tsx`
```
Line 80:23:   img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 84:25:   img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 86:25:   img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 100:19:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 103:19:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 132:15:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
```

### `src/app/screens/ordersPage/index.tsx`
```
Line 36:24:   'setOrderInquiry' is assigned a value but never used                                                                                                        @typescript-eslint/no-unused-vars
Line 59:6:    React Hook useEffect has missing dependencies: 'setPausedOrders', 'setProccessOrders', and 'setTFinishedOrders'. Either include them or remove the dependency array  react-hooks/exhaustive-deps
Line 102:15:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images                                                   jsx-a11y/alt-text
```

### `src/app/screens/productsPage/ChosenProduct.tsx`
```
Line 64:6:   React Hook useEffect has missing dependencies: 'productsId', 'setChosenProduct', and 'setRestaurant'. Either include them or remove the dependency array  react-hooks/exhaustive-deps
Line 83:19:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images                                        jsx-a11y/alt-text
```

### `src/app/screens/productsPage/Products.tsx`
```
Line 5:3:     'Card' is defined but never used                                                                       @typescript-eslint/no-unused-vars
Line 21:10:   'setRestaurant' is defined but never used                                                              @typescript-eslint/no-unused-vars
Line 21:25:   'setChosenProduct' is defined but never used                                                           @typescript-eslint/no-unused-vars
Line 65:6:    React Hook useEffect has a missing dependency: 'setProducts'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
Line 414:13:  <iframe> elements must have a unique title property                                                    jsx-a11y/iframe-has-title
```

### `src/app/screens/productsPage/index.tsx`
```
Line 3:10:  'Container' is defined but never used  @typescript-eslint/no-unused-vars
```

### `src/app/screens/userPage/Settings.tsx`
```
Line 95:9:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
```

### `src/app/screens/userPage/index.tsx`
```
Line 39:19:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
Line 48:21:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text
```

**Breakdown by rule** (for judging severity/effort): 38 `jsx-a11y/alt-text`
(every `<img>` missing an `alt` prop — mechanical, same fix pattern
repeated), 15 `@typescript-eslint/no-unused-vars` (dead imports/vars —
mechanical), 5 `react-hooks/exhaustive-deps` (missing `useEffect`
dependencies — needs actual judgment per call site, not purely mechanical;
some are likely intentional "run once" effects where adding the deps would
change behavior, not just silence the linter), 2
`jsx-a11y/role-supports-aria-props` (both on the same repeated
`aria-haspopup` on an `<img>` in `HomeNavbar.tsx`/`OtherNavbar.tsx`), 2
`import/no-anonymous-default-export`, 1 `jsx-a11y/iframe-has-title`.

Not fixed as part of Phase 0 — out of that phase's scope (contract/config
fixes only). Worth a dedicated small cleanup pass before any CI pipeline
is wired up, separate from the phase-by-phase reskin work.

## Incidental bugs found during Phase 0's live verification, not fixed

1. **`ActiveUsers.tsx:30`** — `` `${serverApi}/${member.memberImage}` `` has
   no fallback when a member has no uploaded image, producing a request to
   `http://localhost:3005/undefined` that the browser blocks
   (`ERR_BLOCKED_BY_ORB`). `HomeNavbar.tsx` already has the right pattern
   (`memberImage ? ... : "/icons/default-user.svg"`) — `ActiveUsers.tsx`
   should adopt it. Belongs in Phase 1 (Homepage session).
