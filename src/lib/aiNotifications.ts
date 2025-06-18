import { useState, useEffect } from "react";
import { Client, Session } from "./types";
import { ClientAnalysis } from "./recommendations";

export interface AINotification {
  id: string;
  type: "recommendation" | "alert" | "insight" | "achievement";
  priority: "high" | "medium" | "low";
  title: string;
  message: string;
  clientId?: string;
  clientName?: string;
  timestamp: string;
  actionUrl?: string;
  read: boolean;
  data?: any;
}

export interface NotificationSettings {
  enableAINotifications: boolean;
  highPriorityOnly: boolean;
  clientProgressAlerts: boolean;
  performanceInsights: boolean;
  scheduleRecommendations: boolean;
  emailNotifications: boolean;
}

// Default notification settings
export const defaultNotificationSettings: NotificationSettings = {
  enableAINotifications: true,
  highPriorityOnly: false,
  clientProgressAlerts: true,
  performanceInsights: true,
  scheduleRecommendations: true,
  emailNotifications: false,
};

class AINotificationManager {
  private notifications: AINotification[] = [];
  private settings: NotificationSettings = defaultNotificationSettings;
  private listeners: ((notifications: AINotification[]) => void)[] = [];

  // Generate notifications based on client analysis
  generateNotificationsFromAnalysis(
    analysis: ClientAnalysis,
  ): AINotification[] {
    const notifications: AINotification[] = [];

    // High priority recommendations
    const highPriorityRecs = analysis.recommendations.filter(
      (r) => r.priority === "high",
    );

    if (highPriorityRecs.length > 0) {
      notifications.push({
        id: `high-priority-${analysis.clientId}-${Date.now()}`,
        type: "alert",
        priority: "high",
        title: `Urgent: ${analysis.clientName} needs attention`,
        message: `${highPriorityRecs.length} high-priority recommendations require immediate action`,
        clientId: analysis.clientId,
        clientName: analysis.clientName,
        timestamp: new Date().toISOString(),
        actionUrl: `/ai-recommendations?client=${analysis.clientId}`,
        read: false,
        data: { recommendations: highPriorityRecs },
      });
    }

    // Progress trend alerts
    if (analysis.progressTrend === "declining") {
      notifications.push({
        id: `progress-decline-${analysis.clientId}-${Date.now()}`,
        type: "alert",
        priority: "high",
        title: `Progress Alert: ${analysis.clientName}`,
        message: "Client showing declining progress trend - review needed",
        clientId: analysis.clientId,
        clientName: analysis.clientName,
        timestamp: new Date().toISOString(),
        actionUrl: `/progress?client=${analysis.clientId}`,
        read: false,
      });
    }

    // Attendance alerts
    if (analysis.attendanceRate < 60) {
      notifications.push({
        id: `attendance-${analysis.clientId}-${Date.now()}`,
        type: "alert",
        priority: "medium",
        title: `Attendance Concern: ${analysis.clientName}`,
        message: `Attendance rate at ${analysis.attendanceRate}% - consider outreach`,
        clientId: analysis.clientId,
        clientName: analysis.clientName,
        timestamp: new Date().toISOString(),
        actionUrl: `/clients/${analysis.clientId}`,
        read: false,
      });
    }

    // Goal achievement celebrations
    if (analysis.goalProgress >= 75) {
      notifications.push({
        id: `achievement-${analysis.clientId}-${Date.now()}`,
        type: "achievement",
        priority: "low",
        title: `🎉 ${analysis.clientName} milestone!`,
        message: `Client is ${analysis.goalProgress}% toward their goal - consider celebration or new targets`,
        clientId: analysis.clientId,
        clientName: analysis.clientName,
        timestamp: new Date().toISOString(),
        actionUrl: `/clients/${analysis.clientId}`,
        read: false,
      });
    }

    return notifications;
  }

