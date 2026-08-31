import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { useHistory } from "react-router-dom";
import { Product } from "../../../lib/types/product";
import { CartItem } from "../../../lib/types/search";
import ProductService from "../../services/ProductService";
import { serverApi } from "../../../lib/config";

/**
 * Product Details — Figma "HikMali" node 7:140 (mobile counterpart 7:151).
 *
 * A full product-detail teaser. Several pieces have no backend equivalent
 * and are dropped, same discipline as every prior section:
 *
 *   - "Save 20% Off" and the struck-through "original" price — no
 *     discount field on `Product`, only a single `productPrice`.
 *   - The "S / M / L / XL" size *picker* — `ProductSize` is a single fixed
 *     value per product (`SMALL/NORMAL/LARGE/SET`), not a set of
 *     selectable variants. Same class of problem as the Model/colour
 *     swatches dropped in Sections 4 and 6: shown as an inert label of
 *     the product's real size instead of a fake selector.
 *   - The apparel-specific bullet list ("All-over print," "corozo
 *     buttons," etc.) — irrelevant to outdoor gear and no schema field.
 *   - "This is a demonstration store..." body copy and (mobile-only)
 *     "Together we will find the perfect that's our product." — generic
 *     filler, replaced with the real product's `productDesc`.
 *   - "Size Chart" / "Ask questions" accordion rows — no size-chart data
 *     or Q&A feature exists anywhere in the app. Dropped entirely rather
 *     than shipped as dead UI, same precedent as the hero's removed
 *     "next" slide control.
 *   - The decorative circular watermark read "ADVENTURE MOUNTAIN OUTDOOR
 *     ESTD 2021" in the source — a different, fake brand identity, not
 *     just missing data. Per user decision, replaced with the real
 *     Venturo badge (`venturo-badge.svg`, already used in the header).
 *
 * Thumbnails/main image map onto the real `productImages` array with the
 * same empty-image fallback used everywhere else. The mobile frame
 * (confirmed via `get_design_context`, not metadata) drops the product
 * title heading entirely — the section's only mobile instance, cleanly
 * absent everywhere, same shape as Highlights' desktop-only heading — so
 * it renders desktop-only here too. Featured product uses
 * `order=productPrice, sortDirection=DESC` (the highest-priced item) to
 * keep this a distinct real slice from every prior section's sort.
 */
export default function ProductDetails(props: { onAdd: (item: CartItem) => void }) {
  const { onAdd } = props;
  const history = useHistory();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const productService = new ProductService();
    productService
      .getProducts({ page: 1, limit: 1, order: "productPrice", sortDirection: "DESC" })
      .then((data) => setProduct(data[0] || null))
      .catch((err) => console.log("Error, ProductDetails:", err));
  }, []);

  if (!product) return null;

  const images = product.productImages;
  const mainImage = images[activeImage]
    ? `${serverApi}/${images[activeImage]}`
    : "/icons/noimage-list.svg";

  const addToCartHandler = () => {
    onAdd({
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages[0] || "",
    });
  };

  const buyNowHandler = () => {
    addToCartHandler();
    history.push("/checkout");
  };

  return (
    <div className={"product-details"}>
      <Container className={"pd-inner"}>
        <Box className={"pd-layout"}>
          <Box className={"pd-gallery"}>
            {images.length > 0 ? (
              <Box className={"pd-thumbs"}>
                {images.map((img, index) => (
                  <button
                    key={img + index}
                    type={"button"}
                    className={
                      index === activeImage ? "pd-thumb pd-thumb-active" : "pd-thumb"
                    }
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={`${serverApi}/${img}`} alt={`${product.productName} ${index + 1}`} />
                  </button>
                ))}
              </Box>
            ) : null}

            <Box className={"pd-main"}>
              <img src={mainImage} alt={product.productName} className={"pd-main-image"} />
              <img src={"/icons/venturo-badge.svg"} alt={""} className={"pd-badge"} />
            </Box>
          </Box>

          <Box className={"pd-content"}>
            <h2 className={"pd-title"}>{product.productName}</h2>

            <span className={"pd-price"}>${product.productPrice}</span>

            <Box className={"pd-divider"} />

            {product.productSize ? (
              <Box className={"pd-size-row"}>
                <span className={"pd-size-label"}>Size:</span>
                <span className={"pd-size-value"}>{product.productSize}</span>
              </Box>
            ) : null}

            <button type={"button"} className={"pd-add"} onClick={addToCartHandler}>
              Add To Cart
            </button>
            <button type={"button"} className={"pd-buy"} onClick={buyNowHandler}>
              Buy To Now
            </button>

            {product.productDesc ? (
              <p className={"pd-desc"}>{product.productDesc}</p>
            ) : null}
          </Box>
        </Box>
      </Container>
    </div>
  );
}
