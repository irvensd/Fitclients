import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";

// Initialize Stripe
// Guard against missing/invalid publishable key in development to avoid runtime errors
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
const isValidPublishableKey = typeof STRIPE_PUBLISHABLE_KEY === 'string' && /^pk_(test|live)_/.test(STRIPE_PUBLISHABLE_KEY);

const stripePromise: Promise<Stripe | null> = isValidPublishableKey
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

export { stripePromise };

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  STARTER: {
    id: "starter",
    name: "Starter",
    price: 19,
    interval: "month",
    stripeProductId: "prod_starter", // Will be created in Stripe dashboard
    stripePriceId: "price_starter", // Will be created in Stripe dashboard
    features: [
      "Manage up to 25 clients",
      "Session scheduling & calendar",
      "Basic payment tracking",
      "Client portal links (no login)",
      "Basic workout plans",
      "Email support",
      "Mobile app access",
    ],
    limits: {
      clients: 25,
      sessions: 500,
      storage: "1GB",
    },
    description: "Perfect for new trainers getting started",
  },
  PRO: {
    id: "pro",
    name: "Professional",
    price: 49,
    interval: "month",
    stripeProductId: "prod_pro", // Will be created in Stripe dashboard
    stripePriceId: "price_pro", // Will be created in Stripe dashboard
    features: [
      "Everything in Starter, plus:",
      "Manage up to 100 clients",
      "AI-powered recommendations",
      "Advanced progress tracking & analytics",
      "Session recaps with AI insights",
      "Custom business branding",
      "Client success stories feature",
      "Priority support",
    ],
    limits: {
      clients: 100,
      sessions: -1, // Unlimited
      storage: "5GB",
    },
    description: "For growing fitness businesses",
    popular: true,
  },
  STUDIO: {
    id: "studio",
    name: "Studio",
    price: 99,
    interval: "month",
    stripeProductId: "prod_studio", // Will be created in Stripe dashboard
    stripePriceId: "price_studio", // Will be created in Stripe dashboard
    features: [
      "Everything in Professional, plus:",
      "Unlimited clients",
      "Multi-trainer support (up to 5 trainers)",
      "Advanced business analytics",
      "White-label client app",
      "API access",
      "Advanced automation",
      "Phone support",
    ],
    limits: {
      clients: -1, // Unlimited
      sessions: -1, // Unlimited
      storage: "20GB",
    },
    description: "For studios and multi-trainer businesses",
  },
  LIFETIME: {
    id: "lifetime",
    name: "Professional Lifetime",
    price: 497,
    interval: "one-time",
    stripeProductId: "prod_lifetime", // Will be created in Stripe dashboard
    stripePriceId: "price_lifetime", // Will be created in Stripe dashboard
    features: [
      "Everything in Professional plan",
      "Lifetime access - pay once, own forever",
      "All future updates included forever",
      "Grandfathered pricing protection",
      "Lifetime priority support",
      "⚡ LIMITED: Only 500 spots available",
    ],
    limits: {
      clients: 100,
      sessions: -1, // Unlimited
      storage: "10GB",
    },
    description: "Pay once, own forever",
    urgency: true,
    limitedSpots: 500,
    spotsTaken: 347, // This would be dynamic in real app
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
