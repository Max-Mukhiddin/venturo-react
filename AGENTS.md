Go outside of this project and read ../venturo/docs/ai first!

# Venturo Frontend Modification Instructions

This client project is being migrated from burak-react to venturo-react.

## Rules

- Preserve the current project architecture: Create React App
  (react-scripts 5), TypeScript, react-router-dom v5, Redux Toolkit +
  Context, axios
- Keep the plain REST API integration — this backend has no GraphQL
  layer; do not introduce Apollo or any GraphQL tooling
- Do not rewrite the whole app at once — one page per session
- Rebuild each page's UI with real intention, not a generic reskin — the
  specific visual reference and design direction will be given per-task,
  not assumed
- CRA was deprecated by the React team in Feb 2025 — we're staying on it
  deliberately for this project. Don't propose a framework migration
  unprompted
- Both @material-ui/core v4 and @mui/material v7 are installed side by
  side (a known legacy leftover) — don't "clean this up" unless asked
- Some Burak brand assets (logo, ad video) are still referenced in code
  because no Venturo replacement exists yet — don't delete those
  references without a real replacement, it will break the build
- This project uses npm exclusively (package-lock.json) — do not run
  yarn or yarn install, even if package.json or habit suggests otherwise

## Backend Context

Before making any changes, read (in the sibling venturo repo — if that
folder isn't already visible in this session, ask to have it added
rather than guessing at backend behavior):
- ../venturo/docs/ai/BACKEND_MIGRATION.md
- ../venturo/docs/ai/DECISIONS.md
- ../venturo/docs/ai/API_REFERENCE.md
- ../venturo/VENTURO_ER_MODEL.md
- and everything else inside ../venturo/docs/ai

## Workflow

1. Analyze before editing.
2. Backend is running on http://localhost:3005 — plain REST, no /graphql
   endpoint. Every route, method, and expected shape is documented in
   API_REFERENCE.md above.
3. Make small, incremental changes — one page per session.
4. Run npx tsc --noEmit and npm run build after each phase.
5. Do not remove working logic (Redux slices, the service layer, hooks
   like useBasket) unless replaced safely.
6. Update ../venturo/docs/ai/COMPLETED_TASKS.md after major changes.


