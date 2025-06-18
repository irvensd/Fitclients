import { SUBSCRIPTION_PLANS } from "./stripe";

export interface ClientLimitInfo {
  current: number;
  limit: number;
  isUnlimited: boolean;
  canAddMore: boolean;
  percentageUsed: number;
  remainingSlots: number;
}

export const getClientLimitInfo = (
  planId: string,
  currentClientCount: number,
): ClientLimitInfo => {
  const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId);
  const limit = plan?.limits.clients || SUBSCRIPTION_PLANS.FREE.limits.clients;

  const isUnlimited = limit === -1;
  const canAddMore = isUnlimited || currentClientCount < limit;
  const percentageUsed = isUnlimited ? 0 : (currentClientCount / limit) * 100;
  const remainingSlots = isUnlimited
    ? -1
    : Math.max(0, limit - currentClientCount);

  return {
    current: currentClientCount,
    limit: isUnlimited ? -1 : limit,
    isUnlimited,
    canAddMore,
    percentageUsed,
    remainingSlots,
  };
};

export const canAddClient = (
  planId: string,
  currentClientCount: number,
): boolean => {
  const { canAddMore } = getClientLimitInfo(planId, currentClientCount);
  return canAddMore;
};

export const getUpgradeMessage = (
  planId: string,
  currentClientCount: number,
): string | null => {
  const limitInfo = getClientLimitInfo(planId, currentClientCount);

  if (limitInfo.canAddMore) {
    return null;
  }

  if (planId === "free") {
    return "You've reached your limit of 5 clients. Upgrade to Professional for up to 50 clients, or Gold for unlimited clients.";
  }

  if (planId === "professional") {
    return "You've reached your limit of 50 clients. Upgrade to Gold for unlimited clients and advanced features.";
  }

  return null;
};

export const getPlanFeaturesList = (planId: string): string[] => {
  const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId);
  return plan?.features || SUBSCRIPTION_PLANS.FREE.features;
};

export const getPlanLimitText = (planId: string): string => {
  const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId);
  const clientLimit =
    plan?.limits.clients || SUBSCRIPTION_PLANS.FREE.limits.clients;

  if (clientLimit === -1) {
    return "Unlimited clients";
  }

  return `Up to ${clientLimit} clients`;
};
