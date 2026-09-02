import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "./slice";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { retrieveProducts } from "./selector";
import { createSelector } from "reselect";
import ProductService from "../../services/ProductService";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory, useLocation } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import Breadcrumb from "../../components/breadcrumb";

/**
 * Category filter — Session 2 of the Shop List rebuild. Real
 * ProductCollection values as a horizontal chip row, replacing the old
 * rotated -90deg sidebar tabs. Figma's Shop List frame (2458:2) shows
 * only a compact, collapsed "Filter" control with no expanded state
 * visible in the static frame, so the widget shape itself was a real
 * design decision — resolved with the user (chip row) rather than
 * guessed, same discipline as every other genuine gap this rebuild.
 */
const CATEGORY_FILTERS: { label: string; value: ProductCollection }[] = [
  { label: "Climbing", value: ProductCollection.CLIMBING },
  { label: "Camping", value: ProductCollection.CAMPING },
  { label: "Hiking", value: ProductCollection.HIKING },
  { label: "Trekking", value: ProductCollection.TREKKING },
  { label: "Cycling", value: ProductCollection.CYCLING },
  { label: "Apparel", value: ProductCollection.APPAREL },
  { label: "Footwear", value: ProductCollection.FOOTWEAR },
  { label: "Other", value: ProductCollection.OTHER },
];

/**
 * Seeds the initial filter/sort state from the URL on mount, so links built
 * elsewhere (ShopByCategory, BestProducts' "Shop All Categories", Banner's
 * two panels) actually land pre-filtered/pre-sorted instead of always
 * falling back to the hardcoded default — see docs/ai/NEXT_STEPS.md.
 *
 * Runs once via useState's lazy initializer, not a separate effect: this
 * only changes what the page starts with when arrived at via a link — the
 * in-page filter/sort controls still work exactly as before via
 * setProductSearch, and the URL is not re-read after mount.
 */
const parseInitialProductSearch = (search: string): ProductInquiry => {
  const params = new URLSearchParams(search);
  const collectionParam = params.get("productCollection");
  const orderParam = params.get("order");

  const isValidCollection =
    !!collectionParam &&
    (Object.values(ProductCollection) as string[]).includes(collectionParam);

  return {
    order: orderParam || "createdAt",
    page: 1,
    limit: 8,
    productCollection: isValidCollection
      ? (collectionParam as ProductCollection)
      : ProductCollection.CLIMBING,
    search: "",
  };
};

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

const productsRetriever = createSelector(retrieveProducts, (products) => ({
  products,
}));

interface ProDuctsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProDuctsProps) {
  const { onAdd } = props;
  const { setProducts } = actionDispatch(useDispatch());
  const { products } = useSelector(productsRetriever);
  const location = useLocation();
  const [productSearch, setProductSearch] = useState<ProductInquiry>(() =>
    parseInitialProductSearch(location.search)
  );
  const [searchText, setSearchText] = useState<string>("");
  const history = useHistory();

  useEffect(() => {
    const product = new ProductService();

    product
      .getProducts(productSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log(err));
  }, [productSearch]);

  useEffect(() => {
    if (searchText === "") {
      setProductSearch((prev) => ({
        ...prev,
        page: 1, // FIXED: Reset to page 1 when clearing search
        search: "",
      }));
    }
  }, [searchText]);

  /** HANDLERS **/
  const searchCollectionHandler = (collection: ProductCollection) => {
    setProductSearch((prev) => ({
      ...prev,
      page: 1, // FIXED: Reset to page 1
      productCollection: collection,
    }));
  };

  const searchOrderHandler = (order: string) => {
    setProductSearch((prev) => ({
      ...prev,
      page: 1,
      order: order,
    }));
  };

  const searchProductHandler = () => {
    setProductSearch((prev) => ({
      ...prev,
      page: 1, // FIXED: Reset to page 1 when searching
      search: searchText,
    }));
  };

  const paginationHandler = (e: ChangeEvent<any>, value: number) => {
    productSearch.page = value;
    setProductSearch({ ...productSearch });
  };

  const chooseDishHandler = (id: string) => {
    history.push(`/products/${id}`);
  };

