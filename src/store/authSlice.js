import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("authToken") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.token = action.payload.token;
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
