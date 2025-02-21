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
        ["https://www.googleapis.com/auth/calendar"]
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
      console.log("dfhdsfjdskjfsdjfsd", conf);
      const session = await this.account.getSession("current");
      console.log("Session Data:", session);
      const data = await this.getUser();

      return {
        token: session?.providerAccessToken,
        data,
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
