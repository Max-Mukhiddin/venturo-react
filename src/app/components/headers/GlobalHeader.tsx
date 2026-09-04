import React, { FocusEvent, useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { ListItemIcon, Menu, MenuItem } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { CartItem } from "../../../lib/types/search";
import { useGlobals } from "../../hooks/useGlobals";
import Basket from "./Basket";

interface GlobalHeaderProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleCloseLogout: () => void;
  anchorEl: HTMLElement | null;
  handleLogoutRequest: () => void;
}

const ACTIVITY_LINKS = [
  ["Climbing", ProductCollection.CLIMBING], ["Camping", ProductCollection.CAMPING],
  ["Hiking", ProductCollection.HIKING], ["Trekking", ProductCollection.TREKKING],
  ["Cycling", ProductCollection.CYCLING], ["Apparel", ProductCollection.APPAREL],
  ["Footwear", ProductCollection.FOOTWEAR],
] as const;

const PAGE_LINKS = [
  ["My Account", "/my-account"], ["Wishlist", "/wishlist"], ["FAQ", "/faq"],
  ["Contact", "/contact"], ["Order Track", "/order-track"],
] as const;

export default function GlobalHeader(props: GlobalHeaderProps) {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll, setLoginOpen, handleLogoutClick, handleCloseLogout, anchorEl, handleLogoutRequest } = props;
  const { authMember, authInitializing } = useGlobals();
  const location = useLocation();
  const [desktopMenu, setDesktopMenu] = useState<"activities" | "pages" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<"activities" | "pages" | null>(null);
  const hasCollection = new URLSearchParams(location.search).has("productCollection");
  const shopActive = location.pathname.startsWith("/products") && !hasCollection;
  const activitiesActive = location.pathname.startsWith("/products") && hasCollection;
  const pagesActive = PAGE_LINKS.some(([, path]) => location.pathname === path);
  const closeMobileNav = () => setMobileOpen(false);
  const closeDesktopMenuOnBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDesktopMenu(null);
  };
  const renderActivityLinks = (className: string) => ACTIVITY_LINKS.map(([label, collection]) => (
    <NavLink key={collection} to={`/products?productCollection=${collection}`} className={className} onClick={() => { setDesktopMenu(null); closeMobileNav(); }}>{label}</NavLink>
  ));
  const renderPageLinks = (className: string) => PAGE_LINKS.map(([label, path]) => (
    <NavLink key={path} to={path} className={className} onClick={() => { setDesktopMenu(null); closeMobileNav(); }}>{label}</NavLink>
  ));

  return (
    <header className="vt-navbar">
      <div className="vn-promo"><div className="vn-inner"><span>30-60% off - Mid Season Sale! On All Orders</span><span className="vn-currency">Currency United States (USD $)<img src="/icons/hm-caret-down.svg" alt="" /></span></div></div>
      <div className="vn-main"><div className="vn-inner">
        <NavLink to="/" className="vn-brand" aria-label="Venturo home"><img src="/icons/venturo-badge.svg" alt="" /><span>VENTURO</span></NavLink>
        <nav className="vn-desktop-links" aria-label="Primary navigation">
          <NavLink to="/" exact activeClassName="vn-link-active" className="vn-link">Home</NavLink>
          <NavLink to="/products" className={shopActive ? "vn-link vn-link-active" : "vn-link"}>Shop</NavLink>
          <div className="vn-menu-group" onMouseEnter={() => setDesktopMenu("activities")} onMouseLeave={() => setDesktopMenu(null)} onBlur={closeDesktopMenuOnBlur}>
            <button type="button" className={activitiesActive ? "vn-link vn-menu-trigger vn-link-active" : "vn-link vn-menu-trigger"} aria-haspopup="menu" aria-expanded={desktopMenu === "activities"} onClick={() => setDesktopMenu("activities")}>Activities</button>
            {desktopMenu === "activities" ? <div className="vn-dropdown" role="menu">{renderActivityLinks("vn-dropdown-link")}</div> : null}
          </div>
          <NavLink to="/blog" activeClassName="vn-link-active" className="vn-link">Blog</NavLink>
          <div className="vn-menu-group" onMouseEnter={() => setDesktopMenu("pages")} onMouseLeave={() => setDesktopMenu(null)} onBlur={closeDesktopMenuOnBlur}>
            <button type="button" className={pagesActive ? "vn-link vn-menu-trigger vn-link-active" : "vn-link vn-menu-trigger"} aria-haspopup="menu" aria-expanded={desktopMenu === "pages"} onClick={() => setDesktopMenu("pages")}>Pages</button>
            {desktopMenu === "pages" ? <div className="vn-dropdown" role="menu">{renderPageLinks("vn-dropdown-link")}</div> : null}
          </div>
        </nav>
        <div className="vn-actions">
          <NavLink to="/products" className="vn-icon-button" aria-label="Search products"><img src="/icons/hm-search.svg" alt="" /></NavLink>
          <Basket cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} onDelete={onDelete} onDeleteAll={onDeleteAll} />
          {authInitializing ? null : !authMember ? <button type="button" className="vn-login" onClick={() => setLoginOpen(true)}>Login</button> : authMember.memberImage ? <button type="button" className="vn-avatar-button" aria-label="Open account menu" aria-haspopup="menu" onClick={handleLogoutClick}><img src={`${serverApi}/${authMember.memberImage}`} alt="Account" /></button> : <button type="button" className="vn-avatar-button vn-avatar-fallback" aria-label="Open account menu" aria-haspopup="menu" onClick={handleLogoutClick}><AccountCircleOutlinedIcon aria-hidden="true" /></button>}
          <button type="button" className="vn-mobile-toggle" aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <CloseIcon aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}</button>
        </div>
      </div></div>
      {mobileOpen ? <nav className="vn-mobile-panel" aria-label="Mobile navigation">
        <NavLink to="/" exact activeClassName="vn-mobile-link-active" className="vn-mobile-link" onClick={closeMobileNav}>Home</NavLink>
        <NavLink to="/products" className={shopActive ? "vn-mobile-link vn-mobile-link-active" : "vn-mobile-link"} onClick={closeMobileNav}>Shop</NavLink>
        <button type="button" className={activitiesActive ? "vn-mobile-group vn-mobile-link-active" : "vn-mobile-group"} aria-expanded={mobileGroup === "activities"} onClick={() => setMobileGroup((group) => group === "activities" ? null : "activities")}>Activities</button>
        {mobileGroup === "activities" ? <div className="vn-mobile-submenu">{renderActivityLinks("vn-mobile-submenu-link")}</div> : null}
        <NavLink to="/blog" activeClassName="vn-mobile-link-active" className="vn-mobile-link" onClick={closeMobileNav}>Blog</NavLink>
        <button type="button" className={pagesActive ? "vn-mobile-group vn-mobile-link-active" : "vn-mobile-group"} aria-expanded={mobileGroup === "pages"} onClick={() => setMobileGroup((group) => group === "pages" ? null : "pages")}>Pages</button>
        {mobileGroup === "pages" ? <div className="vn-mobile-submenu">{renderPageLinks("vn-mobile-submenu-link")}</div> : null}
      </nav> : null}
      <Menu anchorEl={anchorEl} id="account-menu" open={Boolean(anchorEl)} onClose={handleCloseLogout} onClick={handleCloseLogout} PaperProps={{ elevation: 0, sx: { mt: 1.5, borderRadius: 0, border: "1px solid #aeb192", boxShadow: "none" } }} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }}><MenuItem onClick={handleLogoutRequest}><ListItemIcon><Logout fontSize="small" sx={{ color: "#707262" }} /></ListItemIcon>Logout</MenuItem></Menu>
    </header>
  );
}
