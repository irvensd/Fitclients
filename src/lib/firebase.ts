import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Production Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6YfS9EqFjpgbjzfBLGR90uTwt5-lJ8j4",
  authDomain: "fitclients-4c5f2.firebaseapp.com",
  projectId: "fitclients-4c5f2",
  storageBucket: "fitclients-4c5f2.firebasestorage.app",
  messagingSenderId: "407177727116",
  appId: "1:407177727116:web:1f537948f3fd4b1e18ffa9",
  measurementId: "G-BEWLBZ55RR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in production)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics };
export const isFirebaseConfigured = true;
export default app;
