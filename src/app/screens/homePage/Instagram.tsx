import React from "react";
import { Box } from "@mui/material";

/**
 * Instagram — Figma "HikMali" node 2481:1308 (mobile counterpart 7:152).
 *
 * Checked before building whether this implies a real social-feed
 * integration or product links: no Instagram/social API integration
 * exists anywhere in either repo, and the design node itself carries only
 * 6 flat, unexported AdobeStock placeholder rectangles — no captions, no
 * name/price text nodes like every real product-card section has. Pure
 * decorative lifestyle imagery. See docs/ai/NEXT_STEPS.md (backend repo)
 * for what a real integration would need later.
 *
 * Tiles are real photography, sourced from Unsplash's Search API
 * (photographer credits + license in docs/ai/COMPLETED_TASKS.md, backend
 * repo) — 6 separate searches for a varied lifestyle feel (gear detail,
 * friends, solo silhouette, campfire, trail coffee, summit), none
 * repeating a photographer or search term already used elsewhere on the
 * page. No text sits over these tiles (confirmed against both the source
 * and the live markup — no caption/heading elements here at all, unlike
 * every section with a legibility concern), so no contrast measurement
 * applies.
 */
const TILES = [
  { image: "/img/instagram-1.jpg", alt: "" },
  { image: "/img/instagram-2.jpg", alt: "" },
  { image: "/img/instagram-3.jpg", alt: "" },
  { image: "/img/instagram-4.jpg", alt: "" },
  { image: "/img/instagram-5.jpg", alt: "" },
  { image: "/img/instagram-6.jpg", alt: "" },
];

export default function Instagram() {
  return (
    <div className={"instagram-grid"}>
      {TILES.map((tile, index) => (
        <Box
          key={index}
          className={"ig-tile"}
          style={{ backgroundImage: `url(${tile.image})` }}
        />
      ))}
    </div>
  );
}
