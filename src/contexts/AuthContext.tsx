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
  logout: () => Promise<void>;
  isDevMode: boolean;
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
    if (isFirebaseConfigured && auth) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      // Development mode - simulate login
      if (email === "trainer@demo.com" && password === "demo123") {
        const mockUser = { email, displayName: "Demo Trainer" };
        setDevUser(mockUser);
        setUser({ email } as User);
        localStorage.setItem("devUser", JSON.stringify(mockUser));
      } else {
        throw new Error(
          "Invalid credentials. Use trainer@demo.com / demo123 for development mode.",
        );
      }
    }
  }, []);

  const logout = React.useCallback(async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    } else {
      // Development mode - clear local storage
      setDevUser(null);
      setUser(null);
      localStorage.removeItem("devUser");
    }
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
      logout,
      isDevMode,
    }),
    [user, loading, login, logout, isDevMode, devUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
