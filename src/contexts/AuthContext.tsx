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
import { userProfileService, referralService } from "@/lib/firebaseService";
import { UserProfile } from "@/lib/types";

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isDemoUser: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    referralCode?: string,
    planId?: string
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
  const isDemoUser = user?.email === 'trainer@demo.com';

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
    async (email: string, password: string, firstName: string, lastName: string, referralCode?: string, planId?: string) => {
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
                selectedPlan: planId || "starter", // Save the selected plan to the profile
              };
              console.log("Creating user profile during registration:", profileData);
              
              const createdProfile = await userProfileService.createUserProfile(userCredential.user.uid, profileData);
              
              console.log("User profile created successfully:", createdProfile);
              
              // Handle referral code if provided
              if (referralCode) {
                try {
                  const validation = await referralService.validateReferralCode(referralCode);
                  if (validation.valid && validation.referrerId && validation.referrerEmail) {
                    // Create referral record
                    await referralService.createReferral(
                      validation.referrerId,
                      userCredential.user.uid,
                      validation.referrerEmail,
                      email
                    );
                    
                    // Update user profile with referral info
                    await userProfileService.updateUserProfile(userCredential.user.uid, {
                      referredBy: validation.referrerId,
                    });
                    
                    console.log("Referral created successfully for:", referralCode);
                  } else {
                    console.warn("Invalid referral code:", referralCode);
                  }
                } catch (referralError) {
                  console.error("Error processing referral code:", referralError);
                  // Don't fail registration if referral processing fails
                }
              }
              
              // Set the profile immediately after creation
              setUserProfile(createdProfile);
              
              // Set up subscription with selected plan
              if (planId) {
                try {
                  // Store the selected plan in localStorage for the subscription context to pick up
                  localStorage.setItem('selected_plan', planId);
                  console.log(`User registered with plan: ${planId}`);
                } catch (subscriptionError) {
                  console.error("Error setting up subscription:", subscriptionError);
                  // Don't fail registration if subscription setup fails
                }
              }
            } catch (profileError) {
              console.error("Failed to create user profile:", profileError);
              // Don't throw here as the user is already created in Firebase Auth
            }
          }
          
          return; // Success, exit the retry loop
          
        } catch (error: any) {
          console.error(`Registration attempt ${retryCount + 1} failed:`, error);
          retryCount++;
          
          if (retryCount >= maxRetries) {
            console.error("All registration attempts failed");
            setAuthError(
              error.code === "auth/email-already-in-use"
                ? "An account with this email already exists. Please try logging in instead."
                : error.code === "auth/weak-password"
                ? "Password is too weak. Please choose a stronger password."
                : error.code === "auth/invalid-email"
                ? "Please enter a valid email address."
                : error.code === "auth/network-request-failed"
                ? "Network error. Please check your connection and try again."
                : "Registration failed. Please try again."
            );
            throw error;
          }
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }
    },
    []
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
      if (user?.uid) {
        // Skip Firebase for demo users
        if (isDemoUser) {
          // Set mock profile for demo users
          const mockProfile: UserProfile = {
            id: "demo-user-123",
            email: "trainer@demo.com",
            firstName: "Demo",
            lastName: "Trainer",
            displayName: "Demo Trainer",
            createdAt: new Date().toISOString(),
          };
          setUserProfile(mockProfile);
          return;
        }
        
        if (isFirebaseConfigured) {
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
        }
      } else {
        setUserProfile(null);
      }
    };

    if (user) {
      loadUserProfile();
    }
  }, [user, isDemoUser]);

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
      isDemoUser,
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
      isDemoUser,
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
