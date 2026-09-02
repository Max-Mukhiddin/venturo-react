import React from "react";
import { Link } from "react-router-dom";
import "../../../css/breadcrumb.css";

/**
 * Breadcrumb — Figma "HikMali" Shop List (`2458:2`) / Shop Detail
 * (`2461:881`) frames: a `#d9dbc5` band, 48px bold heading, and a
 * "Home | X" trail directly below the shared nav. Both frames use the
 * identical band/heading/trail structure, so this is one shared
 * component rather than duplicated markup per page.
 *
 * Figma's trail text is a plain string ("Home     |    Shop") with no
 * real links — here "Home" links to the real "/" route (same
 * real-route-over-decorative-mockup discipline `OtherNavbar` already
 * established) and the current page renders as plain text, not a link.
 *
 * Layout is normal document flow (trail above heading, gutter/content-max
 * container), not a literal copy of Figma's absolute pixel coordinates —
 * those don't survive translation to plain CSS as-is (Figma's text-box
 * trim metrics make its raw y-coordinates inconsistent with normal
 * line-height), and every other section in this rebuild took the same
 * approach.
 */
export interface BreadcrumbTrailItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  heading: string;
  trail: BreadcrumbTrailItem[];
}

export default function Breadcrumb({ heading, trail }: BreadcrumbProps) {
  return (
    <div className={"breadcrumb-band"}>
      <div className={"breadcrumb-inner"}>
        <nav className={"breadcrumb-trail"} aria-label={"Breadcrumb"}>
          {trail.map((item, index) => (
            <React.Fragment key={item.label}>
              {index > 0 ? <span className={"breadcrumb-sep"}>|</span> : null}
              {item.to ? (
                <Link to={item.to} className={"breadcrumb-link"}>
                  {item.label}
                </Link>
              ) : (
                <span className={"breadcrumb-current"}>{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
        <h1 className={"breadcrumb-heading"}>{heading}</h1>
      </div>
    </div>
  );
}
