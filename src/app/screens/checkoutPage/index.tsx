import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { ShippingAddress } from "../../../lib/types/order";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import "../../../css/checkout.css";

interface CheckoutPageProps {
  cartItems: CartItem[];
  onDeleteAll: () => void;
}

const emptyAddress: ShippingAddress = {
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

export default function CheckoutPage(props: CheckoutPageProps) {
  const { cartItems, onDeleteAll } = props;
  const { authMember, authInitializing, setOrderBuilder } = useGlobals();
  const history = useHistory();
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!authInitializing && !authMember) history.push("/");

  if (authInitializing) {
    return (
      <div className="checkout-page">
        <main className="checkout-container">Loading session...</main>
      </div>
    );
  }

  const itemsPrice = cartItems.reduce(
    (a: number, c: CartItem) => a + c.quantity * c.price,
    0
  );
  const shippingCost: number = itemsPrice < 100 ? 5 : 0;
  const totalPrice = itemsPrice + shippingCost;

  /** HANDLERS **/
  const handleAddressChange =
    (field: keyof ShippingAddress) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAddress((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const submitOrderHandler = async () => {
    try {
      const isFulfilled = Object.values(address).every(
        (value) => value.trim() !== ""
      );
      if (!isFulfilled) throw new Error(Messages.error3);

      setSubmitting(true);
      const order = new OrderService();
      await order.createOrder(cartItems, address);

      onDeleteAll();
      setOrderBuilder(new Date());

      await sweetTopSuccessAlert("Order placed!", 800);
      history.push("/order-track");
    } catch (err) {
      console.log("Error, submitOrderHandler:", err);
      sweetErrorHandling(err).then();
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={"checkout-page"}>
        <main className={"checkout-container"}>
          <div className={"checkout-empty"}>Your cart is empty!</div>
        </main>
      </div>
    );
  }

  return (
    <div className={"checkout-page"}>
      <main className={"checkout-container"}>
        <h1 className={"checkout-title"}>Checkout</h1>
        <div className={"checkout-layout"}>
          <section className={"checkout-address"} aria-labelledby="shipping-heading">
            <h2 id="shipping-heading">Shipping Details</h2>
            <div className="checkout-fields">
              <label className="checkout-wide">Street<input value={address.street} onChange={handleAddressChange("street")} autoComplete="street-address" /></label>
              <label>City<input value={address.city} onChange={handleAddressChange("city")} autoComplete="address-level2" /></label>
              <label>State<input value={address.state} onChange={handleAddressChange("state")} autoComplete="address-level1" /></label>
              <label>ZIP Code<input value={address.zip} onChange={handleAddressChange("zip")} autoComplete="postal-code" /></label>
              <label>Country<input value={address.country} onChange={handleAddressChange("country")} autoComplete="country-name" /></label>
            </div>
          </section>

          <aside className={"checkout-summary"} aria-labelledby="summary-heading">
            <h2 id="summary-heading">Order Summary</h2>
            <div className={"checkout-items"}>
              {cartItems.map((item: CartItem) => {
                const imagePath = item.image
                  ? `${serverApi}/${item.image}`
                  : "/icons/noimage-list.svg";
                const lineTotal = item.price * item.quantity;
                return (
                  <article key={item._id} className={"checkout-item"}>
                    <img
                      src={imagePath}
                      alt={item.name}
                      className={"checkout-item-img"}
                    />
                    <div className="checkout-item-info">
                      <span className={"checkout-item-name"}>{item.name}</span>
                      <span className={"checkout-item-qty"}>{item.quantity} × ${item.price.toFixed(2)}</span>
                    </div>
                    <strong className="checkout-item-total">${lineTotal.toFixed(2)}</strong>
                  </article>
                );
              })}
            </div>
            <dl className={"checkout-total"}>
              <div><dt>Subtotal</dt><dd>${itemsPrice.toFixed(2)}</dd></div>
              <div><dt>Delivery</dt><dd>${shippingCost.toFixed(2)}</dd></div>
              <div className="checkout-grand-total"><dt>Total</dt><dd>${totalPrice.toFixed(2)}</dd></div>
            </dl>
            <button
              type="button"
              className="checkout-submit"
              disabled={submitting}
              onClick={submitOrderHandler}
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
