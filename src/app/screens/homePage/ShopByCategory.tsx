import React from "react";
import { Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { ProductCollection } from "../../../lib/enums/product.enum";

/**
 * Shop by Category — Figma "HikMali" node 2479:1302.
 *
 * The design's labels are marketing copy rather than real
 * ProductCollection values, so each card is mapped to the backend enum it
 * actually represents. ("Terkking" in the design is a typo — corrected.)
 *
 * The design also shows a hardcoded item count under each name (24, 61,
 * 53, 12, 26). Those are invented mockup numbers and the backend has no
 * total-count support, so they are deliberately omitted rather than
 * shipping fabricated figures — see docs/ai/NEXT_STEPS.md.
 *
 * Cards link to /products?productCollection=<value>, which Products.tsx
 * now reads on mount (see parseInitialProductSearch there) — previously
 * this was a bare /products link that landed unfiltered regardless of
 * which tile was clicked.
 *
 * Card photos are real, sourced from Unsplash's Search API (photographer
 * credits + license in docs/ai/COMPLETED_TASKS.md, backend repo), same
 * pipeline as the hero. The label sits below the media as a plain caption
 * on the section's white background — confirmed against both this markup
 * and the real Figma node (label y=1678 vs. the media block's own bottom
 * edge at y=1642) — not an overlay, so no legibility risk from the photo.
 */
const CATEGORIES: { label: string; collection: ProductCollection; image: string }[] = [
  { label: "Climbing", collection: ProductCollection.CLIMBING, image: "/img/category-climbing.jpg" },
  { label: "All Brand Tenting", collection: ProductCollection.CAMPING, image: "/img/category-camping.jpg" },
  { label: "Warm & Cool Jacket", collection: ProductCollection.APPAREL, image: "/img/category-apparel.jpg" },
  { label: "Hiking Shoes", collection: ProductCollection.FOOTWEAR, image: "/img/category-footwear.jpg" },
  { label: "Trekking", collection: ProductCollection.TREKKING, image: "/img/category-trekking.jpg" },
];

export default function ShopByCategory() {
  return (
    <div className={"shop-by-category"}>
      <Container className={"sbc-inner"}>
        <h2 className={"sbc-title"}>Shop by Category</h2>

        <Box className={"sbc-scroller"}>
          <Box className={"sbc-row"}>
            {CATEGORIES.map((category) => {
              return (
                <Link
                  key={category.collection}
                  to={`/products?productCollection=${category.collection}`}
                  className={"sbc-card"}
                >
                  <Box
                    className={"sbc-card-media"}
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <span className={"sbc-card-label"}>{category.label}</span>
                </Link>
              );
            })}
          </Box>
        </Box>
      </Container>
    </div>
  );
}
