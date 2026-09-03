import React from "react";
import { Box } from "@mui/material";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import { Link, useHistory } from "react-router-dom";
import { Messages, serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function Basket({ cartItems, onAdd, onRemove, onDelete, onDeleteAll }: BasketProps) {
  const { authMember } = useGlobals();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const itemsPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleClose = () => setAnchorEl(null);
  const proceedOrderHandler = () => {
    try {
      handleClose();
      if (!authMember) throw new Error(Messages.error2);
      history.push("/checkout");
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  return (
    <Box className="hover-line">
      <IconButton
        aria-label="cart"
        id="basic-button"
        aria-controls={open ? "basket-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <Badge badgeContent={cartItems.length} className="basket-badge">
          <img src="/icons/shopping-cart.svg" alt="" />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="basket-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{ elevation: 0, sx: { overflow: "visible", boxShadow: "none", borderRadius: 0, mt: 1.5 } }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="basket-frame">
          <header className="basket-header">
            <h2>Cart</h2>
            <button className="basket-close" onClick={handleClose} aria-label="Close cart">×</button>
          </header>
          {cartItems.length === 0 ? (
            <div className="basket-empty">
              <p>Your cart is empty.</p>
              <Link to="/products" onClick={handleClose}>Return to Shop</Link>
            </div>
          ) : (
            <>
              <div className="basket-items">
                {cartItems.map((item) => {
                  const imagePath = item.image ? `${serverApi}/${item.image}` : "/icons/noimage-list.svg";
                  const lineTotal = item.price * item.quantity;

                  return (
                    <article className="basket-item" key={item._id}>
                      <Link to={`/products/${item._id}`} onClick={handleClose} className="basket-image-link">
                        <img src={imagePath} alt={item.name} />
                      </Link>
                      <div className="basket-item-info">
                        <Link to={`/products/${item._id}`} onClick={handleClose}>{item.name}</Link>
                        <span>{`$${item.price.toFixed(2)}`}</span>
                        <div className="basket-quantity">
                          <button onClick={() => onRemove(item)} aria-label={`Decrease ${item.name} quantity`}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => onAdd(item)} aria-label={`Increase ${item.name} quantity`}>+</button>
                        </div>
                      </div>
                      <div className="basket-item-side">
                        <button className="basket-remove" onClick={() => onDelete(item)} aria-label={`Remove ${item.name}`}>×</button>
                        <strong>{`$${lineTotal.toFixed(2)}`}</strong>
                      </div>
                    </article>
                  );
                })}
              </div>
              <footer className="basket-summary">
                <div><span>Subtotal</span><strong>{`$${itemsPrice.toFixed(2)}`}</strong></div>
                <div className="basket-total"><span>Total</span><strong>{`$${itemsPrice.toFixed(2)}`}</strong></div>
                <button className="basket-checkout" onClick={proceedOrderHandler}>Proceed to Order</button>
                <button className="basket-clear" onClick={onDeleteAll}>Clear Cart</button>
              </footer>
            </>
          )}
        </div>
      </Menu>
    </Box>
  );
}
