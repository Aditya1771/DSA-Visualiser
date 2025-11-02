import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});
