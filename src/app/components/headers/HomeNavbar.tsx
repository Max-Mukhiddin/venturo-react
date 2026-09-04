import React from "react";
import { Box, Container } from "@mui/material";
import { NavLink } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import GlobalHeader from "./GlobalHeader";

interface HomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseLogout: () => void;
  anchorEl: HTMLElement | null;
  handleLogoutRequest: () => void;
}

export default function HomeNavbar({ setSignupOpen: _setSignupOpen, ...headerProps }: HomeNavbarProps) {
  return (
    <div className="home-navbar">
      <GlobalHeader {...headerProps} />
      <Box className="hm-hero">
        <Box className="hm-hero-panel hm-hero-panel-left" style={{ backgroundImage: "url(/img/hero-left.jpg)" }} />
        <Box className="hm-hero-panel hm-hero-panel-right" style={{ backgroundImage: "url(/img/hero-right.jpg)" }} />
        <Container className="hm-hero-inner">
          <Box className="hm-hero-copy">
            <span className="hm-hero-eyebrow">Hot Deals</span>
            <span className="hm-hero-discount">Discount 30% Off</span>
            <h1 className="hm-hero-title">Adventures<span className="hm-hero-title-accent">Is Calling</span></h1>
            <span className="hm-hero-sub">Let’s Go Camping</span>
            <NavLink to="/products" className="hm-shop-now">Shop Now</NavLink>
          </Box>
          <Box className="hm-hero-offer">
            <span className="hm-hero-offer-get">Get</span>
            <span className="hm-hero-offer-value">25%<span className="hm-hero-offer-off">Off</span></span>
          </Box>
        </Container>
      </Box>
    </div>
  );
}
