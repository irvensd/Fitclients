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
  trialEnd?: string | null;
  subscriptionId?: string;
  customerId?: string;
}

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  isOnTrial: boolean;
  trialDaysLeft: number;
  getCurrentPlan: () => typeof SUBSCRIPTION_PLANS.FREE;
  hasFeatureAccess: (feature: string) => boolean;
  refreshSubscription: () => Promise<void>;
  updateSubscriptionPlan: (planId: string) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    () => {
      // Check for persisted subscription data
      const saved = localStorage.getItem("subscription_data");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fall through to default
        }
      }

      // Default to Professional plan (trial period is over)
      return {
        status: "active",
        currentPlan: "professional",
        trialEnd: null,
        subscriptionId: "sub_professional123",
        customerId: "cus_professional123",
      };
    },
  );

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

  const hasFeatureAccess = (feature: string) => {
    const currentPlan = getCurrentPlan();

    // Free plan restrictions
    if (currentPlan.id === "free") {
      const restrictedFeatures = [
        "advanced-analytics",
        "api-access",
        "white-label",
        "multi-trainer",
        "sms-reminders",
        "priority-support",
      ];
      return !restrictedFeatures.includes(feature);
    }

    // Professional plan restrictions
    if (currentPlan.id === "professional") {
      const goldOnlyFeatures = [
        "api-access",
        "white-label",
        "multi-trainer",
        "advanced-analytics",
      ];
      return !goldOnlyFeatures.includes(feature);
    }

    // Gold has access to everything
    return true;
  };

  const refreshSubscription = async () => {
    // In a real app, this would fetch the latest subscription data from the server
    console.log("Refreshing subscription data...");
  };

  const updateSubscriptionPlan = (planId: string) => {
    const newSubscription: SubscriptionData = {
      status: "active",
      currentPlan: planId,
      trialEnd: null,
      subscriptionId: `sub_${planId}_${Date.now()}`,
      customerId: `cus_${planId}_${Date.now()}`,
    };

    setSubscription(newSubscription);
    // Persist to localStorage
    localStorage.setItem("subscription_data", JSON.stringify(newSubscription));
    console.log(`Subscription updated to ${planId} plan`);
  };

  const value = {
    subscription,
    isOnTrial,
    trialDaysLeft,
    getCurrentPlan,
    hasFeatureAccess,
    refreshSubscription,
    updateSubscriptionPlan,
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

export { SubscriptionProvider };
