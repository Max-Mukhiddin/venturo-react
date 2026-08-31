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
 * Both panel images are unexported AdobeStock placeholders in the design
 * (flat #d9d9d9 fills), same as every prior section — rendered as flat
 * panels, same established pattern.
 */
const PANELS = [
  { eyebrow: "Shop", heading: "New Arrivals", to: "/products?order=createdAt" },
  { eyebrow: "Shop", heading: "Best Sellers", to: "/products?order=productViews" },
];

export default function Banner() {
  return (
    <div className={"home-banner"}>
      <Container className={"hb-inner"}>
        <Box className={"hb-row"}>
          {PANELS.map((panel) => (
            <Link key={panel.heading} to={panel.to} className={"hb-panel"}>
              <Box className={"hb-panel-media"} />
              <Box className={"hb-panel-content"}>
                <Box className={"hb-panel-copy"}>
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
