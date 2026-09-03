import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Rating from "@mui/material/Rating";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setChosenProduct } from "./slice";
import { Product } from "../../../lib/types/product";
import { retrieveChosenProduct } from "./selector";
import { createSelector } from "reselect";
import { Link, useHistory, useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import Breadcrumb from "../../components/breadcrumb";

/**
 * Shop Detail — Session 4 of the Shop List/Shop Detail rebuild. Figma
 * "HikMali" node 2461:881. Gallery (thumb rail + large image),
 * price/size-row, and Add To Cart/Buy Now wiring reuse the homepage
 * ProductDetails.tsx's already-solved pattern verbatim (same
 * `activeImage` state, same `addToCartHandler`/`buyNowHandler` shape) —
 * not a new pattern. `ProductSize` is a single fixed value per product,
 * same inert-label treatment (not a fake S/M/L/XL picker) already
 * established there.
 *
 * The old "Product Detail" Dancing Script heading is gone — Breadcrumb
 * (Session 1) already renders the real "Shop Detail" heading, so it was
 * a straight duplicate, flagged as known/temporary in that session.
 *
 * `averageRating`/`productViews` are real, already-wired data with no
 * counterpart in the reused pd-* pattern (the homepage teaser shows
 * neither) — kept and restyled rather than dropped, since they're
 * genuine product data, not mockup filler.
 */
const actionDispatch = (dispatch: Dispatch) => ({
  setChosenProduct: (data: Product) => dispatch(setChosenProduct(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct })
);

interface ChosenProDuctProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProDuctProps) {
  const { onAdd } = props;
  const { setChosenProduct } = actionDispatch(useDispatch());
  const { productsId } = useParams<{ productsId: string }>();
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const history = useHistory();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const product = new ProductService();
    product
      .getProduct(productsId)
      .then((data) => setChosenProduct(data))
      .catch((err) => console.log(err));
  }, [productsId]);

  if (!chosenProduct) return null;

  const images = chosenProduct.productImages;
  const mainImage = images[activeImage]
    ? `${serverApi}/${images[activeImage]}`
    : "/icons/noimage-list.svg";

  const addToCartHandler = () => {
    onAdd({
      _id: chosenProduct._id,
      quantity: 1,
      name: chosenProduct.productName,
      price: chosenProduct.productPrice,
      image: chosenProduct.productImages[0] || "",
    });
  };

  const buyNowHandler = () => {
    addToCartHandler();
    history.push("/checkout");
  };

  return (
    <div className={"chosen-product"}>
      <Breadcrumb
        heading={"Shop Detail"}
        trail={[{ label: "Home", to: "/" }, { label: "Shop Detail" }]}
      />
      <Container className={"sd-inner"}>
        <Box className={"sd-layout"}>
          <Box className={"sd-gallery"}>
            {images.length > 1 ? (
              <Box className={"sd-thumbs"}>
                {images.map((img, index) => (
                  <button
                    key={img + index}
                    type={"button"}
                    className={
                      index === activeImage
                        ? "sd-thumb sd-thumb-active"
                        : "sd-thumb"
                    }
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={`${serverApi}/${img}`}
                      alt={`${chosenProduct.productName} ${index + 1}`}
                    />
                  </button>
                ))}
              </Box>
            ) : null}

            <Box className={"sd-main"}>
              <img
                src={mainImage}
                alt={chosenProduct.productName}
                className={"sd-main-image"}
              />
            </Box>
          </Box>

          <Box className={"sd-content"}>
            <h1 className={"sd-title"}>{chosenProduct.productName}</h1>

            <Box className={"sd-meta-row"}>
              <Rating
                name="half-rating-read"
                value={chosenProduct.averageRating ?? 0}
                precision={0.5}
                readOnly
              />
              <span className={"sd-views"}>
                <RemoveRedEyeIcon fontSize={"small"} />
                {chosenProduct.productViews}
              </span>
            </Box>

            <span className={"sd-price"}>${chosenProduct.productPrice}</span>

            <Box className={"sd-divider"} />

            {chosenProduct.productSize ? (
              <Box className={"sd-size-row"}>
                <span className={"sd-size-label"}>Size:</span>
                <span className={"sd-size-value"}>
                  {chosenProduct.productSize}
                </span>
              </Box>
            ) : null}

            <button
              type={"button"}
              className={"sd-add"}
              onClick={addToCartHandler}
            >
              Add To Cart
            </button>
            <button
              type={"button"}
              className={"sd-buy"}
              onClick={buyNowHandler}
            >
              Buy Now
            </button>

            {chosenProduct.productDesc ? (
              <p className={"sd-desc"}>{chosenProduct.productDesc}</p>
            ) : null}
          </Box>
        </Box>
      </Container>

      {/* Figma node 7:247: generic brand copy and a real route only. */}
      <section className={"sd-lifestyle-banner"} aria-labelledby="sd-lifestyle-title">
        <div
          className={"sd-lifestyle-banner__media"}
          style={{ backgroundImage: "url(/img/shop-detail-banner.jpg)" }}
        />
        <div className={"sd-lifestyle-banner__content"}>
          <h2 id="sd-lifestyle-title" className={"sd-lifestyle-banner__title"}>
            Best Enjoyed
            <br />
            Outside
          </h2>
          <Link to="/products" className={"sd-lifestyle-banner__cta"}>
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
