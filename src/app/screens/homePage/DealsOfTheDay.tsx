import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import ProductService from "../../services/ProductService";

/**
 * Deals Of The day — Figma "HikMali" node 7:90 (mobile counterpart 7:149).
 *
 * The design pairs a countdown timer with a Lorem Ipsum paragraph over a
 * 4-product grid. Neither ships:
 *
 *   - Countdown: checked `Product.model.ts` and the rest of the backend
 *     schema directly — there is no expiry/sale-window/deal-end field
 *     anywhere. A live countdown would have to tick down to an invented
 *     end-time, the same class of problem as a fabricated discount badge.
 *     Raised to the user rather than guessed; decision was to omit the
 *     countdown entirely and keep a plain heading.
 *   - Body copy: confirmed literal, unedited Lorem Ipsum in the design
 *     context. Also absent from the mobile frame entirely, so it drops
 *     rather than being replaced with invented descriptive copy.
 *
 * The grid defaults to `order=averageRating` — Best Products already uses
 * `productViews` and Banner already covers `createdAt`/`productViews`, so
 * this keeps the section a distinct, real slice instead of duplicating one.
 * (`productLeftCount`, a plausible "almost sold out" reading of "deals," is
 * not in the backend's sortable-field whitelist, so it isn't a real option.)
 *
 * "20% Off" appears on 2 of the source's 4 cards and a price appears on
 * exactly 1 of its 2 mobile cards — inconsistent within the mockup itself.
 * No discount field exists either way, and the desktop frame (the primary
 * 1920 anchor) shows zero price on any of its 4 buttons, so both are
 * normalized to absent across all 4 cards rather than shipped inconsistently.
 */
export default function DealsOfTheDay(props: { onAdd: (item: CartItem) => void }) {
  const { onAdd } = props;
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const productService = new ProductService();
    productService
      .getProducts({ page: 1, limit: 4, order: "averageRating" })
      .then((data) => setProducts(data))
      .catch((err) => console.log("Error, DealsOfTheDay:", err));
  }, []);

  const addToCartHandler = (product: Product) => {
    onAdd({
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages[0] || "",
    });
  };

  return (
    <div className={"deals-of-the-day"}>
      <Container className={"dd-inner"}>
        <h2 className={"dd-title"}>Deals Of The Day</h2>

        <Box className={"dd-grid"}>
          {products.map((product: Product) => (
            <article key={product._id} className={"dd-card"}>
              <Box className={"dd-card-info"}>
                <span className={"dd-card-name"}>{product.productName}</span>
                {product.productDesc ? (
                  <span className={"dd-card-desc"}>{product.productDesc}</span>
                ) : null}
              </Box>

              <button
                type={"button"}
                className={"dd-add"}
                onClick={() => addToCartHandler(product)}
              >
                Add To Cart
              </button>
            </article>
          ))}
        </Box>
      </Container>
    </div>
  );
}
