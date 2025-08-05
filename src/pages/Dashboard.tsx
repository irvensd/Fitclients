import React, { useState, useEffect, Suspense } from "react";
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
import { DemoTips } from "@/components/DemoTips";
import { LoadingScreen, LoadingPage, LoadingSpinner } from "@/components/ui/loading";
import { useAnnouncement } from "@/hooks/use-keyboard-navigation";
import { PageHeader } from "@/components/PageHeader";

// Lazy load heavy chart components
const RevenueChart = React.lazy(() => import("@/components/DashboardCharts").then(module => ({ default: module.RevenueChart })));
const ClientGrowthChart = React.lazy(() => import("@/components/DashboardCharts").then(module => ({ default: module.ClientGrowthChart })));
const SessionTypeChart = React.lazy(() => import("@/components/DashboardCharts").then(module => ({ default: module.SessionTypeChart })));
const WeeklyActivityChart = React.lazy(() => import("@/components/DashboardCharts").then(module => ({ default: module.WeeklyActivityChart })));

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
  const { announceNavigation, announceSuccess } = useAnnouncement();
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

  // Announce when dashboard loads
  React.useEffect(() => {
    if (!loading && !error) {
      announceNavigation("Dashboard");
    }
  }, [loading, error, announceNavigation]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 font-bold">Failed to load dashboard data. Please try again later.</div>
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen text="Loading dashboard..." size="lg" />;
  }

  // Show empty state for new users
  if (clients.length === 0 && sessions.length === 0 && payments.length === 0) {
    return (
      <div className="p-6 space-y-6">
              <PageHeader 
        title={`Welcome to FitClient, ${user?.displayName || user?.email?.split('@')[0] || 'Trainer'}! 🎉`}
        description="Your complete fitness business management platform. Get started by exploring the features below and adding your first client to begin your journey."
        level={1}
      />
      <EmptyState
        type="clients"
        title={`Welcome to FitClient, ${user?.displayName || user?.email?.split('@')[0] || 'Trainer'}! 🎉`}
        description="Your complete fitness business management platform. Get started by exploring the features below and adding your first client to begin your journey."
        actionText="Add Your First Client"
        onAction={() => navigate("/clients")}
      />
      </div>
    );
  }

  // Calculate dashboard stats with demo enhancements
  let stats = calculateDashboardStats(clients, sessions, payments);
  
  // Enhanced stats for demo users to show impressive metrics
  if (isDemo) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Calculate actual current month revenue for demo
    const currentMonthRevenue = payments
      .filter((payment) => {
        const paymentDate = new Date(payment.date);
        return (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear &&
          payment.status === "completed"
        );
      })
      .reduce((total, payment) => total + payment.amount, 0);
    
    // Override with impressive demo metrics
    stats = {
      ...stats,
      monthlyRevenue: currentMonthRevenue || 2850, // Fallback to impressive number
      sessionsThisWeek: Math.max(stats.sessionsThisWeek, 18), // At least 18 sessions this week
      sessionsToday: Math.max(stats.sessionsToday, 3), // At least 3 sessions today
      totalClients: Math.max(stats.totalClients, 12), // At least 12 clients
      activeWorkoutPlans: Math.max(stats.totalClients, 12),
      pendingPayments: Math.min(stats.pendingPayments, 1), // Keep pending low
    };
  }
  
  const recentClients = getRecentClients(clients).slice(0, 10);
  const todaysSessions = getTodaysSessions(sessions).slice(0, 10);
  const recentCancellations = getRecentCancellations(sessions).slice(0, 10);

  // Dynamic success rate with demo enhancement
  let successRate = sessions.length
    ? Math.round((sessions.filter(s => s.status === "completed").length / sessions.length) * 100)
    : 0;
    
  // Enhance success rate for demo to show impressive business metrics
  if (isDemo) {
    successRate = Math.max(successRate, 94); // At least 94% success rate for demo
  }

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
      <PageHeader 
        title="Dashboard"
        description="Overview of your fitness business performance and recent activity"
        level={1}
      />

      <QuickActionsWidget />

      {/* Demo Success Banner for Demo Users */}
      {isDemo && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 mb-1">🎉 Your Fitness Business is Thriving!</h3>
              <p className="text-sm text-green-700 mb-2">
                This is what a successful FitClient business looks like - organized clients, growing revenue, and efficient operations.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-white/60 rounded px-2 py-1">
                  <div className="font-medium text-green-800">94% Success Rate</div>
                  <div className="text-green-600">Session completion</div>
                </div>
                <div className="bg-white/60 rounded px-2 py-1">
                  <div className="font-medium text-green-800">42% Growth</div>
                  <div className="text-green-600">Monthly revenue</div>
                </div>
                <div className="bg-white/60 rounded px-2 py-1">
                  <div className="font-medium text-green-800">3 New Clients</div>
                  <div className="text-green-600">This week</div>
                </div>
                <div className="bg-white/60 rounded px-2 py-1">
                  <div className="font-medium text-green-800">$85 Avg</div>
                  <div className="text-green-600">Session rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Tips for Demo Users */}
      <DemoTips />

      {/* Stats Overview */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Business Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" aria-label={`${stats.totalClients} total clients`}>
                {stats.totalClients}
              </div>
              <p className="text-xs text-muted-foreground">
                {isDemo ? `active clients (+3 this week) 🔥` : 
                 stats.totalClients > 0 ? `${stats.totalClients} active clients` : 'No clients yet'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" aria-label={`${stats.sessionsThisWeek} sessions this week`}>
                {stats.sessionsThisWeek}
              </div>
              <p className="text-xs text-muted-foreground">
                {isDemo ? "sessions this week (98% completion rate) ⭐" : "sessions scheduled"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" aria-label={`$${stats.monthlyRevenue.toFixed(2)} revenue this month`}>
                ${stats.monthlyRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {isDemo ? "this month (+42% vs last month) 📈" : "this month"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" aria-label={`${stats.pendingPayments} pending payments`}>
                {stats.pendingPayments}
              </div>
              <p className="text-xs text-muted-foreground">
                {isDemo ? "payments due (excellent payment rate! 💰)" : "payments due"}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Charts Section */}
      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="sr-only">Analytics Charts</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <RevenueAnalytics />
          <Suspense fallback={<LoadingSpinner />}>
            <RevenueChart />
          </Suspense>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <Suspense fallback={<LoadingSpinner />}>
            <ClientGrowthChart />
          </Suspense>
          <Suspense fallback={<LoadingSpinner />}>
            <SessionTypeChart />
          </Suspense>
          <Suspense fallback={<LoadingSpinner />}>
            <WeeklyActivityChart />
          </Suspense>
        </div>
      </section>

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
