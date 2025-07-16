import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/lib/badges";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  Plus,
  Activity,
  Target,
  XCircle,
  AlertTriangle,
  Brain,
  Sparkles,
} from "lucide-react";
import { AdminSummary } from "@/components/AdminSummary";
import { NavigationButton } from "@/components/NavigationButton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  RevenueChart,
  ClientGrowthChart,
  SessionTypeChart,
  WeeklyActivityChart,
} from "@/components/DashboardCharts";
import {
  calculateDashboardStats,
  getRecentCancellations,
  getTodaysSessions,
  getRecentClients,
} from "@/lib/dashboardMetrics";
import { useData } from "@/contexts/DataContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { getClientLimitInfo, getPlanLimitText } from "@/lib/clientLimits";
import { RevenueAnalytics } from "@/components/RevenueAnalytics";
import { QuickActionsWidget } from "@/components/QuickActionsWidget";
import { generateRecommendations } from "@/lib/recommendations";
import {
  formatTime,
  formatSessionType,
  getTimeAgo,
  formatCancellationTime,
} from "@/lib/utils";
import EmptyState from "@/components/EmptyState";
import CreativeDashboard from "@/components/CreativeDashboard";
import { BadgeReveal } from "@/components/BadgeReveal";
import { StreakTracker } from "@/components/StreakTracker";
import { Streak, calculateGamificationData } from "@/lib/gamification";

const SESSION_MILESTONES = [10, 25, 50, 100, 250, 500];
const CLIENT_MILESTONES = [10, 25, 50, 100, 250, 500];

