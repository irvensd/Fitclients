import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [devUser, setDevUser] = useState<any>(null);

  const isDevMode = !isFirebaseConfigured;

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Development mode - check for stored dev session
      const storedUser = localStorage.getItem("devUser");
      if (storedUser) {
        setDevUser(JSON.parse(storedUser));
        setUser({ email: JSON.parse(storedUser).email } as User);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
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
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    } else {
      // Development mode - clear local storage
      setDevUser(null);
      setUser(null);
      localStorage.removeItem("devUser");
    }
  };

  const value = {
    user: isDevMode
      ? devUser
        ? ({ email: devUser.email } as User)
        : null
      : user,
    loading,
    login,
    logout,
    isDevMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
