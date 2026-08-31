import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import ProductService from "../../services/ProductService";

/**
 * Highlights — Figma "HikMali" node 7:61 (mobile counterpart 7:148, the
 * only mobile node sharing the same background asset name
 * `AdobeStock_505354052`).
 *
 * The source card (both desktop node 7:60 and the mobile node) has no
 * discount field and no price element at all — no `productPrice` shown
 * anywhere, unlike Best Products' hover-reveal price. Shipped as designed:
 * name + description + a plain "Add To Cart" button, nothing invented.
 * The "20% Off" badge has no backend counterpart (no discount field on
 * `Product`) and is dropped, same resolution as every prior card.
 *
 * The six "+" marker icons and the vertical tick decoration are purely
 * decorative in the source (no href, no hover state) and are hidden below
 * 900px, matching the confirmed mobile frame, which has neither them nor
 * the "Highlights" heading at all.
 */
const CROSS_POSITIONS = [
  { left: "calc(50% + 36px)", top: "168px" },
  { left: "calc(25% + 173px)", top: "185px" },
  { left: "calc(25% + 151px)", top: "390px" },
  { left: "calc(75% - 51px)", top: "434px" },
  { left: "calc(75% - 35px)", top: "708px" },
  { left: "calc(41.67% + 77px)", top: "604px" },
];

interface HighlightsProps {
  onAdd: (item: CartItem) => void;
}

export default function Highlights(props: HighlightsProps) {
  const { onAdd } = props;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const productService = new ProductService();
    productService
      .getProducts({ page: 1, limit: 1, order: "productViews" })
      .then((data) => setProduct(data[0] || null))
      .catch((err) => console.log("Error, Highlights:", err));
  }, []);

  const addToCartHandler = () => {
    if (!product) return;
    onAdd({
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages[0] || "",
    });
  };

  return (
    <div className={"highlights"}>
      <Box className={"hl-media"} />

      <span className={"hl-heading"}>Highlights</span>
      <span className={"hl-tick"} />

      {CROSS_POSITIONS.map((pos, index) => (
        <span
          key={index}
          className={"hl-cross"}
          style={{ left: pos.left, top: pos.top }}
        />
      ))}

      <Container className={"hl-inner"}>
        {product ? (
          <article className={"hl-card"}>
            <Box className={"hl-card-info"}>
              <span className={"hl-card-name"}>{product.productName}</span>
              {product.productDesc ? (
                <span className={"hl-card-desc"}>{product.productDesc}</span>
              ) : null}
            </Box>
            <button
              type={"button"}
              className={"hl-add"}
              onClick={addToCartHandler}
            >
              Add To Cart
            </button>
          </article>
        ) : null}
      </Container>
    </div>
  );
}
