import React from "react";
import { Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { useGlobals } from "../../hooks/useGlobals";
import { ProductCollection } from "../../../lib/enums/product.enum";

/**
 * Footer — Figma "HikMali" node 2012:455 (mobile counterpart 2012:1159).
 * Rendered globally in App.tsx, so this affects every page, not just home.
 *
 * Several pieces of the design (and of the pre-existing footer this
 * replaces) had no real backing and were resolved rather than fabricated:
 *
 *   - Newsletter signup: no email-capture endpoint exists anywhere in the
 *     backend. The form renders as designed but submits nowhere — no fake
 *     "Subscribed!" state. See docs/ai/NEXT_STEPS.md.
 *   - The design's "Shop" and "Learn" columns are literally identical
 *     content ("All Products / Care / Service / Trekking / Hiking"),
 *     confirmed on both the desktop and mobile nodes — not a one-off
 *     mockup slip. Consolidated to one real "Shop" column (All Products,
 *     Trekking, Hiking — deep-linked via the existing
 *     ?productCollection= support) and a trimmed "Help" column (Account,
 *     FAQs). "Care," "Service," "Wholesale," and "Sitemap" have no real
 *     destination anywhere in this app and are dropped.
 *   - Contact details: neither the new mock's "support@stereolabs.com" /
 *     "Location: India" nor the old footer's "devexuz@gmail.com" /
 *     Dubai address / "Devex Global" copyright are real Venturo values —
 *     the old ones are literally the template vendor's own identity.
 *     Dropped entirely; copyright is now a real, generic line.
 *
 * Social icons stay bare, unwrapped <img> (no href) — confirmed
 * decorative-only in the pre-existing footer, kept that way.
 */
export default function Footer() {
  const { authMember } = useGlobals();

  const scrollToTopHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const subscribeHandler = (event: React.FormEvent) => {
    event.preventDefault();
    // No email-capture endpoint exists yet — intentionally inert.
    // See docs/ai/NEXT_STEPS.md (backend repo).
  };

  return (
    <div className={"site-footer"}>
      <Container className={"sf-inner"}>
        <Box className={"sf-top"}>
          <Box className={"sf-brand-zone"}>
            <Link to={"/"} className={"footer-brand-lockup"}>
              <img
                className={"footer-brand-badge"}
                src={"/icons/venturo-badge-light.svg"}
                alt={"Venturo"}
              />
              <Box className={"footer-brand-text"}>
                <span className={"footer-brand-wordmark"}>VENTURO</span>
                <span className={"footer-brand-tagline"}>
                  ADVENTURE GEAR CO.
                </span>
              </Box>
            </Link>

            <span className={"sf-newsletter-heading"}>
              Sign up for 10% off your first order.
            </span>

            <form className={"sf-newsletter-form"} onSubmit={subscribeHandler}>
              <input
                type={"email"}
                placeholder={"enter email address"}
                className={"sf-email-input"}
              />
              <button type={"submit"} className={"sf-subscribe"}>
                <span>Subscribe</span>
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="16" height="12" rx="1.5" stroke="#f0f0f0" strokeWidth="1.2" />
                  <path d="M1.5 2L9 8L16.5 2" stroke="#f0f0f0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            <span className={"sf-follow-text"}>
              Follow us for unforgettable adventures!
            </span>
            <Box className={"sns-context"}>
              <img src={"/icons/facebook.svg"} alt={""} />
              <img src={"/icons/twitter.svg"} alt={""} />
              <img src={"/icons/instagram.svg"} alt={""} />
              <img src={"/icons/youtube.svg"} alt={""} />
            </Box>
          </Box>

          <Box className={"sf-nav-zone"}>
            <Box className={"sf-nav-col"}>
              <span className={"sf-nav-title"}>Shop</span>
              <Box className={"sf-nav-links"}>
                <Link to={"/products"}>All Products</Link>
                <Link
                  to={`/products?productCollection=${ProductCollection.TREKKING}`}
                >
                  Trekking
                </Link>
                <Link
                  to={`/products?productCollection=${ProductCollection.HIKING}`}
                >
                  Hiking
                </Link>
              </Box>
            </Box>

            <Box className={"sf-nav-col"}>
              <span className={"sf-nav-title"}>Help</span>
              <Box className={"sf-nav-links"}>
                {authMember ? (
                  <Link to={"/member-page"}>Account</Link>
                ) : null}
                <Link to={"/help"}>FAQs</Link>
              </Box>
            </Box>

            <button
              type={"button"}
              className={"sf-to-top"}
              onClick={scrollToTopHandler}
              aria-label={"Back to top"}
            >
              <img
                src={"/icons/arrow-right.svg"}
                alt={""}
                className={"sf-to-top-icon"}
              />
            </button>
          </Box>
        </Box>

        <Box className={"sf-divider"} />

        <Box className={"sf-bottom"}>
          <span className={"sf-copyright"}>
            © 2026 Venturo. All rights reserved.
          </span>
        </Box>
      </Container>
    </div>
  );
}
