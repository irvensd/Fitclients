import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
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
const USE_EMULATORS = false; // Temporarily disabled to fix network issues
// const USE_EMULATORS = typeof window !== "undefined" && 
//   (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") &&
//   import.meta.env.DEV; // Only in development mode

if (USE_EMULATORS) {
  console.log("🔧 Development mode: Attempting to connect to Firebase emulators...");
  try {
    // Connect to Auth emulator if not already connected
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    console.log("✅ Connected to Auth emulator");
    
    // Connect to Firestore emulator if not already connected  
    connectFirestoreEmulator(db, "localhost", 8080);
    console.log("✅ Connected to Firestore emulator");
  } catch (error) {
    // Emulators might already be connected or not running, use production
    console.warn("⚠️ Emulator connection failed, using production Firebase:", error.message);
  }
} else {
  console.log("🚀 Using production Firebase services");
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

  console.log("🔍 Firebase Connection Diagnostics:", diagnostics);
  return diagnostics;
};

export { analytics };
export const isFirebaseConfigured = true;
export default app;
