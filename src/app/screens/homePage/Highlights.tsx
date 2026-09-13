import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import ProductService from "../../services/ProductService";
import { serverApi } from "../../../lib/config";

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
 * The card itself was missing its product photo entirely (name/desc/
 * button only) — a real gap confirmed against the actual HikMali
 * reference theme, where this card shows the product image the same way
 * every other product card on the page does. Added `hl-card-media`
 * using the identical fixed-height + object-fit: cover treatment as
 * Best Products/Deals Of The Day/Product Details this session — image
 * dominant above a compact name/button footer, not the hover-reveal
 * overlay those two grid sections use (this is a single hero card, not
 * a repeating row, and the reference shows the caption always visible).
 */
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
      <Box
        className={"hl-media"}
        style={{ backgroundImage: "url(/img/highlights.jpg)" }}
      />

      <span className={"hl-heading"}>Highlights</span>

      <Container className={"hl-inner"}>
        {product ? (
          <article className={"hl-card"}>
            <Box className={"hl-card-media"}>
              <img
                src={
                  product.productImages[0]
                    ? `${serverApi}/${product.productImages[0]}`
                    : "/icons/noimage-list.svg"
                }
                alt={product.productName}
              />
            </Box>
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
