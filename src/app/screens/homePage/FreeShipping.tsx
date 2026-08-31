import React from "react";
import { Box } from "@mui/material";

/**
 * Free Shipping — Figma "HikMali" node 2018:1391 (mobile counterpart
 * 2429:101). A 4-item trust-badge strip. None of the four labels claim a
 * specific verifiable fact (no delivery-day count, no named payment
 * provider, no support phone/hours) — generic e-commerce trust-badge
 * copy, same category as static marketing headings kept elsewhere, so no
 * backend check applies here. Icons are real exported SVGs (not
 * unexported AdobeStock placeholders), downloaded and saved locally
 * rather than linked from Figma's temporary asset CDN.
 */
const ITEMS = [
  { icon: "/icons/fs-shipping.svg", lines: ["Free", "Shipping"] },
  { icon: "/icons/fs-payment.svg", lines: ["100% Secure", "Payment"] },
  { icon: "/icons/fs-support.svg", lines: ["24x7", "Customer Service"] },
  { icon: "/icons/fs-returns.svg", lines: ["Free &", "Easy Returns"] },
];

export default function FreeShipping() {
  return (
    <div className={"free-shipping"}>
      <Box className={"fs-inner"}>
        {ITEMS.map((item) => (
          <Box key={item.icon} className={"fs-item"}>
            <img src={item.icon} alt={""} className={"fs-icon"} />
            <span className={"fs-label"}>
              {item.lines.map((line) => (
                <React.Fragment key={line}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </span>
          </Box>
        ))}
      </Box>
    </div>
  );
}
