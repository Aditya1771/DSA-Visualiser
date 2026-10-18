import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slice";
import authReducer from "./authSlice"
import quizReducer from "./quizSlice"

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth:  authReducer,
    quiz: quizReducer
  },
});
