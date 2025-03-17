import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeSlice";
// import authService from "../Auth/auth";
import authSlice from "./authSlice";
import tasksSlice from "./tasksSlice";
import statsSlice from "./statsSlice";
import alarmsSlice from "./alarmsSlice";

export default configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
    tasks: tasksSlice,
    stats: statsSlice,
    alarms: alarmsSlice,
  },
});