const MilestoneCelebrationModal = ({
  type,
  count,
  onClose,
  onShare,
}: {
  type: "session" | "client";
  count: number;
  onClose: () => void;
  onShare: () => void;
}) => {
  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  const label = type === "session" ? "Session" : "Client";
  const emoji = type === "session" ? "🏋️" : "🤝";
  const message = type === "session"
    ? `You've completed ${count} sessions!`
    : `You've added ${count} clients!`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center relative">
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-confettiFall"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 10}%`,
                  backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"][Math.floor(Math.random() * 7)],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}
        <div className="text-6xl mb-4 animate-pulse">{emoji}</div>
        <h2 className="text-2xl font-bold text-orange-600 mb-2">{count} {label}{count > 1 ? "s" : ""} Milestone!</h2>
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex gap-2 justify-center mt-4">
          <Button onClick={onClose} variant="outline">Continue</Button>
          <Button
            className="bg-gradient-to-r from-orange-500 to-red-500"
            onClick={() => {
              onShare();
              onClose();
            }}
          >
            Share Achievement
          </Button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const dataContext = useData();
  const {
    clients = [],
    sessions = [],
    payments = [],
    progressEntries = [],
    loading = false,
    error = null
  } = dataContext || {};
  const { getCurrentPlan, subscription } = useSubscription();

  // Sample streak data for demo/testing
  const sampleStreaks: Streak[] = [
    {
      id: "session-streak",
      type: "session",
      currentCount: 7,
      bestCount: 12,
      isActive: true,
      lastActivityDate: new Date().toISOString(),
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      title: "Workout Sessions",
      description: "Consecutive days of completing workouts",
      icon: "💪",
    },
    {
      id: "progress-streak",
      type: "progress_log",
      currentCount: 14,
      bestCount: 21,
      isActive: true,
      lastActivityDate: new Date().toISOString(),
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      title: "Progress Tracking",
      description: "Days of logging progress",
      icon: "📊",
    },
  ];

  // Determine if this is a demo account
  const isDemo = user?.email === "trainer@demo.com";

  // Dynamic streaks for real users
  let streaks: Streak[] = sampleStreaks;
  if (!isDemo && user) {
    // Find the current user (trainer) as a client for streaks
    // If you want to show streaks for all clients, you can aggregate or show per-client
    // For now, show the trainer's own streaks if they exist, else aggregate
    const trainerClient = clients.find((c) => c.email === user.email);
    if (trainerClient) {
      streaks = calculateGamificationData(trainerClient, sessions, progressEntries).currentStreaks;
    } else if (clients.length > 0) {
      // Aggregate all clients' streaks (optional: flatten or pick the most active)
      streaks = clients.flatMap((client) =>
        calculateGamificationData(client, sessions.filter(s => s.clientId === client.id), progressEntries.filter(p => p.clientId === client.id)).currentStreaks
      );
    }
  }

  const [milestone, setMilestone] = useState<{ type: "session" | "client"; count: number } | null>(null);
  const [celebratedMilestones, setCelebratedMilestones] = useState<number[]>([]);

  const handleShareMilestone = () => {
    if (milestone) {
      const label = milestone.type === "session" ? "Session" : "Client";
      const message = milestone.type === "session"
        ? `I've completed ${milestone.count} sessions!`
        : `I've added ${milestone.count} clients!`;
      
      if (navigator.share) {
        navigator.share({
          title: `${milestone.count} ${label} Milestone!`,
          text: message,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(message);
        toast({
          title: "Milestone Copied",
          description: "Milestone copied to clipboard!",
        });
      }
    }
  };

  // Detect session/client milestones
  useEffect(() => {
    if (!isDemo) {
      const sessionCount = sessions.length;
      const clientCount = clients.length;
      const sessionMilestone = SESSION_MILESTONES.find((m) => sessionCount === m && !celebratedMilestones.includes(m * 1000 + 1));
      const clientMilestone = CLIENT_MILESTONES.find((m) => clientCount === m && !celebratedMilestones.includes(m * 1000 + 2));
      if (sessionMilestone) {
        setMilestone({ type: "session", count: sessionMilestone });
        setCelebratedMilestones((prev) => [...prev, sessionMilestone * 1000 + 1]);
      } else if (clientMilestone) {
        setMilestone({ type: "client", count: clientMilestone });
        setCelebratedMilestones((prev) => [...prev, clientMilestone * 1000 + 2]);
      }
    }
  }, [sessions.length, clients.length, isDemo, celebratedMilestones]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 font-bold">Failed to load dashboard data. Please try again later.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show empty state for new users
  if (clients.length === 0 && sessions.length === 0 && payments.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <EmptyState
          Icon={Users}
          title="Welcome to FitClient! 🎉"
          description="Your complete fitness business management platform. Get started by exploring the features below and adding your first client to begin your journey."
          actionText="Add Your First Client"
          onAction={() => navigate("/clients")}
        />
      </div>
    );
  }

  // Calculate dashboard stats
  const stats = calculateDashboardStats(clients, sessions, payments);
  const recentClients = getRecentClients(clients).slice(0, 10);
  const todaysSessions = getTodaysSessions(sessions).slice(0, 10);
  const recentCancellations = getRecentCancellations(sessions).slice(0, 10);

  // Dynamic success rate
  const successRate = sessions.length
    ? Math.round((sessions.filter(s => s.status === "completed").length / sessions.length) * 100)
    : 0;

  // Prepare motivational stats for creative dashboard
  const motivationalStats = {
    totalClients: stats.totalClients,
    totalSessions: sessions.length,
    totalRevenue: stats.monthlyRevenue,
    streakDays: 5, // Mock streak - you can implement real streak logic
    recentAchievements: []
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Your fitness business overview and key metrics.
          </p>
        </div>
      </div>

      <QuickActionsWidget />

      {/* Creative Dashboard - Motivational Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Active Clients</h3>
          <p className="text-3xl font-bold">{clients.length}</p>
          <p className="text-blue-100 text-sm">Growing strong!</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Sessions</h3>
          <p className="text-3xl font-bold">{sessions.length}</p>
          <p className="text-green-100 text-sm">Transforming lives!</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Revenue</h3>
          <p className="text-3xl font-bold">
            ${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
          </p>
          <p className="text-orange-100 text-sm">Building success!</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
          <p className="text-3xl font-bold">{successRate}%</p>
          <p className="text-purple-100 text-sm">Excellence achieved!</p>
        </div>
      </div>

      {/* Streak Tracker with Celebration */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Streaks</h2>
        <StreakTracker 
          streaks={streaks} 
          variant="card" 
          showCelebration={true} 
        />
      </div>

      {/* Analytics & Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <RevenueAnalytics />
        <RevenueChart />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <ClientGrowthChart />
        <SessionTypeChart />
        <WeeklyActivityChart />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Clients */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Clients</CardTitle>
            <CardDescription>
              Clients added in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentClients.length > 0 ? (
              recentClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.email}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {getTimeAgo(client.dateJoined)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No recent clients
              </p>
            )}
          </CardContent>
        </Card>

        {/* Today's Sessions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Today's Sessions</CardTitle>
            <CardDescription>
              Sessions scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysSessions.length > 0 ? (
              todaysSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {clients.find((c) => c.id === session.clientId)?.name ||
                        "Unknown Client"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatSessionType(session.type)} - {formatTime(session.startTime)}
                    </p>
                  </div>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      session.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : session.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No sessions today
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Cancellations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Cancellations</CardTitle>
            <CardDescription>
              Cancelled sessions in the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCancellations.length > 0 ? (
              recentCancellations.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {clients.find((c) => c.id === session.clientId)?.name ||
                        "Unknown Client"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCancellationTime(session.cancelledAt)}
                    </p>
                  </div>
                  <XCircle className="h-4 w-4 text-red-500" />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No recent cancellations
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Personalized suggestions to improve your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: TrendingUp,
                title: "Increase Session Frequency",
                description: "Clients with 3+ sessions per week show 40% better results",
                action: "Schedule More",
                onClick: () => navigate("/sessions")
              },
              {
                icon: Target,
                title: "Set Clear Goals",
                description: "Help clients define specific, measurable fitness objectives",
                action: "Review Goals",
                onClick: () => navigate("/clients")
              },
              {
                icon: Activity,
                title: "Track Progress",
                description: "Regular progress tracking improves client retention by 60%",
                action: "Log Progress",
                onClick: () => navigate("/progress")
              },
              {
                icon: Brain,
                title: "Get AI Insights",
                description: "View detailed AI-powered recommendations for each client",
                action: "View Insights",
                onClick: () => navigate("/ai-recommendations")
              },
              {
                icon: Users,
                title: "Client Engagement",
                description: "Engaged clients are 3x more likely to achieve their goals",
                action: "Engage Clients",
                onClick: () => navigate("/clients")
              },
              {
                icon: DollarSign,
                title: "Revenue Optimization",
                description: "Optimize pricing and payment collection for better revenue",
                action: "View Payments",
                onClick: () => navigate("/payments")
              }
            ].map((recommendation, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                onClick={recommendation.onClick}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <recommendation.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">
                      {recommendation.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {recommendation.description}
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        recommendation.onClick();
                      }}
                    >
                      {recommendation.action}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {milestone && (
        <MilestoneCelebrationModal
          type={milestone.type}
          count={milestone.count}
          onClose={() => setMilestone(null)}
          onShare={handleShareMilestone}
        />
      )}
    </div>
  );
};

export default Dashboard;
