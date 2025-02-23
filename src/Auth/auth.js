import { Account, Client } from "appwrite";
import conf from "../conf/conf";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async login() {
    try {
      await this.account.createOAuth2Session(
        "google",
        conf.authSucessUrl,
        conf.authFauilureUrl,
        ["https://www.googleapis.com/auth/calendar"],
        "access_type=offline&prompt=consent"
      );
    } catch (error) {
      console.error("Login Error:", error);
    }
  }

  async logout() {
    try {
      await this.account.deleteSession("current");
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }

  // New method: refresh the access token using the refresh token
  async refreshToken() {
    try {
      const session = await this.account.getSession("current");
      const refreshToken = session.providerRefreshToken;
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      // Call Google’s token endpoint
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: conf.googleClientId, // make sure this is in your conf
          client_secret: conf.googleClientSecret, // make sure this is in your conf
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error refreshing token", data);
        throw new Error(data.error);
      }
      console.log("Token refreshed:", data);
      // data.access_token now contains the new access token
      return {
        token: data.access_token,
        expires_in: data.expires_in,
      };
    } catch (error) {
      console.error("Error refreshing token", error);
      return null;
    }
  }

  async getSession() {
    try {
      const session = await this.account.getSession("current");
      // Check token expiry using providerAccessTokenExpiry (assumed to be an ISO string)
      if (session.providerAccessTokenExpiry) {
        const expiresAt = new Date(session.providerAccessTokenExpiry).getTime();
        const now = new Date().getTime();
        if (now > expiresAt) {
          // Token expired: attempt to refresh it
          const refreshed = await this.refreshToken();
          if (!refreshed) throw new Error("Could not refresh token");
          return {
            token: refreshed.token,
            data: await this.getUser(),
          };
        }
      }
      return {
        token: session.providerAccessToken,
        data: await this.getUser(),
      };
    } catch (error) {
      console.error("Error fetching session", error);
      return null;
    }
  }

  async getUser() {
    try {
      const data = await this.account.get();
      console.log("User Data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching user data", error);
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;
