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
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import { serverApi } from "../../../lib/config";
import React from "react";
import { Logout } from "@mui/icons-material";

interface OtherNavbarProps {
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

/**
 * OtherNavbar — the header used on every non-home route. Figma "HikMali"
 * node 2012:153 ("Header" on the "Shop List" frame, 2458:2) — pulled
 * directly rather than assumed as a HomeNavbar variant. Same two-bar
 * structure as HomeNavbar (announcement topbar + main nav), just without
 * the homepage-only hero, confirmed by the real design context.
 *
 * The design's own nav links ("Home | Activity | Equipment | Men's |
 * Women's | Pages") are generic template labels with no real routes in
 * this app — same class of problem HomeNavbar's rebuild already resolved
 * for the homepage nav. Reuses that exact same resolution (the real
 * route set: Home/Products/Orders/My page/Help) rather than re-deciding
 * it, for consistency between the two headers.
 */
export default function OtherNavbar(props: OtherNavbarProps) {
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
    <div className="other-navbar">
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
            <span className="hm-sep">|</span>
            <Box className={"hover-line"}>
              <NavLink to="/blog" activeClassName={"underline"}>
                Blog
              </NavLink>
            </Box>
            {authMember ? (
              <>
                <span className="hm-sep">|</span>
                <Box className={"hover-line"}>
                  <NavLink to="/order-track" activeClassName={"underline"}>
                    Orders
                  </NavLink>
                </Box>
                <span className="hm-sep">|</span>
                <Box className={"hover-line"}>
                  <NavLink to="/my-account" activeClassName={"underline"}>
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
    </div>
  );
}
