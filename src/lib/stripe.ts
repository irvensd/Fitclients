import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export { stripePromise };

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: "free",
    name: "Starter",
    price: 0,
    interval: "forever",
    features: [
      "Up to 5 clients",
      "Basic session scheduling",
      "Payment tracking",
      "Progress photos",
      "Email support",
    ],
    limits: {
      clients: 5,
      sessions: 50,
      storage: "500MB",
    },
  },
  PROFESSIONAL: {
    id: "professional",
    name: "Professional",
    price: 29,
    interval: "month",
    stripeProductId: "prod_professional", // Will be created in Stripe dashboard
    stripePriceId: "price_professional", // Will be created in Stripe dashboard
    features: [
      "Up to 50 clients",
      "Advanced scheduling & calendar",
      "Automated reminders (SMS/Email)",
      "Client progress reports",
      "Workout plan builder",
      "Client portal links",
      "AI Session Recaps",
      "Priority support",
    ],
    limits: {
      clients: 50,
      sessions: 500,
      storage: "5GB",
    },
  },
  ENTERPRISE: {
    id: "enterprise",
    name: "Enterprise",
    price: 79,
    interval: "month",
    stripeProductId: "prod_enterprise", // Will be created in Stripe dashboard
    stripePriceId: "price_enterprise", // Will be created in Stripe dashboard
    features: [
      "Unlimited clients",
      "Multi-trainer management",
      "Advanced analytics & reporting",
      "White-label client portals",
      "API access",
      "Advanced AI features",
      "Custom integrations",
      "Dedicated support",
    ],
    limits: {
      clients: -1, // Unlimited
      sessions: -1, // Unlimited
      storage: "50GB",
    },
  },
};

// Trial configuration
export const TRIAL_PERIOD_DAYS = 14;

// Helper functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
};

export const isPlanActive = (userPlan: string): boolean => {
  return userPlan && userPlan !== "free";
};

export const getPlanLimits = (planId: string) => {
  const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId);
  return plan?.limits || SUBSCRIPTION_PLANS.FREE.limits;
};

export const canExceedLimit = (
  planId: string,
  limitType: keyof typeof SUBSCRIPTION_PLANS.FREE.limits,
  currentCount: number,
): boolean => {
  const limits = getPlanLimits(planId);
  const limit = limits[limitType];

  if (typeof limit === "number") {
    return limit === -1 || currentCount < limit;
  }

  return true;
};

// Mock function for subscription management (would integrate with backend)
export const createCheckoutSession = async (planId: string, userId: string) => {
  // In a real implementation, this would call your backend API
  // which would create a Stripe checkout session

  const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId);
  if (!plan || plan.id === "free") {
    throw new Error("Invalid plan selected");
  }

  // Mock response - in real implementation, return Stripe checkout session URL
  return {
    url: `https://checkout.stripe.com/c/pay/mock-session-id`,
    sessionId: "mock-session-id",
  };
};

export const cancelSubscription = async (subscriptionId: string) => {
  // Mock implementation - would call backend API
  console.log("Cancelling subscription:", subscriptionId);
  return { success: true };
};

export const getSubscriptionStatus = async (userId: string) => {
  // Mock implementation - would call backend API to get subscription status
  const mockTrialEnd = new Date();
  mockTrialEnd.setDate(mockTrialEnd.getDate() + TRIAL_PERIOD_DAYS);

  return {
    status: "trialing",
    currentPlan: "professional",
    trialEnd: mockTrialEnd.toISOString(),
    subscriptionId: "sub_mock123",
    customerId: "cus_mock123",
  };
};
