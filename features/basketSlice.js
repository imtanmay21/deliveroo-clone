import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    removeFromBasket: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        let updatedItems = [...state.items];
        updatedItems.splice(index, 1);
        state.items = updatedItems;
      } else {
        console.warn("No item to remove from the basket");
      }
    },
  },
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Memoized selectors using reselect
export const selectBasketItems = (state) => state.basket.items;

export const selectBasketItemsWithId = createSelector(
  [selectBasketItems, (_, id) => id], // Input selectors
  (basketItems, id) => basketItems.filter((item) => item.id === id) // Output selector
);

export const selectBasketTotal = createSelector(
  [selectBasketItems],
  (basketItems) => basketItems.reduce((total, item) => (total += item.price), 0)
);

export default basketSlice.reducer;
