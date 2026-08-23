# Venturo-React — Agent Instructions

## What this project is
Venturo-react is the customer-facing storefront for Venturo, an adventure/
outdoor-equipment e-commerce site. It was renamed and migrated in place
from a Create React App called "burak-react" — same codebase, different
business domain. Full migration findings live in BURAK_REACT_AUDIT.md;
treat that as historical ground truth, not this file.

## Stack
- Create React App (react-scripts 5) + TypeScript — CRA was deprecated by
  the React team in Feb 2025. We're staying on it deliberately for now
  rather than migrating frameworks mid-project; don't propose a framework
  migration unprompted.
- react-router-dom v5, Redux Toolkit + Context, axios (plain REST, no
  GraphQL)
- Both @material-ui/core v4 and @mui/material v7 are installed side by
  side (known legacy leftover) — don't "clean it up" unprompted
- Talks to the venturo backend (separate repo) via REACT_APP_API_URL

## Current state (don't assume this is done)
- Data/API contract is fixed to match the current backend (MemberType,
  ProductCollection, ProductVolume all updated)
- Visual design has NOT been rebuilt — every page is still styled for the
  old Turkish-restaurant theme. Target design is the HikMali Figma file
  (hiking/outdoor e-commerce UI kit)
- Some Burak assets (logo, ad video) are still referenced — no Venturo
  replacement exists yet. Don't delete those references without a
  replacement, it'll break the build.

## Rules for this repo
- Don't bump major dependency versions unless something is actually
  broken. Report exactly what forced it before continuing.
- Run `npx tsc --noEmit && npm run build` after any change.
- Always report the exact file list from `git status --short`, not a
  paraphrase.