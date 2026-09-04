import React from "react";
import { CartItem } from "../../../lib/types/search";
import GlobalHeader from "./GlobalHeader";

interface OtherNavbarProps {
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

export default function OtherNavbar({ setSignupOpen: _setSignupOpen, ...headerProps }: OtherNavbarProps) {
  return <GlobalHeader {...headerProps} />;
}
