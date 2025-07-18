import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
// Note: This is using demo/test keys. Replace with production keys when ready.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export { stripePromise };

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  STARTER: {
    id: "starter",
    name: "Starter",
    price: 9,
    interval: "month",
    stripeProductId: "prod_starter", // Will be created in Stripe dashboard
    stripePriceId: "price_starter", // Will be created in Stripe dashboard
    features: [
      "Manage up to 200 clients",
      "Session scheduling & calendar",
      "Payment tracking & invoicing",
      "Progress tracking",
      "Client portal links (no login)",
      "Workout plan builder",
      "Session recaps",
      "Custom business branding",
      "Email support",
    ],
    limits: {
      clients: 200,
      sessions: 1000,
      storage: "2GB",
    },
  },
  PRO: {
    id: "pro",
    name: "Pro",
    price: 19,
    interval: "month",
    stripeProductId: "prod_pro", // Will be created in Stripe dashboard
    stripePriceId: "price_pro", // Will be created in Stripe dashboard
    features: [
      "Everything in Starter, plus:",
      "Unlimited clients",
      "AI-powered recommendations",
      "Client progress stats & performance summaries",
      "Priority support",
    ],
    limits: {
      clients: -1, // Unlimited
      sessions: -1, // Unlimited
      storage: "10GB",
    },
  },
  LIFETIME: {
    id: "lifetime",
    name: "Pro Lifetime",
    price: 149,
    interval: "one-time",
    stripeProductId: "prod_lifetime", // Will be created in Stripe dashboard
    stripePriceId: "price_lifetime", // Will be created in Stripe dashboard
    features: [
      "Everything in Pro, forever",
      "No monthly fees",
      "All future updates included",
      "Lifetime support",
      "Limited to first 100 trainers",
    ],
    limits: {
      clients: -1, // Unlimited
      sessions: -1, // Unlimited
      storage: "10GB",
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
  return plan?.limits || SUBSCRIPTION_PLANS.STARTER.limits;
};

export const canExceedLimit = (
  planId: string,
  limitType: keyof typeof SUBSCRIPTION_PLANS.STARTER.limits,
  currentCount: number,
): boolean => {
  const limits = getPlanLimits(planId);
  const limit = limits[limitType];

  if (typeof limit === "number") {
    return limit === -1 || currentCount < limit;
  }

  return true;
};

// Function to create Stripe checkout session
export const createCheckoutSession = async (planId: string, userId: string) => {
  const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId);
  if (!plan || plan.id === "free") {
    throw new Error("Invalid plan selected");
  }

  try {
    // In a real implementation, this would call your backend API
    // The backend would create a Stripe checkout session with the actual Stripe API
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planId,
        userId,
        priceId: "stripePriceId" in plan ? (plan as any).stripePriceId : "demo_price_id",
        successUrl: `${window.location.origin}/billing?success=true`,
        cancelUrl: `${window.location.origin}/billing?canceled=true`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const session = await response.json();

    // Redirect to Stripe checkout
    const stripe = await stripePromise;
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        throw new Error(error.message);
      }
    }

    return session;
      } catch (error) {
      // DEMO MODE: Simulate a successful checkout without external redirect
      // In production, this would redirect to Stripe checkout
      // Demo mode: Simulating Stripe checkout session

      // Simulate a successful checkout session creation
      return {
        url: `/billing?demo=true&plan=${planId}`,
        sessionId: `demo_session_${Date.now()}`,
        isDemoMode: true,
      };
    }
};

export const cancelSubscription = async (subscriptionId: string) => {
  // Mock implementation - would call backend API
  // Cancelling subscription
  return { success: true };
};

export const getSubscriptionStatus = async (userId: string) => {
  // Mock implementation - would call backend API to get subscription status
  const mockTrialEnd = new Date();
  mockTrialEnd.setDate(mockTrialEnd.getDate() + TRIAL_PERIOD_DAYS);

  return {
    status: "trialing",
    currentPlan: "starter",
    trialEnd: mockTrialEnd.toISOString(),
    subscriptionId: "sub_mock123",
    customerId: "cus_mock123",
  };
};
