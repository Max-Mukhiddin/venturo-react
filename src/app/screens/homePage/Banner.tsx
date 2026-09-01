import React from "react";
import { Box, Container } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * Banner — Figma "HikMali" node 2479:1304 (mobile counterpart 7:147).
 *
 * The design is a two-panel "Shop All Women's / Shop All Men's" promo.
 * Venturo's Product schema has no gender/audience field at all — there is
 * no `/products?gender=women` to link to, and no way to query "women's
 * products" from the backend. Unlike Section 4's per-card flags, this
 * wasn't a missing field on an otherwise-real card; the section's whole
 * split axis had no backend counterpart, so it was raised and agreed
 * with the user before building rather than guessed: the two panels now
 * split on two real, already-used backend sort orders instead —
 * order=createdAt (New Arrivals, same query PopularDishes/NewDishes use
 * today) and order=productViews (Best Sellers, same query BestProducts
 * uses for its default listing).
 *
 * Both panels link to /products?order=<value>, which Products.tsx now
 * reads on mount (see parseInitialProductSearch there) — previously this
 * was a bare /products link, so both panels landed on the same default
 * view regardless of which was clicked.
 *
 * Both panel images were unexported AdobeStock placeholders in the
 * design (flat #d9d9d9 fills); replaced with real photography sourced
 * from Unsplash's Search API (photographer credits + license in
 * docs/ai/COMPLETED_TASKS.md, backend repo). `.hb-panel-content` sits as
 * a sibling positioned over `.hb-panel-media` (confirmed in home.css,
 * not assumed) — this is an overlay layout like the hero, not a
 * caption-below layout like Shop by Category.
 */
const PANELS = [
  {
    eyebrow: "Shop",
    heading: "New Arrivals",
    to: "/products?order=createdAt",
    image: "/img/banner-new-arrivals.jpg",
    // Measured (pixel-sampling contrast script, same as the hero) at all
    // 4 widths — background-size:cover recrops this photo differently
    // per breakpoint, so contrast isn't a single number: 3.90:1 (1920),
    // 3.04:1 (1536), 2.98:1 (1440), 4.00:1 (390) against this specific
    // photo's mid-toned/blurred-forest crop at each width. Needs a
    // scrim at every width. Tied to this photo specifically — if it's
    // ever swapped, re-measure rather than assuming this still applies.
    needsScrim: true,
    needsScrimMobile: false,
  },
  {
    eyebrow: "Shop",
    heading: "Best Sellers",
    to: "/products?order=productViews",
    image: "/img/banner-best-sellers.jpg",
    // Measured at all 4 widths, not just desktop: 4.92:1 at every
    // desktop width (bright-sky crop) — but the mobile crop centres on
    // a busier, warmer part of the same photo and measured 1.27:1,
    // badly failing. Same lesson as New Arrivals: cover recrops per
    // breakpoint, so a desktop-only measurement isn't sufficient. Scrim
    // needed below 900px only.
    needsScrim: false,
    needsScrimMobile: true,
  },
];

export default function Banner() {
  return (
    <div className={"home-banner"}>
      <Container className={"hb-inner"}>
        <Box className={"hb-row"}>
          {PANELS.map((panel) => (
            <Link key={panel.heading} to={panel.to} className={"hb-panel"}>
              <Box
                className={"hb-panel-media"}
                style={{ backgroundImage: `url(${panel.image})` }}
              />
              <Box className={"hb-panel-content"}>
                <Box
                  className={[
                    "hb-panel-copy",
                    panel.needsScrim ? "hb-panel-copy-scrim" : "",
                    panel.needsScrimMobile ? "hb-panel-copy-scrim-mobile" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className={"hb-panel-eyebrow"}>{panel.eyebrow}</span>
                  <span className={"hb-panel-heading"}>{panel.heading}</span>
                </Box>
                <span className={"hb-panel-cta"}>Shop Now</span>
              </Box>
            </Link>
          ))}
        </Box>
      </Container>
    </div>
  );
}
