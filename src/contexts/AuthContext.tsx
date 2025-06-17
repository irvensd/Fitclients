import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isDevMode: boolean;
  authError: string | null;
  clearError: () => void;
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
  const [loading, setLoading] = React.useState(true);
  const [devUser, setDevUser] = React.useState<any>(null);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const isDevMode = !isFirebaseConfigured;

  React.useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Development mode - check for stored dev session
      try {
        const storedUser = localStorage.getItem("devUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setDevUser(parsedUser);
          setUser({ email: parsedUser.email } as User);
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("devUser");
      }
      setLoading(false);
    }
  }, []);

  const login = React.useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      // Always allow demo account to work regardless of Firebase configuration
      if (email === "trainer@demo.com" && password === "demo123") {
        const mockUser = { email, displayName: "Demo Trainer" };
        setDevUser(mockUser);
        setUser({ email } as User);
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
    async (email: string, password: string, displayName: string) => {
      setAuthError(null);
      try {
        if (isFirebaseConfigured && auth) {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          if (userCredential.user) {
            await updateProfile(userCredential.user, { displayName });
          }
        } else {
          throw new Error("Registration not available in development mode.");
        }
      } catch (error: any) {
        console.error("Registration error:", error);

        if (error.code === "auth/email-already-in-use") {
          setAuthError(
            "An account with this email already exists. Please sign in instead.",
          );
        } else if (error.code === "auth/weak-password") {
          setAuthError("Password should be at least 6 characters long.");
        } else if (error.code === "auth/invalid-email") {
          setAuthError("Invalid email address format.");
        } else {
          setAuthError(
            error.message || "Registration failed. Please try again.",
          );
        }
        throw error;
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

  const value = React.useMemo(
    () => ({
      user: isDevMode
        ? devUser
          ? ({ email: devUser.email } as User)
          : null
        : user,
      loading,
      login,
      register,
      logout,
      isDevMode,
      authError,
      clearError,
    }),
    [
      user,
      loading,
      login,
      register,
      logout,
      isDevMode,
      devUser,
      authError,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
