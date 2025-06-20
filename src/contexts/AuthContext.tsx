import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured, diagnoseFirebaseConnection } from "@/lib/firebase";
import { userProfileService } from "@/lib/firebaseService";
import { UserProfile } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isDevMode: boolean;
  authError: string | null;
  clearError: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [devUser, setDevUser] = React.useState<any>(null);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const isDevMode = !isFirebaseConfigured;

  React.useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log("Auth timeout - setting loading to false");
      setLoading(false);
    }, 1000); // Reduced timeout to 1 second

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        clearTimeout(timeoutId);
        setUser(user);
        setLoading(false);
      });
      return () => {
        clearTimeout(timeoutId);
        unsubscribe();
      };
    } else {
      // Development mode - check for stored dev session
      try {
        const storedUser = localStorage.getItem("devUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setDevUser(parsedUser);
          setUser({ 
            email: parsedUser.email,
            uid: parsedUser.uid || "demo-user-123"
          } as User);
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("devUser");
      }
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      // Always allow demo account to work regardless of Firebase configuration
      if (email === "trainer@demo.com" && password === "demo123") {
        const mockUser = { 
          email, 
          displayName: "Demo Trainer",
          uid: "demo-user-123" // Add a proper UID for demo user
        };
        setDevUser(mockUser);
        setUser({ 
          email,
          uid: "demo-user-123"
        } as User);
        localStorage.setItem("devUser", JSON.stringify(mockUser));
        return; // Exit early for demo account
      }

      // Firebase authentication for real accounts
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Development mode fallback
        throw new Error(
          "Invalid credentials. Use trainer@demo.com / demo123 for demo access.",
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Provide user-friendly error messages
      if (
        error.code === "auth/invalid-login-credentials" ||
        error.code === "auth/user-not-found"
      ) {
        setAuthError(
          "No account found with these credentials. Please check your email and password, create a new account, or use the demo account (trainer@demo.com / demo123).",
        );
      } else if (error.code === "auth/wrong-password") {
        setAuthError("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        setAuthError("Invalid email address format.");
      } else if (error.code === "auth/too-many-requests") {
        setAuthError("Too many failed attempts. Please try again later.");
      } else {
        setAuthError(error.message || "Login failed. Please try again.");
      }
      throw error;
    }
  }, []);

  const register = React.useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      setAuthError(null);
      
      // Retry logic for network issues
      const maxRetries = 3;
      let retryCount = 0;
      
      while (retryCount < maxRetries) {
        try {
          if (!isFirebaseConfigured || !auth) {
            throw new Error("Firebase is not properly configured. Please check your setup.");
          }

          console.log(`Registration attempt ${retryCount + 1} for email: ${email}`);
          
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          
          if (userCredential.user) {
            await updateProfile(userCredential.user, { displayName: `${firstName} ${lastName}` });
            console.log("Registration successful for:", email);
            
            // Create user profile in Firestore
            try {
              const profileData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                displayName: `${firstName} ${lastName}`,
              };
              console.log("Creating user profile during registration:", profileData);
              
              const createdProfile = await userProfileService.createUserProfile(userCredential.user.uid, profileData);
              
              console.log("User profile created successfully:", createdProfile);
              
              // Set the profile immediately after creation
              setUserProfile(createdProfile);
            } catch (profileError) {
              console.error("Failed to create user profile:", profileError);
              // Don't throw here as the user is already created in Firebase Auth
            }
          }
          
          return; // Success, exit the retry loop
          
        } catch (error: any) {
          console.error(`Registration attempt ${retryCount + 1} failed:`, error);
          retryCount++;

          // Handle specific Firebase errors
          if (error.code === "auth/network-request-failed") {
            if (retryCount < maxRetries) {
              console.log(`Network error, retrying in ${retryCount * 1000}ms...`);
              await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
              continue; // Retry
            } else {
              // Run diagnostics on final network failure
              console.log("Running Firebase connection diagnostics...");
              await diagnoseFirebaseConnection();
              setAuthError(
                "Network connection failed. Please check your internet connection and try again. Check the console for detailed diagnostics."
              );
            }
          } else if (error.code === "auth/email-already-in-use") {
            setAuthError(
              "An account with this email already exists. Please sign in instead."
            );
            break; // Don't retry for this error
          } else if (error.code === "auth/weak-password") {
            setAuthError("Password should be at least 6 characters long.");
            break; // Don't retry for this error
          } else if (error.code === "auth/invalid-email") {
            setAuthError("Invalid email address format.");
            break; // Don't retry for this error
          } else if (error.code === "auth/operation-not-allowed") {
            setAuthError(
              "Email/password accounts are not enabled. Please contact support."
            );
            break; // Don't retry for this error
          } else {
            if (retryCount < maxRetries) {
              console.log(`Unknown error, retrying in ${retryCount * 1000}ms...`);
              await new Promise(resolve => setTimeout(resolve, retryCount * 1000));
              continue; // Retry for unknown errors
            } else {
              setAuthError(
                error.message || "Registration failed. Please try again."
              );
            }
          }
          
          if (retryCount >= maxRetries) {
            throw error; // Re-throw after max retries
          }
        }
      }
    },
    [],
  );

  const logout = React.useCallback(async () => {
    setAuthError(null);
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
      // Always clear local storage and state for both Firebase and dev mode
      setDevUser(null);
      setUser(null);
      localStorage.removeItem("devUser");

      // Force redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if Firebase logout fails, clear local state
      setDevUser(null);
      setUser(null);
      localStorage.removeItem("devUser");
      window.location.href = "/login";
    }
  }, []);

  const clearError = React.useCallback(() => {
    setAuthError(null);
  }, []);

  const updateUserProfile = React.useCallback(async (updates: Partial<UserProfile>) => {
    if (!user?.uid) {
      throw new Error("User not authenticated");
    }
    
    try {
      await userProfileService.updateUserProfile(user.uid, updates);
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error("Failed to update user profile:", error);
      throw error;
    }
  }, [user]);

  // Load user profile when user changes
  React.useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.uid && isFirebaseConfigured) {
        // Add a small delay to ensure auth state is fully settled
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
          console.log("Loading user profile for UID:", user.uid);
          console.log("User email:", user.email);
          console.log("User displayName:", user.displayName);
          
          const profile = await userProfileService.getUserProfile(user.uid);
          console.log("Loaded user profile:", profile);
          
          if (profile) {
            setUserProfile(profile);
          } else {
            // If profile doesn't exist, create it with basic info
            console.log("No profile found, creating default profile");
            if (user.email) {
              const nameParts = user.displayName?.split(' ') || ['', ''];
              const newProfileData = {
                email: user.email,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                displayName: user.displayName || '',
              };
              console.log("Creating profile with data:", newProfileData);
              
              await userProfileService.createUserProfile(user.uid, newProfileData);
              
              // Try loading again
              const newProfile = await userProfileService.getUserProfile(user.uid);
              console.log("Newly created profile:", newProfile);
              setUserProfile(newProfile);
            }
          }
        } catch (error) {
          console.error("Failed to load user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const value = React.useMemo(
    () => ({
      user: isDevMode
        ? devUser
          ? ({ 
              email: devUser.email,
              uid: devUser.uid || "demo-user-123"
            } as User)
          : null
        : user,
      userProfile,
      loading,
      login,
      register,
      logout,
      isDevMode,
      authError,
      clearError,
      updateUserProfile,
    }),
    [
      user,
      userProfile,
      loading,
      login,
      register,
      logout,
      isDevMode,
      devUser,
      authError,
      clearError,
      updateUserProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
