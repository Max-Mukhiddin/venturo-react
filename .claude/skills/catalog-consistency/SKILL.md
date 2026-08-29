---
name: catalog-consistency
description: Review Venturo-react's product-related pages for consistency with the current backend schema and API contract.
---

Focus on:

- productCollection/productSize values matching the backend's current
  enums exactly
- Real backend data replacing hardcoded or placeholder values (price,
  rating, review count, images)
- Sort/pagination controls matching what the backend actually supports

Do NOT:

- Build UI for filters the backend doesn't support (e.g. price range —
  confirmed unsupported)
- Fix anything during a review-only pass — report findings only