  // Generate notifications for session completions
  generateSessionNotifications(
    session: Session,
    client: Client,
    performanceScore?: number,
  ): AINotification[] {
    const notifications: AINotification[] = [];

    // Cancellation patterns
    if (session.status === "cancelled") {
      notifications.push({
        id: `cancellation-${session.id}-${Date.now()}`,
        type: "alert",
        priority: "medium",
        title: `Session Cancelled: ${client.name}`,
        message: "Consider rescheduling and checking in on client availability",
        clientId: client.id,
        clientName: client.name,
        timestamp: new Date().toISOString(),
        actionUrl: `/sessions`,
        read: false,
      });
    }

    // Excellent performance celebrations
    if (performanceScore && performanceScore >= 90) {
      notifications.push({
        id: `performance-${session.id}-${Date.now()}`,
        type: "achievement",
        priority: "low",
        title: `🔥 ${client.name} crushed it!`,
        message: `Outstanding ${performanceScore}% performance score - ready for new challenges`,
        clientId: client.id,
        clientName: client.name,
        timestamp: new Date().toISOString(),
        actionUrl: `/ai-recommendations?client=${client.id}`,
        read: false,
      });
    }

    return notifications;
  }

  // Add notifications to the system
  addNotifications(newNotifications: AINotification[]): void {
    const filteredNotifications = newNotifications.filter((notification) => {
      // Apply settings filters
      if (!this.settings.enableAINotifications) return false;
      if (this.settings.highPriorityOnly && notification.priority !== "high")
        return false;

      return true;
    });

    this.notifications.unshift(...filteredNotifications);

    // Keep only last 50 notifications
    this.notifications = this.notifications.slice(0, 50);

    this.notifyListeners();
  }

  // Get all notifications
  getNotifications(): AINotification[] {
    return this.notifications;
  }

  // Get unread notifications
  getUnreadNotifications(): AINotification[] {
    return this.notifications.filter((n) => !n.read);
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Mark all as read
  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
    this.notifyListeners();
  }

  // Update settings
  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };

    // Save to localStorage
    localStorage.setItem(
      "aiNotificationSettings",
      JSON.stringify(this.settings),
    );
  }

  // Get settings
  getSettings(): NotificationSettings {
    // Load from localStorage if available
    const saved = localStorage.getItem("aiNotificationSettings");
    if (saved) {
      try {
        this.settings = {
          ...defaultNotificationSettings,
          ...JSON.parse(saved),
        };
      } catch (e) {
        console.warn("Failed to load notification settings:", e);
      }
    }
    return this.settings;
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: AINotification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.notifications));
  }

  // Simulate real-time notifications (in production, this would come from webhooks/websockets)
  startSimulation(): void {
    // Generate random insights every 30 seconds for demo
    setInterval(() => {
      if (!this.settings.enableAINotifications) return;

      const randomInsights: AINotification[] = [
        {
          id: `insight-${Date.now()}`,
          type: "insight",
          priority: "low",
          title: "💡 Training Tip",
          message:
            "Consider adding more compound movements to your clients' routines",
          timestamp: new Date().toISOString(),
          read: false,
        },
        {
          id: `recommendation-${Date.now()}`,
          type: "recommendation",
          priority: "medium",
          title: "Schedule Optimization",
          message:
            "Your Tuesday 3PM slot has been consistently popular - consider adding more",
          timestamp: new Date().toISOString(),
          read: false,
        },
      ];

      // Randomly add one insight
      if (Math.random() > 0.7) {
        this.addNotifications([
          randomInsights[Math.floor(Math.random() * randomInsights.length)],
        ]);
      }
    }, 30000);
  }
}

// Global notification manager instance
export const aiNotificationManager = new AINotificationManager();

// React hook for using notifications
export const useAINotifications = () => {
  const [notifications, setNotifications] = useState<AINotification[]>([]);

  useEffect(() => {
    const unsubscribe = aiNotificationManager.subscribe(setNotifications);
    setNotifications(aiNotificationManager.getNotifications());
    return unsubscribe;
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markAsRead: aiNotificationManager.markAsRead.bind(aiNotificationManager),
    markAllAsRead: aiNotificationManager.markAllAsRead.bind(
      aiNotificationManager,
    ),
    settings: aiNotificationManager.getSettings(),
    updateSettings: aiNotificationManager.updateSettings.bind(
      aiNotificationManager,
    ),
  };
};

// Initialize simulation on module load (for demo purposes)
if (typeof window !== "undefined") {
  // Add some demo notifications
  setTimeout(() => {
    aiNotificationManager.addNotifications([
      {
        id: "welcome",
        type: "insight",
        priority: "low",
        title: "🚀 AI Coach is ready!",
        message:
          "Your AI Coach is analyzing client data and will provide personalized recommendations",
        timestamp: new Date().toISOString(),
        read: false,
      },
    ]);

    // Start the simulation
    aiNotificationManager.startSimulation();
  }, 2000);
}
