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
import { logger, logApiError } from "@/lib/logger";
import { handleError, retryOperation } from "@/lib/errorHandling";
import { setSentryUser, clearSentryUser, addSentryBreadcrumb } from "@/lib/sentry";

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
    // Set a longer timeout to allow Firebase auth to properly initialize
    // especially important when computer wakes up from sleep
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000); // Increased timeout to 5 seconds for better reliability

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        clearTimeout(timeoutId);
        setUser(user);
        
        // Set Sentry user context
        if (user) {
          setSentryUser({
            id: user.uid,
            email: user.email || undefined,
            name: user.displayName || undefined,
            role: 'trainer'
          });
          addSentryBreadcrumb('User authenticated', 'auth', 'info', {
            userId: user.uid,
            email: user.email
          });
        } else {
          clearSentryUser();
          addSentryBreadcrumb('User signed out', 'auth', 'info');
        }
        
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
          const mockUser = { 
            email: parsedUser.email,
            uid: parsedUser.uid || "demo-user-123"
          } as User;
          setUser(mockUser);
          
          // Set Sentry user context for demo user
          setSentryUser({
            id: mockUser.uid,
            email: mockUser.email || undefined,
            name: parsedUser.displayName || undefined,
            role: 'demo-trainer'
          });
          addSentryBreadcrumb('Demo user authenticated', 'auth', 'info', {
            userId: mockUser.uid,
            email: mockUser.email
          });
        }
      } catch (error) {
        logApiError("parsing stored user", error);
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
      const { userMessage } = handleError(error, "user login", { email });
      setAuthError(userMessage);
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

          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          
          if (userCredential.user) {
            await updateProfile(userCredential.user, { displayName: `${firstName} ${lastName}` });
            
            // Create user profile in Firestore
            try {
              const profileData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                displayName: `${firstName} ${lastName}`,
                selectedPlan: planId || "starter", // Save the selected plan to the profile
              };
              const createdProfile = await userProfileService.createUserProfile(userCredential.user.uid, profileData);
              
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
                    
                    // Referral created successfully
                  } else {
                    console.warn("Invalid referral code:", referralCode);
                  }
                } catch (referralError) {
                  logApiError("processing referral code", referralError, { referralCode, userId: userCredential.user.uid });
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
                  // User registered with selected plan
                } catch (subscriptionError) {
                  logApiError("setting up subscription", subscriptionError, { planId, userId: userCredential.user.uid });
                  // Don't fail registration if subscription setup fails
                }
              }
            } catch (profileError) {
              logApiError("creating user profile", profileError, { userId: userCredential.user.uid, email });
              // Don't throw here as the user is already created in Firebase Auth
            }
          }
          
          return; // Success, exit the retry loop
          
        } catch (error: any) {
          logApiError(`registration attempt ${retryCount + 1} failed`, error, { 
            attempt: retryCount + 1, 
            maxRetries, 
            email 
          });
          retryCount++;
          
          if (retryCount >= maxRetries) {
            logApiError("all registration attempts failed", error, { email, totalAttempts: retryCount });
            const { userMessage } = handleError(error, "user registration", { email });
            setAuthError(userMessage);
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
      // Clear Sentry user context before logout
      clearSentryUser();
      addSentryBreadcrumb('User logout initiated', 'auth', 'info');
      
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
      // Always clear local storage and state for both Firebase and dev mode
      setDevUser(null);
      setUser(null);
      localStorage.removeItem("devUser");

      addSentryBreadcrumb('User logout completed', 'auth', 'info');
      
      // Force redirect to login page
      window.location.href = "/login";
    } catch (error) {
      logApiError("logout error", error);
      addSentryBreadcrumb('User logout failed', 'auth', 'error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      
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
      logApiError("updating user profile", error, { userId: user.uid, updates });
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
            const profile = await userProfileService.getUserProfile(user.uid);
            if (profile) {
              setUserProfile(profile);
            } else {
              // If profile doesn't exist, create it with basic info
              if (user.email) {
                const nameParts = user.displayName?.split(' ') || ['', ''];
                const newProfileData = {
                  email: user.email,
                  firstName: nameParts[0] || '',
                  lastName: nameParts.slice(1).join(' ') || '',
                  displayName: user.displayName || '',
                };
                await userProfileService.createUserProfile(user.uid, newProfileData);
                // Try loading again
                const newProfile = await userProfileService.getUserProfile(user.uid);
                setUserProfile(newProfile);
              }
            }
          } catch (error) {
            logApiError("loading user profile", error, { userId: user.uid });
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