  return (
    <div className="products">
      <Breadcrumb
        heading={"Shop"}
        trail={[{ label: "Home", to: "/" }, { label: "Shop" }]}
      />
      <Container>
        <Stack className="title-container">
          <Typography className="products-title">Venturo</Typography>
          <Box className="search-container">
            <input
              type="text"
              placeholder="Type here"
              className="products-search-box"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                console.log(e.key);
                if (e.key === "Enter") searchProductHandler();
              }}
            />
            {searchText && (
              <IconButton
                className="clear-icon-button"
                onClick={() => setSearchText("")}
                size="small"
                aria-label="Clear search"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <Button
              variant="contained"
              color="primary"
              className="search-button"
              onClick={searchProductHandler}
            >
              SEARCH <SearchIcon />
            </Button>
          </Box>
        </Stack>

        <Stack className="products-page-wrapper">
          <Box className={"sl-results-row"}>
            {/* Honest count: the real returned array length, not a
                fabricated grand total — GET /product/all has no
                total-count field (see docs/ai/NEXT_STEPS.md), unlike
                Figma's mockup "Showing 1-15 of 50 Results". */}
            <span className={"sl-results-count"}>
              {products.length} Result{products.length === 1 ? "" : "s"}
            </span>

            <Box className={"sl-sort-row"}>
              <button
                type={"button"}
                className={
                  productSearch.order === "createdAt"
                    ? "sl-filter-chip sl-filter-chip-active"
                    : "sl-filter-chip"
                }
                onClick={() => searchOrderHandler("createdAt")}
              >
                Newest
              </button>
              <button
                type={"button"}
                className={
                  productSearch.order === "productPrice"
                    ? "sl-filter-chip sl-filter-chip-active"
                    : "sl-filter-chip"
                }
                onClick={() => searchOrderHandler("productPrice")}
              >
                Price
              </button>
              <button
                type={"button"}
                className={
                  productSearch.order === "productViews"
                    ? "sl-filter-chip sl-filter-chip-active"
                    : "sl-filter-chip"
                }
                onClick={() => searchOrderHandler("productViews")}
              >
                Most Viewed
              </button>
            </Box>
          </Box>

          <Box className={"sl-filter-row"}>
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type={"button"}
                className={
                  productSearch.productCollection === filter.value
                    ? "sl-filter-chip sl-filter-chip-active"
                    : "sl-filter-chip"
                }
                onClick={() => searchCollectionHandler(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </Box>

          <Box className={"sl-grid"}>
            {products.length !== 0 ? (
              products.map((product: Product) => {
                const imagePath = product.productImages[0]
                  ? `${serverApi}/${product.productImages[0]}`
                  : "/icons/noimage-list.svg";

                return (
                  <article
                    key={product._id}
                    className={"sl-card"}
                    onClick={() => chooseDishHandler(product._id)}
                  >
                    <Box className={"sl-card-info"}>
                      <span className={"sl-card-name"}>
                        {product.productName}
                      </span>
                    </Box>

                    <Box className={"sl-card-media"}>
                      <img src={imagePath} alt={product.productName} />

                      <Box className={"sl-card-overlay"}>
                        {product.productDesc ? (
                          <span className={"sl-card-desc"}>
                            {product.productDesc}
                          </span>
                        ) : null}
                        {product.reviewCount > 0 ? (
                          <span className={"sl-card-rating"}>
                            ★ {product.averageRating.toFixed(1)} (
                            {product.reviewCount})
                          </span>
                        ) : null}
                      </Box>
                    </Box>

                    <button
                      type={"button"}
                      className={"sl-add"}
                      onClick={(e) => {
                        onAdd({
                          _id: product._id,
                          quantity: 1,
                          name: product.productName,
                          price: product.productPrice,
                          image: product.productImages[0] || "",
                        });
                        e.stopPropagation();
                      }}
                    >
                      <span>Add To Cart</span>
                      <span className={"sl-add-price"}>
                        | ${product.productPrice}
                      </span>
                    </button>
                  </article>
                );
              })
            ) : (
              <Box className={"sl-empty"}>
                New products are not available!
              </Box>
            )}
          </Box>

          <Stack className={"pagination-section"}>
            <Pagination
              count={
                // Backend doesn't return a total count, so a full page
                // (products.length === limit) is the only signal that a
                // next page might exist; a short page is the real last one.
                products.length === productSearch.limit
                  ? productSearch.page + 1
                  : productSearch.page
              }
              page={productSearch.page}
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: ArrowBackIcon,
                    next: ArrowForwardIcon,
                  }}
                  {...item}
                  color={"secondary"}
                />
              )}
              onChange={paginationHandler}
            />
          </Stack>
        </Stack>
      </Container>

      <div className="brands-logo">
        <Typography className="brands-title">Our Family Brands</Typography>
        <Stack className="brand-face-box">
          <Box className="brand-face">
            <img src="/img/gurme.webp" alt="" />
          </Box>
          <Box className="brand-face">
            <img src="/img/seafood.webp" alt="" />
          </Box>
          <Box className="brand-face">
            <img src="/img/sweets.webp" alt="" />
          </Box>
          <Box className="brand-face">
            <img src="/img/doner.webp" alt="" />
          </Box>
        </Stack>
      </div>

      <div className={"address"}>
        <Container>
          <Stack className={"address-area"}>
            <Box className={"address-title"}>Our address</Box>
            <iframe
              style={{ marginTop: "60px", marginBottom: "89px", border: 0 }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d317114.8242487396!2d126.6709445!3d37.7598683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c98f3f0f4b6df%3A0x6b4c9b6b9d3e1c3!2sPaju-si%2C%20Gyeonggi-do%2C%20South%20Korea!5e0!3m2!1sen!2s!4v1700000000001!5m2!1sen!2s"
              width="1320"
              height="560"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </div>
  );
}
