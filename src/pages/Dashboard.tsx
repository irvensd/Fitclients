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
import EmptyState from "@/components/EmptyState";

const Dashboard = () => {
  const { user } = useAuth();
  const { clients, sessions, payments, loading } = useData();
  const { getCurrentPlan, subscription } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show empty state for new users
  if (clients.length === 0 && sessions.length === 0 && payments.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <DevModeNotice />
        <EmptyState
          Icon={Users}
          title="Welcome to Your Dashboard!"
          description="Get started by adding your first client, scheduling a session, or exploring the features. Your dashboard will come to life as you add data."
          actionText="Add Your First Client"
          onAction={() => (window.location.href = "/clients")}
        />
      </div>
    );
  }

  // Calculate dashboard stats
  const stats = calculateDashboardStats(clients, sessions, payments);
  const recentClients = getRecentClients(clients);
  const todaysSessions = getTodaysSessions(sessions);
  const recentCancellations = getRecentCancellations(sessions);

  return (
    <div className="p-3 sm:p-6 space-y-6 sm:space-y-8 pb-24 sm:pb-32">
      <DevModeNotice />
      <QuickActionsWidget />

      {/* Admin Summary */}
      <AdminSummary
        totalClients={stats.totalClients}
        upcomingSessions={stats.sessionsThisWeek}
        unpaidInvoices={stats.pendingPayments}
        monthlyRevenue={stats.monthlyRevenue}
      />

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
            <CardTitle className="text-base sm:text-lg">Recent Clients</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {recentClients.length === 0 ? (
              <EmptyState
                Icon={Users}
                title="No Recent Clients"
                description="Clients who join in the last 30 days will appear here."
                actionText="Add Client"
                onAction={() => (window.location.href = "/clients")}
              />
            ) : (
              <ul className="divide-y">
                {recentClients.map((client) => (
                  <li key={client.id} className="py-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base truncate">{client.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                        {getTimeAgo(client.dateJoined)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Today's Sessions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Today's Sessions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {todaysSessions.length === 0 ? (
              <EmptyState
                Icon={Calendar}
                title="No Sessions Today"
                description="Scheduled sessions for today will appear here."
                actionText="Schedule Session"
                onAction={() => (window.location.href = "/sessions")}
              />
            ) : (
              <ul className="divide-y">
                {todaysSessions.map((session) => (
                  <li key={session.id} className="py-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">
                          {formatTime(session.startTime)} - {formatTime(session.endTime)}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {session.type.replace("-", " ")} • {session.status}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent Cancellations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Recent Cancellations</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {recentCancellations.length === 0 ? (
              <EmptyState
                Icon={XCircle}
                title="No Recent Cancellations"
                description="Client-cancelled sessions in the last 7 days will appear here."
              />
            ) : (
              <ul className="divide-y">
                {recentCancellations.map((session) => (
                  <li key={session.id} className="py-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">
                          {session.type.replace("-", " ")}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {formatCancellationTime(session.cancelledAt)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
