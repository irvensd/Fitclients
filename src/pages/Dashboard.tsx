import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { DevModeNotice } from "@/components/DevModeNotice";
import { AdminSummary } from "@/components/AdminSummary";
import { NavigationButton } from "@/components/NavigationButton";
import { useAuth } from "@/contexts/AuthContext";
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

const Dashboard = () => {
  const { user } = useAuth();
  const { clients, sessions, payments, loading, error, getClientName } =
    useData();
  const { getCurrentPlan, subscription } = useSubscription();

  const currentPlan = getCurrentPlan();
  const currentClientCount = clients.length;
  const limitInfo = getClientLimitInfo(currentPlan.id, currentClientCount);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Skip error display - we're in controlled offline mode

  // Calculate dynamic stats from Firebase data
  const stats = calculateDashboardStats(clients, sessions, payments);
  const dashboardStats = {
    totalClients: stats.totalClients,
    upcomingSessions: stats.sessionsThisWeek,
    unpaidInvoices: stats.pendingPayments,
    monthlyRevenue: stats.monthlyRevenue,
  };

  // Get dynamic data
  const recentCancellations = getRecentCancellations(sessions).map(
    (session) => ({
      id: session.id,
      clientName: getClientName(session.clientId),
      sessionDate: new Date(session.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      }),
      sessionTime: formatTime(session.startTime),
      type: formatSessionType(session.type),
      reason:
        session.notes?.replace("Client cancelled via portal: ", "") ||
        "No reason provided",
      cancelledAt: formatCancellationTime(session.cancelledAt!),
      cancelledBy: session.cancelledBy,
    }),
  );

  const recentSessions = getTodaysSessions(sessions).map((session) => ({
    id: session.id,
    clientName: getClientName(session.clientId),
    time: formatTime(session.startTime),
    type: formatSessionType(session.type),
    status: session.status,
  }));

  const recentClients = getRecentClients(clients).map((client) => {
    // Calculate real goal progress using AI analysis system
    const analysis = generateRecommendations(client, sessions, payments);
    
    return {
      id: client.id,
      name: client.name,
      joinDate: getTimeAgo(client.dateJoined),
      level:
        client.fitnessLevel.charAt(0).toUpperCase() +
        client.fitnessLevel.slice(1),
      progress: analysis.goalProgress, // Use real goal progress from AI analysis
    };
  });

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <DevModeNotice />

      {/* Demo Mode Notice - Only for demo account */}
      {user?.email === "trainer@demo.com" && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Demo Mode Active</h3>
            </div>
            <p className="text-blue-700 mb-3 sm:mb-4 text-sm sm:text-base">
              You're viewing the demo version with sample data to showcase all
              features! This demonstrates how a busy trainer's dashboard would
              look with real clients, sessions, and progress tracking.
            </p>
            <p className="text-xs sm:text-sm text-blue-600 mb-3 sm:mb-4">
              <strong>Explore the features:</strong> View client progress, check
              session schedules, track payments, and see how all the charts and
              analytics work with real data. Perfect for understanding the full
              potential of FitClient!
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <NavigationButton to="/clients" className="text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                View Clients
              </NavigationButton>
              <NavigationButton to="/progress" variant="outline" className="text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                See Progress
              </NavigationButton>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State for New Accounts */}
      {clients.length === 0 &&
        sessions.length === 0 &&
        payments.length === 0 && (
          <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/5">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-muted mb-3 sm:mb-4">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">Ready to Start!</h3>
              <p className="text-muted-foreground text-center mb-4 sm:mb-6 max-w-md px-4 text-sm sm:text-base">
                This is what every new trainer sees - a clean slate ready to
                grow. Add your first client or session to see the dashboard come
                to life!
              </p>
            </CardContent>
          </Card>
        )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm">
              Trainer Portal
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your clients, track sessions, and monitor business metrics.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <NavigationButton to="/clients" variant="outline" className="text-xs sm:text-sm">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Add Client
          </NavigationButton>
          <NavigationButton to="/sessions" className="text-xs sm:text-sm">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Schedule Session
          </NavigationButton>
        </div>
      </div>

      {/* Stats Summary */}
      <AdminSummary
        totalClients={dashboardStats.totalClients}
        upcomingSessions={dashboardStats.upcomingSessions}
        unpaidInvoices={dashboardStats.unpaidInvoices}
        monthlyRevenue={dashboardStats.monthlyRevenue}
      />

      {/* Client Cancellations Alert */}
      {recentCancellations.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-orange-800 text-sm sm:text-base">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Client Cancellations
            </CardTitle>
            <CardDescription className="text-orange-700 text-xs sm:text-sm">
              Clients have cancelled sessions via their portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCancellations.map((cancellation) => (
              <div
                key={cancellation.id}
                className="p-3 sm:p-4 bg-white border border-orange-200 rounded-lg"
              >
                <div className="flex flex-col space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                      <p className="font-medium text-sm sm:text-base">{cancellation.clientName}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-red-200 text-red-700 w-fit text-xs"
                    >
                      Client Cancelled
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {cancellation.type} on {cancellation.sessionDate} at{" "}
                    {cancellation.sessionTime}
                  </p>
                  <p className="text-xs sm:text-sm bg-red-50 border border-red-200 rounded p-2">
                    <strong>Reason:</strong> {cancellation.reason}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cancelled {cancellation.cancelledAt}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <NavigationButton
                to="/sessions"
                variant="outline"
                size="sm"
                className="text-orange-700 border-orange-300 hover:bg-orange-100 text-xs sm:text-sm"
              >
                View All Sessions
              </NavigationButton>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Today's Sessions */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              Today's Sessions
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your training schedule for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-2 sm:p-3 border rounded-lg bg-gray-50/50"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">{session.clientName}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {session.time} • {session.type}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <Badge
                    variant={
                      session.status === "completed" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {session.status}
                  </Badge>
                </div>
              </div>
            ))}
            {recentSessions.length === 0 && (
              <div className="text-center py-4 sm:py-6">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No sessions today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <Target className="h-4 w-4 sm:h-5 sm:w-5" />
              Recent Clients
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Newest additions to your client base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {recentClients.map((client) => (
              <div key={client.id} className="space-y-2 p-2 sm:p-3 border rounded-lg bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{client.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {client.joinDate} • {client.level}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span>Goal Progress</span>
                    <span>{client.progress}%</span>
                  </div>
                  <Progress value={client.progress} className="h-2" />
                </div>
              </div>
            ))}
            {recentClients.length === 0 && (
              <div className="text-center py-4 sm:py-6">
                <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No recent clients</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <div className="p-1 bg-purple-100 rounded-lg">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
              </div>
              AI Coach Insights
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Smart recommendations based on your client data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {clients.length === 0 ? (
              <div className="text-center py-4 sm:py-6">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-purple-600">Add clients to see AI insights</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                  <div className="p-2 sm:p-3 bg-white/50 rounded-lg">
                    <div className="text-base sm:text-lg font-bold text-purple-700">
                      {(() => {
                        // Use real AI recommendation system (same as AI Coach tab)
                        const clientAnalyses = clients.map((client) =>
                          generateRecommendations(client, sessions, payments)
                        );
                        
                        // Get all recommendations across clients
                        const allRecommendations = clientAnalyses.flatMap((analysis) =>
                          analysis.recommendations.map((rec) => ({
                            ...rec,
                            clientName: analysis.clientName,
                            clientId: analysis.clientId,
                          }))
                        );
                        
                        // Count active recommendations (same logic as AI Coach tab)
                        return allRecommendations.length;
                      })()}
                    </div>
                    <p className="text-xs text-purple-600">Active Insights</p>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/50 rounded-lg">
                    <div className="text-base sm:text-lg font-bold text-orange-700">
                      {(() => {
                        // Use real AI recommendation system for high priority
                        const clientAnalyses = clients.map((client) =>
                          generateRecommendations(client, sessions, payments)
                        );
                        
                        // Get all recommendations across clients
                        const allRecommendations = clientAnalyses.flatMap((analysis) =>
                          analysis.recommendations.map((rec) => ({
                            ...rec,
                            clientName: analysis.clientName,
                            clientId: analysis.clientId,
                          }))
                        );
                        
                        // Count high priority recommendations
                        return allRecommendations.filter(r => r.priority === "high").length;
                      })()}
                    </div>
                    <p className="text-xs text-orange-600">High Priority</p>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 p-2 sm:p-3 bg-white/30 rounded">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                    <div className="text-xs sm:text-sm min-w-0">
                      <p className="font-medium">Workout Intensity</p>
                      <p className="text-xs text-muted-foreground">
                        {(() => {
                          // Use real AI recommendation system
                          const clientAnalyses = clients.map((client) =>
                            generateRecommendations(client, sessions, payments)
                          );
                          
                          const workoutRecommendations = clientAnalyses.flatMap((analysis) =>
                            analysis.recommendations.filter(rec => rec.type === "workout")
                          );
                          
                          return workoutRecommendations.length > 0
                            ? `${workoutRecommendations.length} workout recommendation${workoutRecommendations.length > 1 ? 's' : ''}`
                            : clients.length > 0 
                              ? "Clients progressing well ✓"
                              : "No clients yet";
                        })()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 sm:p-3 bg-white/30 rounded">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <div className="text-xs sm:text-sm min-w-0">
                      <p className="font-medium">Progress Tracking</p>
                      <p className="text-xs text-muted-foreground">
                        {(() => {
                          if (clients.length === 0) return "Add clients to track progress";
                          
                          // Count clients with improving progress trends from AI analysis
                          const clientAnalyses = clients.map((client) =>
                            generateRecommendations(client, sessions, payments)
                          );
                          
                          const improvingClients = clientAnalyses.filter(
                            analysis => analysis.progressTrend === "improving"
                          ).length;
                          
                          return improvingClients > 0
                            ? `${improvingClients}/${clients.length} clients improving`
                            : `Monitoring ${clients.length} client${clients.length > 1 ? 's' : ''}`;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <NavigationButton
                    to="/ai-recommendations"
                    variant="default"
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 text-xs sm:text-sm"
                  >
                    <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    View AI Dashboard
                  </NavigationButton>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Widget */}
      <QuickActionsWidget />

      {/* Revenue Analytics */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <h2 className="text-xl sm:text-2xl font-bold">Advanced Business Analytics</h2>
          <Badge className="bg-purple-100 text-purple-800 text-xs sm:text-sm w-fit">New Feature</Badge>
        </div>
        <RevenueAnalytics />
      </div>

      {/* Analytics Charts */}
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-4">
            Performance Charts
          </h2>
          <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
            Track your business performance and growth metrics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <RevenueChart />
          <ClientGrowthChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <SessionTypeChart />
          <WeeklyActivityChart />
        </div>
      </div>


    </div>
  );
};

export default Dashboard;
