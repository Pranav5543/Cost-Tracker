import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import itemsReducer from "./slices/itemsSlice";
import otherCostsReducer from "./slices/otherCostsSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    otherCosts: otherCostsReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable dates in actions
        ignoredActions: ['items/fetchItems/fulfilled', 'otherCosts/fetchOtherCosts/fulfilled', 'items/addItem/fulfilled', 'otherCosts/addOtherCost/fulfilled'],
        // Ignore non-serializable dates in state
        ignoredPaths: ['items.items', 'otherCosts.otherCosts'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
