import { createSlice } from "@reduxjs/toolkit";

// Load initial state from local storage
const loadState = () => {
  try {
    const storedState = localStorage.getItem("themeSettings");
    return storedState
      ? JSON.parse(storedState)
      : { modern: false, themeBackground: "", navbarHidden: false };
  } catch (error) {
    console.error("Error loading theme settings:", error);
    return { modern: false, themeBackground: "", navbarHidden: false };
  }
};

// Initial state with local storage support
const initialState = loadState();

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    changeThemeStructure: (state, action) => {
      state.modern = action.payload;
      localStorage.setItem("themeSettings", JSON.stringify(state));
    },
    changeBackground: (state, action) => {
      state.themeBackground = action.payload;
      localStorage.setItem("themeSettings", JSON.stringify(state));
    },
    hideNavbar: (state, action) => {
      state.navbarHidden = action.payload;
      localStorage.setItem("themeSettings", JSON.stringify(state));
    },
  },
});

export const { changeThemeStructure, changeBackground, hideNavbar } =
  themeSlice.actions;
export default themeSlice.reducer;
