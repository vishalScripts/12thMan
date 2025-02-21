import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  token: null,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.status = true;
      state.token = action.payload.token;
      state.userData = action.payload.data;
    },
    logoutUser: (state) => {
      state.status = false;
      state.token = null;
      state.userData = null;
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
