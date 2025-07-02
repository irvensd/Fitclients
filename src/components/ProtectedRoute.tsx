import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isDemoUser } = useAuth();
  const location = useLocation();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Memoize user ID to prevent unnecessary re-renders
  const userId = useMemo(() => user?.uid, [user?.uid]);

  // Use useCallback to memoize the async function
  const checkOnboardingStatus = useCallback(async () => {
    if (!user || !userId || isDemoUser) {
      setCheckingOnboarding(false);
      setNeedsOnboarding(false);
      return;
    }

    try {
      setCheckingOnboarding(true);
      const userDoc = await getDoc(doc(db, "users", userId));
      const userData = userDoc.data();
      
      // Check if user has completed onboarding
      setNeedsOnboarding(!userData?.onboardingCompleted);
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // On error, don't block access but log the issue
      setNeedsOnboarding(false);
    } finally {
      setCheckingOnboarding(false);
    }
  }, [user, userId, isDemoUser]);

  useEffect(() => {
    let isMounted = true;

    const runCheck = async () => {
      if (isMounted) {
        await checkOnboardingStatus();
      }
    };

    runCheck();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [checkOnboardingStatus]);

  if (loading || checkingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to onboarding if needed (except if already on onboarding page)
  if (needsOnboarding && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
