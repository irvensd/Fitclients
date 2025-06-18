import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  SUBSCRIPTION_PLANS,
  TRIAL_PERIOD_DAYS,
  getSubscriptionStatus,
  canExceedLimit,
} from "@/lib/stripe";

interface SubscriptionData {
  status: "trialing" | "active" | "canceled" | "past_due" | "unpaid";
  currentPlan: string;
  trialEnd?: string;
  subscriptionId?: string;
  customerId?: string;
}

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  loading: boolean;
  isOnTrial: boolean;
  trialDaysLeft: number;
  canAccessFeature: (feature: string) => boolean;
  canExceedClientLimit: (currentCount: number) => boolean;
  getCurrentPlan: () => typeof SUBSCRIPTION_PLANS.FREE;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const refreshSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const subscriptionData = await getSubscriptionStatus(user.uid);
      setSubscription(subscriptionData);
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
      // Default to free plan on error
      setSubscription({
        status: "canceled",
        currentPlan: "free",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscription();
  }, [user]);

  const isOnTrial = React.useMemo(() => {
    return subscription?.status === "trialing";
  }, [subscription]);

  const trialDaysLeft = React.useMemo(() => {
    if (!isOnTrial || !subscription?.trialEnd) return 0;

    const trialEndDate = new Date(subscription.trialEnd);
    const now = new Date();
    const diffTime = trialEndDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  }, [isOnTrial, subscription]);

  const getCurrentPlan = () => {
    const planId = subscription?.currentPlan || "free";
    const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId);
    return plan || SUBSCRIPTION_PLANS.FREE;
  };

  const canAccessFeature = (feature: string) => {
    const currentPlan = getCurrentPlan();

    // Free plan restrictions
    if (currentPlan.id === "free") {
      const restrictedFeatures = [
        "advanced-analytics",
        "api-access",
        "white-label",
        "multi-trainer",
        "advanced-ai",
      ];
      return !restrictedFeatures.includes(feature);
    }

    // Professional plan restrictions
    if (currentPlan.id === "professional") {
      const enterpriseOnlyFeatures = [
        "api-access",
        "white-label",
        "multi-trainer",
        "advanced-ai",
      ];
      return !enterpriseOnlyFeatures.includes(feature);
    }

    // Enterprise has access to everything
    return true;
  };

  const canExceedClientLimit = (currentCount: number) => {
    const planId = subscription?.currentPlan || "free";
    return canExceedLimit(planId, "clients", currentCount);
  };

  const value: SubscriptionContextType = {
    subscription,
    loading,
    isOnTrial,
    trialDaysLeft,
    canAccessFeature,
    canExceedClientLimit,
    getCurrentPlan,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
};
