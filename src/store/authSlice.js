import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  token: null,
  userId: null,
  email: null,
  name: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.status = true;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    logoutUser: (state) => {
      state.status = false;
      state.token = null;
      state.userId = null;
      state.email = null;
      state.name = null;
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
