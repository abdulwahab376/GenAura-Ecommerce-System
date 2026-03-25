import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  tax: 0,
  taxRate: 0.05,
  grandTotal: 0,
  isOpen: false, //  1. Cart open/close check karne ke liye state add ki
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    //  2. Cart ko kholne ya band karne ka function
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    addToCart: (state, action) => {
      const isExist = state.products.find(
        (product) => product._id === action.payload._id
      );
      if (!isExist) {
        state.products.push({ ...action.payload, quantity: 1 });
      }
      state.selectedItems = selectSelectedItems(state);
      state.totalPrice = selectTotalPrice(state);
      state.tax = selectTax(state);
      state.grandTotal = selectGrandTotal(state);
    },
    updateQuantity: (state, action) => {
      state.products.forEach((product) => {
        if (product._id === action.payload.id) {
          if (action.payload.type === "increment") {
            product.quantity += 1;
          } else if (action.payload.type === "decrement" && product.quantity > 1) {
            product.quantity -= 1;
          }
        }
      });
      state.selectedItems = selectSelectedItems(state);
      state.totalPrice = selectTotalPrice(state);
      state.tax = selectTax(state);
      state.grandTotal = selectGrandTotal(state);
    },
    removeFromCart: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload.id
      );
      state.selectedItems = selectSelectedItems(state);
      state.totalPrice = selectTotalPrice(state);
      state.tax = selectTax(state);
      state.grandTotal = selectGrandTotal(state);
    },
    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.tax = 0;
      state.grandTotal = 0;
      state.isOpen = false; //  Cart clear ho toh band bhi ho jaye
    },
  },
});

export const selectSelectedItems = (state) =>
  state.products.reduce((total, product) => Number(total + product.quantity), 0);

export const selectTotalPrice = (state) =>
  state.products.reduce((total, product) => Number(total + product.quantity * product.price), 0);

export const selectTax = (state) => selectTotalPrice(state) * state.taxRate;

export const selectGrandTotal = (state) => {
  return selectTotalPrice(state) + selectTotalPrice(state) * state.taxRate;
};

//  3. toggleCart ko yahan export zaroor karna hai
export const { addToCart, updateQuantity, removeFromCart, clearCart, toggleCart } =
  cartSlice.actions;

export default cartSlice.reducer;