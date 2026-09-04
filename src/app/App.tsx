import React, { useState } from "react";
import { Box } from "@mui/material";
import { Route, Switch, useLocation } from "react-router-dom";
import HomePage from "./screens/homePage";
import ProductsPage from "./screens/productsPage/index";
import OtherNavbar from "./components/headers/OtherNavbar";
import HomeNavbar from "./components/headers/HomeNavbar";
import Footer from "./components/footer";
import ContactPage from "./screens/contactPage";
import FaqPage from "./screens/faqPage";
import WishlistPage from "./screens/wishlistPage";
import MyAccountPage from "./screens/myAccountPage";
import OrderTrackPage from "./screens/orderTrackPage";
import BlogPage from "./screens/blogPage";
import CheckoutPage from "./screens/checkoutPage";
import useBasket from "./hooks/useBasket";
import AuthenticationModal from "./components/auth";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../lib/sweetAlert";
import { Messages } from "../lib/config";
import MemberService from "./services/MemberService";
import { useGlobals } from "./hooks/useGlobals";
import "../css/navbar.css";
import "../css/footer.css";

function App() {
  const location = useLocation(); // returns Object
  // console.log("location:", location);
  const { setAuthMember } = useGlobals();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const [signupOpen, setSignupOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  /** HANDLERS **/

  const handleSignupClose = () => setSignupOpen(false);
  const handleLoginClose = () => setLoginOpen(false);

  const handleLogoutClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseLogout = () => {
    setAnchorEl(null);
  };

  const handleLogoutRequest = async () => {
    try {
      const member = new MemberService();
      member.logout();

      await sweetTopSuccessAlert("success", 700);
      setAuthMember(null);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(Messages.error1);
    }
  };

  return (
    <>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      {location.pathname === "/" ? (
        <HomeNavbar
          cartItems={cartItems}
          onAdd={onAdd}
          onRemove={onRemove}
          onDelete={onDelete}
          onDeleteAll={onDeleteAll}
          setSignupOpen={setSignupOpen}
          setLoginOpen={setLoginOpen}
          anchorEl={anchorEl}
          handleLogoutClick={handleLogoutClick}
          handleCloseLogout={handleCloseLogout}
          handleLogoutRequest={handleLogoutRequest}
        />
      ) : (
        <OtherNavbar
          cartItems={cartItems}
          onAdd={onAdd}
          onRemove={onRemove}
          onDelete={onDelete}
          onDeleteAll={onDeleteAll}
          setSignupOpen={setSignupOpen}
          setLoginOpen={setLoginOpen}
          anchorEl={anchorEl}
          handleLogoutClick={handleLogoutClick}
          handleCloseLogout={handleCloseLogout}
          handleLogoutRequest={handleLogoutRequest}
        />
      )}
      {/* temporary minHeight -> should be DELETED! */}
      <Box sx={{ minHeight: "20vh" }}>
        <Switch>
          <Route path="/products">
            <ProductsPage onAdd={onAdd} />
          </Route>
          <Route path="/checkout">
            <CheckoutPage cartItems={cartItems} onDeleteAll={onDeleteAll} />
          </Route>
          <Route path="/contact">
            <ContactPage />
          </Route>
          <Route path="/faq">
            <FaqPage />
          </Route>
          <Route path="/wishlist">
            <WishlistPage onAdd={onAdd} />
          </Route>
          <Route path="/my-account">
            <MyAccountPage />
          </Route>
          <Route path="/order-track">
            <OrderTrackPage />
          </Route>
          <Route path="/blog">
            <BlogPage />
          </Route>
          <Route path="/">
            <HomePage onAdd={onAdd} />
          </Route>
        </Switch>
      </Box>
      <Footer />

      <AuthenticationModal
        signupOpen={signupOpen}
        loginOpen={loginOpen}
        handleLoginClose={handleLoginClose}
        handleSignupClose={handleSignupClose}
      />
    </>
  );
}

export default App;
