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
 * decorative lifestyle imagery, same flat-panel-fallback treatment
 * already used for Highlights' background and Banner's panels. See
 * docs/ai/NEXT_STEPS.md (backend repo) for what a real integration would
 * need later.
 */
const TILE_COUNT = 6;

export default function Instagram() {
  return (
    <div className={"instagram-grid"}>
      {Array.from({ length: TILE_COUNT }).map((_, index) => (
        <Box key={index} className={"ig-tile"} />
      ))}
    </div>
  );
}
