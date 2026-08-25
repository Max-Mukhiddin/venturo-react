import React, { useState } from "react";
import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { ShippingAddress } from "../../../lib/types/order";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";

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
  const { authMember, setOrderBuilder } = useGlobals();
  const history = useHistory();
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!authMember) history.push("/");

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
      history.push("/orders");
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
        <Container className={"checkout-container"}>
          <Box className={"checkout-empty"}>Your cart is empty!</Box>
        </Container>
      </div>
    );
  }

  return (
    <div className={"checkout-page"}>
      <Container className={"checkout-container"}>
        <Typography className={"checkout-title"}>Checkout</Typography>
        <Stack className={"checkout-layout"} direction={"row"} spacing={4}>
          <Stack className={"checkout-address"} spacing={2}>
            <Typography variant={"h6"}>Shipping Address</Typography>
            <TextField
              label="Street"
              value={address.street}
              onChange={handleAddressChange("street")}
            />
            <TextField
              label="City"
              value={address.city}
              onChange={handleAddressChange("city")}
            />
            <TextField
              label="State"
              value={address.state}
              onChange={handleAddressChange("state")}
            />
            <TextField
              label="Zip"
              value={address.zip}
              onChange={handleAddressChange("zip")}
            />
            <TextField
              label="Country"
              value={address.country}
              onChange={handleAddressChange("country")}
            />
          </Stack>

          <Stack className={"checkout-summary"} spacing={2}>
            <Typography variant={"h6"}>Order Summary</Typography>
            <Stack className={"checkout-items"}>
              {cartItems.map((item: CartItem) => {
                const imagePath = `${serverApi}/${item.image}`;
                return (
                  <Stack
                    key={item._id}
                    direction={"row"}
                    className={"checkout-item"}
                    spacing={2}
                  >
                    <img
                      src={imagePath}
                      alt={item.name}
                      className={"checkout-item-img"}
                    />
                    <span className={"checkout-item-name"}>{item.name}</span>
                    <span className={"checkout-item-qty"}>
                      {item.price} x {item.quantity}
                    </span>
                  </Stack>
                );
              })}
            </Stack>
            <Box className={"checkout-total"}>
              <span>
                Total: {totalPrice.toFixed(1)} ({itemsPrice} + {shippingCost})
              </span>
            </Box>
            <Button
              variant={"contained"}
              disabled={submitting}
              onClick={submitOrderHandler}
            >
              Place Order
            </Button>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
