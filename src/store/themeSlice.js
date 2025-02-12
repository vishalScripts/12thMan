import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modern: false,
  themeBackground: "",
  navbarHidden: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeThemeStructure: (state, action) => {
      state.modern = action.payload;
    },
    changeBackground: (state, action) => {
      state.themeBackground = action.payload;
    },

    hideNavbar: (state, action) => {
      state.navbarHidden = action.payload;
    },
  },
});

export const { changeThemeStructure, changeBackground, hideNavbar } =
  themeSlice.actions;

export default themeSlice.reducer;
