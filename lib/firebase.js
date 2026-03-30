import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Useful for uploading child photos later

// 1. Your Firebase Configuration
// We use process.env to keep keys out of the source code
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 2. Initialize Firebase
// In Next.js, this code runs both on the server and the client.
// 'getApps().length' checks if the app is already initialized to prevent errors during Hot Reloading.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. Export Services
// These are the "tools" we use in our pages
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;