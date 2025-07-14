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
      "Session scheduling & calendar",
      "Payment tracking & invoicing",
      "Progress photos & tracking",
      "Client portal links (no login)",
      "Workout plan builder",
      "Session recaps",
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
      "Everything in Starter, plus:",
      "Advanced scheduling & calendar sync",
      "Automated reminders (SMS/Email)",
      "Detailed client progress reports",
      "Advanced workout plan builder",
      "AI-powered session recaps",
      "Client streak tracking & badges",
      "Priority email support",
    ],
    limits: {
      clients: 50,
      sessions: 500,
      storage: "5GB",
    },
  },
  GOLD: {
    id: "gold",
    name: "Gold",
    price: 79,
    interval: "month",
    stripeProductId: "prod_gold", // Will be created in Stripe dashboard
    stripePriceId: "price_gold", // Will be created in Stripe dashboard
    features: [
      "Unlimited clients",
      "Everything in Professional, plus:",
      "Multi-trainer management",
      "Advanced analytics & reporting",
      "White-label client portals",
      "API access for integrations",
      "Advanced AI coaching features",
      "Custom branding options",
      "Dedicated phone support",
      "Priority feature requests",
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
    // For demo purposes, simulate a successful checkout without external redirect
    // Demo mode: Would redirect to Stripe checkout

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
    currentPlan: "professional",
    trialEnd: mockTrialEnd.toISOString(),
    subscriptionId: "sub_mock123",
    customerId: "cus_mock123",
  };
};
