import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import {
  SUBSCRIPTION_PLANS,
  TRIAL_PERIOD_DAYS,
  getSubscriptionStatus,
  canExceedLimit,
} from "@/lib/stripe";
import { billingHistoryService, referralService } from "@/lib/firebaseService";
import { userProfileService } from "@/lib/firebaseService";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  isTrialExpired: boolean;
  hasValidPaymentMethod: boolean;
  isServiceSuspended: boolean;
  getCurrentPlan: () => typeof SUBSCRIPTION_PLANS.STARTER;
  hasFeatureAccess: (feature: string) => boolean;
  refreshSubscription: () => Promise<void>;
  updateSubscriptionPlan: (
    planId: string,
    userId?: string,
    onDowngradeClients?: (newLimit: number, selectedIds: string[]) => void,
  ) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    () => {
      // Check for persisted subscription data
      const saved = localStorage.getItem("subscription_data");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          console.log("Loaded subscription from localStorage:", parsed);
          return parsed;
        } catch {
          console.log("Failed to parse localStorage subscription data");
          // Fall through to default
        }
      }

      // Default to Pro plan (trial period is over)
      // For testing trial expiration, uncomment the line below:
      // return {
      //   status: "trialing",
      //   currentPlan: "starter",
      //   trialEnd: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      //   subscriptionId: "sub_trial123",
      //   customerId: "cus_trial123",
      // };
      return {
        status: "active",
        currentPlan: "pro",
        trialEnd: null,
        subscriptionId: "sub_pro123",
        customerId: "cus_pro123",
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

  // Check if trial has expired
  const isTrialExpired = React.useMemo(() => {
    return isOnTrial && trialDaysLeft <= 0;
  }, [isOnTrial, trialDaysLeft]);

  // Check if user has valid payment method (mock implementation)
  const hasValidPaymentMethod = React.useMemo(() => {
    // In a real app, this would check Stripe for valid payment methods
    // For now, we'll simulate based on user email
    return user?.email?.includes("paid") || user?.email === "trainer@demo.com";
  }, [user]);

  // Check if service should be suspended
  const isServiceSuspended = React.useMemo(() => {
    return isTrialExpired && !hasValidPaymentMethod;
  }, [isTrialExpired, hasValidPaymentMethod]);

  const getCurrentPlan = () => {
    const planId = subscription?.currentPlan || "free";
    console.log("getCurrentPlan - subscription?.currentPlan:", subscription?.currentPlan, "planId:", planId);
    const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId);
    console.log("getCurrentPlan - found plan:", plan);
    return plan || SUBSCRIPTION_PLANS.STARTER;
  };

  const hasFeatureAccess = (feature: string) => {
    const currentPlan = getCurrentPlan();

    // Starter plan restrictions
    if (currentPlan.id === "starter") {
      const restrictedFeatures = [
        "ai-recommendations",
        "advanced-analytics",
        "api-access",
        "white-label",
        "multi-trainer",
        "priority-support",
      ];
      return !restrictedFeatures.includes(feature);
    }

    // Pro and Lifetime plans have access to everything
    if (currentPlan.id === "pro" || currentPlan.id === "lifetime") {
      return true;
    }

    // Free plan (fallback) - very limited
    const restrictedFeatures = [
      "advanced-analytics",
      "api-access",
      "white-label",
      "multi-trainer",
      "sms-reminders",
      "priority-support",
      "ai-recommendations",
    ];
    return !restrictedFeatures.includes(feature);
  };

  const refreshSubscription = async () => {
    // In a real app, this would fetch the latest subscription data from the server
    console.log("Refreshing subscription data...");
  };

  const updateSubscriptionPlan = async (
    planId: string,
    userId?: string,
    onDowngradeClients?: (newLimit: number, selectedIds: string[]) => void,
  ) => {
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

    // Initialize billing history for new paid subscribers
    try {
      if (userId && planId !== "free") {
        await billingHistoryService.initializeBillingHistory(userId, planId);
        
        // Check if user was referred and complete the referral
        if (userId) {
          try {
            const userProfile = await userProfileService.getUserProfile(userId);
            if (userProfile?.referredBy) {
              // Find the referral record and complete it
              const referralsRef = collection(db, "referrals");
              const q = query(
                referralsRef,
                where("referrerId", "==", userProfile.referredBy),
                where("referredUserId", "==", userId)
              );
              const querySnapshot = await getDocs(q);
              
              if (!querySnapshot.empty) {
                const referralDoc = querySnapshot.docs[0];
                await referralService.completeReferral(referralDoc.id, planId);
                console.log("Referral completed and rewards granted");
              }
            }
          } catch (referralError) {
            console.error("Error processing referral completion:", referralError);
            // Don't fail subscription update if referral processing fails
          }
        }
      }
    } catch (error) {
      console.error("Error initializing billing history:", error);
    }

    // Handle client downgrade if callback provided
    if (onDowngradeClients) {
      const newPlan = Object.values(SUBSCRIPTION_PLANS).find(
        (p) => p.id === planId,
      );
      if (newPlan) {
        onDowngradeClients(newPlan.limits.clients, []);
      }
    }
  };

  const value = {
    subscription,
    isOnTrial,
    trialDaysLeft,
    isTrialExpired,
    hasValidPaymentMethod,
    isServiceSuspended,
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
