import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Determine whether Firebase is configured via environment variables
const REQUIRED_FIREBASE_ENV_VARS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
];

export const isFirebaseConfigured: boolean = REQUIRED_FIREBASE_ENV_VARS.every(
  (key) => Boolean((import.meta as any).env?.[key])
);

// Firebase configuration (prefer environment variables)
// Note: Fallbacks are kept for compatibility, but isFirebaseConfigured guards actual usage paths.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics (only in production and browser)
let analytics;
if (typeof window !== "undefined" && !window.location.hostname.includes("localhost")) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Analytics initialization failed:", error);
  }
}

// Only connect to emulators if explicitly enabled via environment variable
// This prevents accidental emulator connections in production
const USE_EMULATORS =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") &&
  import.meta.env.DEV &&
  !isFirebaseConfigured;

if (USE_EMULATORS) {
      // Development mode: Attempting to connect to Firebase emulators
  try {
    // Connect to Auth emulator if not already connected
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
          // Connected to Auth emulator
    
    // Connect to Firestore emulator if not already connected  
    connectFirestoreEmulator(db, "localhost", 8080);
          // Connected to Firestore emulator
  } catch (error) {
    // Emulators might already be connected or not running, use production
    console.warn("⚠️ Emulator connection failed, using production Firebase:", error.message);
  }
} else {
  // Using production Firebase services or running with unconfigured env (guarded by isFirebaseConfigured)
}

// Utility function to diagnose Firebase connection issues
export const diagnoseFirebaseConnection = async () => {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    online: navigator.onLine,
    connection: (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection,
    environment: {
      hostname: window.location.hostname,
      isDev: import.meta.env.DEV,
      useEmulators: USE_EMULATORS,
    },
    firebaseConfig: {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      hasApiKey: !!firebaseConfig.apiKey,
    },
    tests: [] as string[],
  };

  try {
    // Test basic connectivity
    const response = await fetch('https://www.google.com/generate_204', { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    diagnostics.tests.push(`✅ Basic connectivity: OK`);
  } catch (error) {
    diagnostics.tests.push(`❌ Basic connectivity: FAILED - ${error.message}`);
  }

  try {
    // Test Firebase Auth endpoint
    const authResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${firebaseConfig.projectId}`, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    diagnostics.tests.push(`✅ Firebase Auth API: OK`);
  } catch (error) {
    diagnostics.tests.push(`❌ Firebase Auth API: FAILED - ${error.message}`);
  }

      // Firebase Connection Diagnostics
  return diagnostics;
};

export { analytics };
export default app;
