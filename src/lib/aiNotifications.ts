import { useState, useEffect } from "react";
import { Client, Session } from "./types";
import { ClientAnalysis } from "./recommendations";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  limit,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { auth } from "./firebase";
import { useAuth } from "@/contexts/AuthContext";

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
  private settings: NotificationSettings = defaultNotificationSettings;
  private listeners: ((notifications: AINotification[]) => void)[] = [];
  private userId: string | null = null;
  private db = getFirestore();
  private notificationsCollection: any = null; // Will be set up in constructor
  private unsubscribe: (() => void) | null = null;

  constructor() {
    this.getSettings(); // Load settings on initialization
  }

  // Set user and initialize Firestore listener
  setUser(userId: string) {
    if (this.userId === userId) return; // Already initialized for this user
    
    this.userId = userId;
    this.notificationsCollection = collection(this.db, "users", this.userId, "notifications");
    
    // Clean up previous listener if any
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    
    this.subscribeToNotifications();
  }

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
  async addNotifications(newNotifications: Omit<AINotification, 'id' | 'read' | 'timestamp'>[]): Promise<void> {
    if (!this.userId) {
      console.warn("User not set, cannot add notifications.");
      return;
    }

    const filteredNotifications = newNotifications.filter((notification) => {
      // Apply settings filters
      if (!this.settings.enableAINotifications) return false;
      if (this.settings.highPriorityOnly && notification.priority !== "high")
        return false;
      return true;
    });

    for (const notification of filteredNotifications) {
      try {
        await addDoc(this.notificationsCollection, {
          ...notification,
          timestamp: new Date().toISOString(),
          read: false,
        });
      } catch (error) {
        console.error("Error adding notification to Firestore:", error);
      }
    }
  }

  // Get all notifications
  getNotifications(): AINotification[] {
    return []; // This method is no longer used
  }

  // Get unread notifications
  getUnreadNotifications(): AINotification[] {
    return []; // This method is no longer used
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    if (!this.userId) return;
    const notifDoc = doc(this.db, "users", this.userId, "notifications", notificationId);
    try {
      await updateDoc(notifDoc, { read: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }

  // Mark all as read
  async markAllAsRead(): Promise<void> {
    if (!this.userId) {
      console.warn("User not set, cannot mark notifications as read.");
      return;
    }

    try {
      // Get all unread notifications
      const unreadQuery = query(
        this.notificationsCollection,
        where("read", "==", false),
        orderBy("timestamp", "desc")
      );
      
      const unreadSnapshot = await getDocs(unreadQuery);
      
      if (unreadSnapshot.empty) {
        return; // No unread notifications to mark
      }

      // Use batch write to update all unread notifications
      const batch = writeBatch(this.db);
      
      unreadSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
      });
      
      await batch.commit();
      
      console.log(`Marked ${unreadSnapshot.size} notifications as read`);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw new Error("Failed to mark notifications as read");
    }
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
    // Unsubscribe from the listener array
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(notifications: AINotification[]): void {
    this.listeners.forEach((listener) => listener(notifications));
  }

  // New method to listen to firestore
  private subscribeToNotifications() {
    if (!this.userId) return;

    const q = query(this.notificationsCollection, orderBy("timestamp", "desc"), limit(50));
    
    this.unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as object),
      })) as AINotification[];
      this.notifyListeners(notifications);
    }, (error) => {
      console.error("Error fetching notifications:", error);
    });
  }

  // Simulate real-time notifications (in production, this would come from webhooks/websockets)
  // This simulation will be removed and replaced by real triggers.
  /*
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
  */
}

// Global notification manager instance
export const aiNotificationManager = new AINotificationManager();

// React hook for using notifications
export const useAINotifications = () => {
  const [notifications, setNotifications] = useState<AINotification[]>([]);
  const { user, isDemoUser } = useAuth(); // Add isDemoUser

  useEffect(() => {
    if (user && user.uid) {
      // Skip Firebase for demo users
      if (isDemoUser) {
        // Set mock notifications for demo users
        const mockNotifications: AINotification[] = [
          {
            id: "demo-1",
            type: "insight",
            priority: "low",
            title: "🚀 AI Coach is ready!",
            message: "Your AI Coach is analyzing client data and will provide personalized recommendations",
            timestamp: new Date().toISOString(),
            read: false,
          },
          {
            id: "demo-2", 
            type: "recommendation",
            priority: "medium",
            title: "Schedule Optimization",
            message: "Your Tuesday 3PM slot has been consistently popular - consider adding more",
            timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            read: false,
          }
        ];
        setNotifications(mockNotifications);
        return; // Don't set up Firebase listener for demo users
      }
      
      aiNotificationManager.setUser(user.uid);
      const unsubscribe = aiNotificationManager.subscribe(setNotifications);
      return () => {
        unsubscribe();
      };
    } else {
      setNotifications([]); // Clear notifications if no user
    }
  }, [user, isDemoUser]);

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markAsRead: aiNotificationManager.markAsRead.bind(aiNotificationManager),
    markAllAsRead: aiNotificationManager.markAllAsRead.bind(aiNotificationManager),
    settings: aiNotificationManager.getSettings(),
    updateSettings: aiNotificationManager.updateSettings.bind(aiNotificationManager),
  };
};

// Initialize simulation on module load (for demo purposes) - THIS WILL BE REMOVED/CHANGED
/*
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
    // aiNotificationManager.startSimulation();
  }, 2000);
}
*/
