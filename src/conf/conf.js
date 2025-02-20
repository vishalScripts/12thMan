const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  googleCLientId: String(import.meta.env.VITE_GOOGLE_CLIENT_ID),
  googleApiKey: String(import.meta.env.VITE_GOOGLE_API_KEY),
};

export default conf;
