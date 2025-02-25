const authService = {
  login: async (token, user) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(user));
    return true;
  },

  getStoredUser: () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("userData");
    if (token && user) {
      return JSON.parse(user);
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  }
};

export default authService;
