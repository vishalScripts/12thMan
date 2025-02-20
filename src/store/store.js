import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeSlice";
import authService from "../Auth/auth";
import authSlice from "./authSlice";

export default configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
  },
});
