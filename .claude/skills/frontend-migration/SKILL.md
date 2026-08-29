---
name: frontend-migration
description: Continue the Venturo-react frontend migration from Burak food-ordering UI to Venturo adventure-gear storefront, and HikMali visual-alignment work.
---

Focus on:

- Burak to Venturo domain migration (copy, terminology, branding)
- HikMali visual alignment work
- Preserving the existing CRA/TypeScript screen-and-service structure

Do NOT:

- Migrate frameworks (CRA stays, despite its Feb 2025 deprecation)
- Introduce GraphQL/Apollo — this backend is REST only
- Change the API contract without confirming
  ../venturo/docs/ai/API_REFERENCE.md first
- Blend functional fixes with visual re-theming in the same pass unless
  explicitly asked