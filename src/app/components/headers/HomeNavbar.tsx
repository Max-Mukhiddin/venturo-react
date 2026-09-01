import {
  Box,
  Button,
  Container,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import Basket from "./Basket";
import { NavLink } from "react-router-dom";
import React from "react";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import { Logout } from "@mui/icons-material";

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  handleCloseLogout: () => void;
  anchorEl: HTMLElement | null;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar(props: HomeNavbarProps) {
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setSignupOpen,
    setLoginOpen,
    handleLogoutClick,
    handleCloseLogout,
    anchorEl,
    handleLogoutRequest,
  } = props;
  const { authMember } = useGlobals();

  return (
    <div className="home-navbar">
      {/* Announcement bar */}
      <Box className="hm-topbar">
        <Container className="hm-inner">
          <span className="hm-topbar-promo">
            30-60% off – Mid Season Sale! On All Orders
          </span>
          <span className="hm-topbar-currency">
            Currency United States (USD $)
            <img src="/icons/hm-caret-down.svg" alt="" className="hm-caret" />
          </span>
        </Container>
      </Box>

      {/* Main navigation */}
      <Box className="hm-nav">
        <Container className="hm-inner">
          <NavLink to={"/"} className="hm-brand">
            <Box className="brand-lockup">
              <img
                className="brand-badge"
                src="/icons/venturo-badge.svg"
                alt="Venturo"
              />
              <span className="brand-wordmark">VENTURO</span>
            </Box>
          </NavLink>

          <Stack className="hm-links">
            <Box className={"hover-line"}>
              <NavLink to="/" activeClassName={"underline"} exact>
                Home
              </NavLink>
            </Box>
            <span className="hm-sep">|</span>
            <Box className={"hover-line"}>
              <NavLink to={"/products"} activeClassName={"underline"}>
                Products
              </NavLink>
            </Box>
            {authMember ? (
              <>
                <span className="hm-sep">|</span>
                <Box className={"hover-line"}>
                  <NavLink to="/orders" activeClassName={"underline"}>
                    Orders
                  </NavLink>
                </Box>
                <span className="hm-sep">|</span>
                <Box className={"hover-line"}>
                  <NavLink to="/member-page" activeClassName={"underline"}>
                    My page
                  </NavLink>
                </Box>
              </>
            ) : null}
            <span className="hm-sep">|</span>
            <Box className={"hover-line"}>
              <NavLink to="/help" activeClassName={"underline"}>
                Help
              </NavLink>
            </Box>
          </Stack>

          <Stack className="hm-actions">
            {/* Search lives on the products page — this links there rather
                than rendering a decorative, non-functional control. */}
            <NavLink to="/products" className="hm-icon-btn" aria-label="Search">
              <img src="/icons/hm-search.svg" alt="" className="hm-icon" />
            </NavLink>

            <Basket
              cartItems={cartItems}
              onAdd={onAdd}
              onRemove={onRemove}
              onDelete={onDelete}
              onDeleteAll={onDeleteAll}
            />

            {!authMember ? (
              <Button
                className="hm-login-button"
                variant="contained"
                onClick={() => setLoginOpen(true)}
              >
                Login
              </Button>
            ) : (
              <img
                className="user-avatar"
                src={
                  authMember?.memberImage
                    ? `${serverApi}/${authMember?.memberImage}`
                    : "/icons/default-user.svg"
                }
                alt="Account"
                aria-haspopup={true}
                onClick={handleLogoutClick}
                style={{ cursor: "pointer" }}
              />
            )}

            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={Boolean(anchorEl)}
              onClose={handleCloseLogout}
              onClick={handleCloseLogout}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleLogoutRequest}>
                <ListItemIcon>
                  <Logout fontSize="small" style={{ color: "blue" }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Container>
      </Box>

      {/* Hero */}
      <Box className="hm-hero">
        <Box
          className="hm-hero-panel hm-hero-panel-left"
          style={{ backgroundImage: "url(/img/hero-left.jpg)" }}
        />
        <Box
          className="hm-hero-panel hm-hero-panel-right"
          style={{ backgroundImage: "url(/img/hero-right.jpg)" }}
        />

        <Container className="hm-hero-inner">
          <Box className="hm-hero-copy">
            <span className="hm-hero-eyebrow">Hot Deals</span>
            <span className="hm-hero-discount">Discount 30% Off</span>
            <h1 className="hm-hero-title">
              Adventures
              <span className="hm-hero-title-accent">Is Calling</span>
            </h1>
            <span className="hm-hero-sub">Let’s Go Camping</span>
            <NavLink to="/products" className="hm-shop-now">
              Shop Now
            </NavLink>
          </Box>

          <Box className="hm-hero-offer">
            <span className="hm-hero-offer-get">Get</span>
            <span className="hm-hero-offer-value">
              25%
              <span className="hm-hero-offer-off">Off</span>
            </span>
          </Box>

        </Container>
      </Box>
    </div>
  );
}
