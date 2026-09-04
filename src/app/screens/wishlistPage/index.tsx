import React, { useCallback, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "../../../css/wishlist.css";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { WishlistItem } from "../../../lib/types/wishlist";
import Breadcrumb from "../../components/breadcrumb";
import { useGlobals } from "../../hooks/useGlobals";
import WishlistService from "../../services/WishlistService";
import FreeShipping from "../homePage/FreeShipping";

export default function WishlistPage({ onAdd, onLoginOpen }: { onAdd: (item: CartItem) => void; onLoginOpen: () => void }) {
  const { authMember, authInitializing } = useGlobals();
  const history = useHistory();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!authMember) return;

    setLoading(true);
    setError(false);

    new WishlistService()
      .getWishlist()
      .then((data) => setItems(data.filter((item) => item.productData[0])))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [authMember]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (item: WishlistItem) => {
    setRemoving(item.productId);

    try {
      const result = await new WishlistService().removeFromWishlist(item.productId);

      if (result.removed) {
        setItems((previous) => previous.filter((entry) => entry._id !== item._id));
      }
    } catch {
      setError(true);
    } finally {
      setRemoving(null);
    }
  };

  const add = (item: WishlistItem) => {
    const product = item.productData[0];
    if (product.productLeftCount <= 0) return;

    onAdd({
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages[0] || "",
    });
  };

  const content = authInitializing ? (
    <p className="wl-state">Loading session...</p>
  ) : !authMember ? (
    <div className="wl-empty">
      <p><button className="wl-auth-link" type="button" onClick={onLoginOpen}>Sign in</button> to view your wishlist.</p>
      <Link to="/products">Return To Shop</Link>
    </div>
  ) : loading ? (
    <p className="wl-state">Loading wishlist...</p>
  ) : error ? (
    <p className="wl-state">
      Wishlist could not be loaded. <button onClick={load}>Retry</button>
    </p>
  ) : items.length === 0 ? (
    <div className="wl-empty">
      <span aria-hidden="true">♡</span>
      <p>Your wishlist is empty.</p>
      <Link to="/products">Return To Shop</Link>
    </div>
  ) : (
    <div className="wl-grid">
      {items.map((item) => {
        const product = item.productData[0];
        const unavailable = product.productLeftCount <= 0;

        return (
          <article className="wl-card" key={item._id}>
            <button className="wl-product" onClick={() => history.push(`/products/${product._id}`)}>
              <img
                src={product.productImages[0] ? `${serverApi}/${product.productImages[0]}` : "/icons/noimage-list.svg"}
                alt={product.productName}
              />
              <span>{product.productName}</span>
            </button>
            <span className="wl-price">${product.productPrice}</span>
            <button
              className="wl-remove"
              disabled={removing === item.productId}
              onClick={() => remove(item)}
              aria-label={`Remove ${product.productName}`}
            >
              ×
            </button>
            <button className="wl-add" disabled={unavailable} onClick={() => add(item)}>
              {unavailable ? "Out of Stock" : "Add To Cart"}
            </button>
          </article>
        );
      })}
    </div>
  );
  return <div className="wishlist-page"><Breadcrumb heading="Wish List" trail={[{ label: "Home", to: "/" }, { label: "Wish List" }]} /><main className="wl-main">{content}</main><div className="homepage wl-benefits"><FreeShipping /></div></div>;
}
