import React, { useEffect } from "react";
import ShopByCategory from "./ShopByCategory";
import BestProducts from "./BestProducts";
import Banner from "./Banner";
import Highlights from "./Highlights";
import DealsOfTheDay from "./DealsOfTheDay";
import ProductDetails from "./ProductDetails";
import Instagram from "./Instagram";
import FreeShipping from "./FreeShipping";
import ActiveUsers from "./ActiveUsers";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setTopUsers } from "./slice";
import MemberService from "../../services/MemberService";
import { Member } from "../../../lib/types/member";
import { CartItem } from "../../../lib/types/search";
import "../../../css/home.css";

/** REDUX SLICE & SELECTOR **/
const actionDispatch = (dispatch: Dispatch) => ({
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

interface HomePageProps {
  onAdd: (item: CartItem) => void;
}

export default function HomePage(props: HomePageProps) {
  const { onAdd } = props;
  const { setTopUsers } = actionDispatch(useDispatch());

  useEffect(() => {
    // Backend server data fetch => Data
    const member = new MemberService();
    member
      .getTopUsers()
      .then((data) => setTopUsers(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className={"homepage"}>
      <ShopByCategory />
      <BestProducts onAdd={onAdd} />
      <Banner />
      <Highlights onAdd={onAdd} />
      <DealsOfTheDay onAdd={onAdd} />
      <ProductDetails onAdd={onAdd} />
      <Instagram />
      <FreeShipping />
      <ActiveUsers />
    </div>
  );
}
