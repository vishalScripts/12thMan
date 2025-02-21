const conf = {
  appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  googleCLientId: String(import.meta.env.VITE_GOOGLE_CLIENT_ID),
  googleApiKey: String(import.meta.env.VITE_GOOGLE_API_KEY),
  appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appwriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
  authSucessUrl: String(import.meta.env.VITE_REACT_APP_AUTH_SUCCESS_URL),
  authFauilureUrl: String(import.meta.env.VITE_REACT_APP_AUTH_FAILURE_URL),
};

export default conf;
