// Utility to reset subscription data for testing
export const resetSubscriptionToDefault = () => {
  const defaultSubscription = {
    status: "active",
    currentPlan: "professional",
    trialEnd: null,
    subscriptionId: "sub_professional123",
    customerId: "cus_professional123",
  };

  localStorage.setItem(
    "subscription_data",
    JSON.stringify(defaultSubscription),
  );
  // Reload the page to reflect changes
  window.location.reload();
};

// Add to window for easy console access
if (typeof window !== "undefined") {
  (window as any).resetSubscription = resetSubscriptionToDefault;
}
