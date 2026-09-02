import { createSlice } from "@reduxjs/toolkit";
import { ProductPageState } from "../../../lib/types/screen";

const initialState: ProductPageState = {
  chosenProduct: null,
  products: [],
};

const productsPageSlice = createSlice({
  name: "productsPage",
  initialState,
  reducers: {
    setChosenProduct: (state, action) => {
      state.chosenProduct = action.payload;
    },

    setProducts: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const { setChosenProduct, setProducts } = productsPageSlice.actions;

const ProductsPageReducer = productsPageSlice.reducer;

export default ProductsPageReducer;