import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeSlice";
// import authService from "../Auth/auth";
import authSlice from "./authSlice";
import tasksSlice from "./tasksSlice";

export default configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
    tasks: tasksSlice,
  },
});
