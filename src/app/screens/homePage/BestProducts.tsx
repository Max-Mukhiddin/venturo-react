import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { Product } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { CartItem } from "../../../lib/types/search";
import ProductService from "../../services/ProductService";
import { serverApi } from "../../../lib/config";

/**
 * Best Products — Figma "HikMali" node 7:53.
 *
 * Renders real backend products. Three things in the mockup have no
 * counterpart on the `Product` schema and are deliberately NOT shipped
 * rather than fabricated (see docs/ai/NEXT_STEPS.md):
 *
 *   - the red "20% Off" badge — there is no discount/sale-price field
 *   - the "Model : Caracal Ashley Big Cat" row and the colour swatches
 *   - "Delivery At 7 days" — no delivery/lead-time field
 *
 * The design's filter row reads "Mountaineering | Camping | Hiking |
 * Trekking | Cycling | Gym". Mountaineering and Gym are not
 * ProductCollection values; Mountaineering maps to CLIMBING (a genuine
 * synonym here) and Gym is substituted with FOOTWEAR — a closer real
 * synonym than Apparel, and it surfaces a category this row would
 * otherwise omit entirely — so the row keeps the design's six-item
 * rhythm using only real enum values.
 */
const CATEGORY_FILTERS: { label: string; collection: ProductCollection }[] = [
  { label: "Climbing", collection: ProductCollection.CLIMBING },
  { label: "Camping", collection: ProductCollection.CAMPING },
  { label: "Hiking", collection: ProductCollection.HIKING },
  { label: "Trekking", collection: ProductCollection.TREKKING },
  { label: "Cycling", collection: ProductCollection.CYCLING },
  { label: "Footwear", collection: ProductCollection.FOOTWEAR },
];

interface BestProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function BestProducts(props: BestProductsProps) {
  const { onAdd } = props;
  // The design underlines the first filter by default, but that category
  // can legitimately be empty. Defaulting to "no filter" shows real stock
  // immediately; selecting a category then narrows it.
  const [activeCollection, setActiveCollection] =
    useState<ProductCollection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const productService = new ProductService();
    productService
      .getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
        ...(activeCollection ? { productCollection: activeCollection } : {}),
      })
      .then((data) => setProducts(data))
      .catch((err) => console.log("Error, BestProducts:", err));
  }, [activeCollection]);

  /** HANDLERS **/
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
    <div className={"best-products"}>
      <Container className={"bp-inner"}>
        <h2 className={"bp-title"}>Best Products</h2>

        <Box className={"bp-filter-row"}>
          <Box className={"bp-filters"}>
            {CATEGORY_FILTERS.map((filter, index) => (
              <React.Fragment key={filter.collection}>
                {index > 0 ? <span className={"bp-filter-sep"}>|</span> : null}
                <button
                  type={"button"}
                  className={
                    activeCollection === filter.collection
                      ? "bp-filter bp-filter-active"
                      : "bp-filter"
                  }
                  onClick={() =>
                    setActiveCollection(
                      activeCollection === filter.collection
                        ? null
                        : filter.collection
                    )
                  }
                >
                  {filter.label}
                </button>
              </React.Fragment>
            ))}
          </Box>

          {/* Carries through whichever category is currently active in the
              filter row above, so filtering here and then clicking through
              lands on the matching Products.tsx view instead of resetting
              to unfiltered. Products.tsx reads this on mount — see
              parseInitialProductSearch there. */}
          <Link
            to={
              activeCollection
                ? `/products?productCollection=${activeCollection}`
                : "/products"
            }
            className={"bp-shop-all"}
          >
            Shop All Categories
          </Link>
        </Box>

        <Box className={"bp-grid"}>
          {products.length !== 0 ? (
            products.map((product: Product) => {
              const imagePath = product.productImages[0]
                ? `${serverApi}/${product.productImages[0]}`
                : "/icons/noimage-list.svg";

              return (
                <article key={product._id} className={"bp-card"}>
                  <Box className={"bp-card-info"}>
                    <span className={"bp-card-name"}>
                      {product.productName}
                    </span>
                  </Box>

                  <Box className={"bp-card-media"}>
                    <img src={imagePath} alt={product.productName} />

                    {/* Desc/rating overlay the photo on hover rather than
                        living in the card's static flow, so the card stays
                        image-forward at rest and never changes height —
                        see home.css for the hover-reveal + scrim. */}
                    <Box className={"bp-card-overlay"}>
                      {product.productDesc ? (
                        <span className={"bp-card-desc"}>
                          {product.productDesc}
                        </span>
                      ) : null}
                      {/* Rating is shown only when a real review exists, so
                          an unreviewed product never reads as "0 stars". */}
                      {product.reviewCount > 0 ? (
                        <span className={"bp-card-rating"}>
                          ★ {product.averageRating.toFixed(1)} (
                          {product.reviewCount})
                        </span>
                      ) : null}
                    </Box>
                  </Box>

                  <button
                    type={"button"}
                    className={"bp-add"}
                    onClick={() => addToCartHandler(product)}
                  >
                    <span>Add To Cart</span>
                    <span className={"bp-add-price"}>
                      | ${product.productPrice}
                    </span>
                  </button>
                </article>
              );
            })
          ) : (
            <Box className={"bp-empty"}>
              No products in this category yet.
            </Box>
          )}
        </Box>
      </Container>
    </div>
  );
}
