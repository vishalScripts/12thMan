import { createSlice } from "@reduxjs/toolkit";

const loadState = () => {
  try {
    const stored = localStorage.getItem("themeSettings");
    return stored
      ? JSON.parse(stored)
      : {
          theme: "light",
          layoutType: "normal",
          themeBackground: "",
          navbarHidden: false,
          isSidebarHidden: false,
        };
  } catch {
    return {
      theme: "dark",
      layoutType: "normal",
      themeBackground: "",
      navbarHidden: false,
      isSidebarHidden: false,
    };
  }
};

const initialState = loadState();

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      if (state.theme !== action.payload) {
        state.theme = action.payload;
        localStorage.setItem("themeSettings", JSON.stringify(state));
      }
    },
    changeThemeStructure: (state, action) => {
      state.layoutType = action.payload;
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
    toggleSidebar: (state, action) => {
      state.isSidebarHidden = action.payload;
      localStorage.setItem("themeSettings", JSON.stringify(state));
    },
  },
});

export const {
  setTheme,
  changeThemeStructure,
  changeBackground,
  hideNavbar,
  toggleSidebar,
} = themeSlice.actions;

export default themeSlice.reducer;
