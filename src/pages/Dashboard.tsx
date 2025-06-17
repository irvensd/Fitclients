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
} from "lucide-react";
import { DevModeNotice } from "@/components/DevModeNotice";
import { AdminSummary } from "@/components/AdminSummary";
import { NavigationButton } from "@/components/NavigationButton";
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

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

const formatSessionType = (type: string) => {
  switch (type) {
    case "personal-training":
      return "Personal Training";
    case "assessment":
      return "Assessment";
    case "consultation":
      return "Consultation";
    default:
      return type;
  }
};

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "yesterday";
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 14) return "1 week ago";
  if (diffDays <= 21) return "2 weeks ago";
  return `${Math.floor(diffDays / 7)} weeks ago`;
};

const formatCancellationTime = (cancelledAt: string) => {
  const date = new Date(cancelledAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

const Dashboard = () => {
  const { clients, sessions, payments, loading, error, getClientName } =
    useData();

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

  const recentClients = getRecentClients(clients).map((client) => ({
    id: client.id,
    name: client.name,
    joinDate: getTimeAgo(client.dateJoined),
    level:
      client.fitnessLevel.charAt(0).toUpperCase() +
      client.fitnessLevel.slice(1),
    progress: Math.floor(Math.random() * 80) + 20, // Random progress for demo
  }));

  return (
    <div className="space-y-6">
      <DevModeNotice />

      {/* Offline Mode Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Demo Mode Active</h3>
          </div>
          <p className="text-blue-700 mb-4">
            You're currently in demo/offline mode. All data is stored locally
            and will reset when you refresh. This gives you the perfect
            experience of a new account starting from zero!
          </p>
          <p className="text-sm text-blue-600 mb-4">
            <strong>Try it out:</strong> Add clients, schedule sessions, record
            payments - everything works and updates in real-time. Charts and
            metrics will populate as you add data.
          </p>
          <div className="flex gap-3">
            <NavigationButton to="/clients">
              <Plus className="h-4 w-4 mr-2" />
              Add First Client
            </NavigationButton>
            <NavigationButton to="/sessions" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Session
            </NavigationButton>
          </div>
        </CardContent>
      </Card>

      {/* Empty State for New Accounts */}
      {clients.length === 0 &&
        sessions.length === 0 &&
        payments.length === 0 && (
          <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/5">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Ready to Start!</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                This is what every new trainer sees - a clean slate ready to
                grow. Add your first client or session to see the dashboard come
                to life!
              </p>
            </CardContent>
          </Card>
        )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Trainer Portal
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Manage your clients, track sessions, and monitor business metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <NavigationButton to="/clients" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </NavigationButton>
          <NavigationButton to="/sessions">
            <Calendar className="h-4 w-4 mr-2" />
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Recent Client Cancellations
            </CardTitle>
            <CardDescription className="text-orange-700">
              Clients have cancelled sessions via their portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCancellations.map((cancellation) => (
              <div
                key={cancellation.id}
                className="p-3 bg-white border border-orange-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <p className="font-medium">{cancellation.clientName}</p>
                      <Badge
                        variant="outline"
                        className="border-red-200 text-red-700"
                      >
                        Client Cancelled
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {cancellation.type} on {cancellation.sessionDate} at{" "}
                      {cancellation.sessionTime}
                    </p>
                    <p className="text-sm bg-red-50 border border-red-200 rounded p-2">
                      <strong>Reason:</strong> {cancellation.reason}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Cancelled {cancellation.cancelledAt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <NavigationButton
                to="/sessions"
                variant="outline"
                size="sm"
                className="text-orange-700 border-orange-300 hover:bg-orange-100"
              >
                View All Sessions
              </NavigationButton>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Sessions
            </CardTitle>
            <CardDescription>Your training schedule for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{session.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {session.time} • {session.type}
                  </p>
                </div>
                <div>
                  <Badge
                    variant={
                      session.status === "completed" ? "default" : "secondary"
                    }
                  >
                    {session.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recent Clients
            </CardTitle>
            <CardDescription>
              Newest additions to your client base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentClients.map((client) => (
              <div key={client.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.joinDate} • {client.level}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Goal Progress</span>
                    <span>{client.progress}%</span>
                  </div>
                  <Progress value={client.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground mb-6">
            Track your business performance and growth metrics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <ClientGrowthChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SessionTypeChart />
          <WeeklyActivityChart />
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to help you manage your clients efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <NavigationButton
              to="/clients"
              variant="outline"
              className="h-24 flex-col gap-2"
            >
              <Users className="h-6 w-6" />
              Add New Client
            </NavigationButton>
            <NavigationButton
              to="/sessions"
              variant="outline"
              className="h-24 flex-col gap-2"
            >
              <Calendar className="h-6 w-6" />
              Schedule Session
            </NavigationButton>
            <NavigationButton
              to="/workouts"
              variant="outline"
              className="h-24 flex-col gap-2"
            >
              <Target className="h-6 w-6" />
              Create Workout
            </NavigationButton>
            <NavigationButton
              to="/payments"
              variant="outline"
              className="h-24 flex-col gap-2"
            >
              <DollarSign className="h-6 w-6" />
              Record Payment
            </NavigationButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
