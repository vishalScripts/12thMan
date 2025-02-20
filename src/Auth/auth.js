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
        "http://localhost:5173/calendar",
        "http://localhost:5173/login",
        ["https://www.googleapis.com/auth/calendar"] // Add required scopes
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

  async getSession() {
    try {
      const session = await this.account.getSession("current");
      console.log("Session Data:", session);

      return {
        token: session?.providerAccessToken, // Google OAuth token
        userId: session?.userId,
        email: session?.providerUid,
        name: session?.name,
      };
    } catch (error) {
      console.error("Error fetching session", error);
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;
