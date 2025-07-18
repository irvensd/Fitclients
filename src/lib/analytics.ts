import { analytics } from "./firebase";

export type AnalyticsEvent =
  | "user_signup"
  | "user_login"
  | "user_logout"
  | "client_added"
  | "session_scheduled"
  | "payment_received"
  | "feature_accessed"
  | "error_occurred";

export interface AnalyticsParams {
  [key: string]: string | number | boolean | undefined;
}

class AnalyticsService {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = typeof window !== "undefined" &&
      !window.location.hostname.includes("localhost") &&
      typeof analytics !== "undefined";
  }

  track(event: AnalyticsEvent, params?: AnalyticsParams) {
    if (!this.isEnabled) {
      return;
    }
    try {
      const enhanced = {
        ...params,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
        page_title: document.title,
      };
      analytics.logEvent(event, enhanced);
    } catch (error) {
      console.warn("Analytics tracking failed:", error);
    }
  }
}

export const analyticsService = new AnalyticsService();

// Example usage exports
export const trackUserSignup = (method: string) =>
  analyticsService.track("user_signup", { method });
export const trackUserLogin = (method: string) =>
  analyticsService.track("user_login", { method });
export const trackClientAdded = (clientId: string) =>
  analyticsService.track("client_added", { clientId });
export const trackSessionScheduled = (sessionId: string) =>
  analyticsService.track("session_scheduled", { sessionId });
export const trackPaymentReceived = (paymentId: string, amount: number) =>
  analyticsService.track("payment_received", { paymentId, amount });
export const trackFeatureAccessed = (feature: string) =>
  analyticsService.track("feature_accessed", { feature });
export const trackError = (errorType: string, message: string) =>
  analyticsService.track("error_occurred", { errorType, message }); 