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
} from "lucide-react";
import { DevModeNotice } from "@/components/DevModeNotice";
import { AdminSummary } from "@/components/AdminSummary";
import { NavigationButton } from "@/components/NavigationButton";

// Mock data for demonstration
const stats = {
  totalClients: 24,
  upcomingSessions: 8,
  unpaidInvoices: 3,
  monthlyRevenue: 4850,
};

const recentSessions = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    time: "9:00 AM",
    type: "Personal Training",
    status: "completed" as const,
  },
  {
    id: "2",
    clientName: "Mike Chen",
    time: "10:30 AM",
    type: "Assessment",
    status: "completed" as const,
  },
  {
    id: "3",
    clientName: "Emily Davis",
    time: "2:00 PM",
    type: "Personal Training",
    status: "scheduled" as const,
  },
  {
    id: "4",
    clientName: "James Wilson",
    time: "3:30 PM",
    type: "Consultation",
    status: "scheduled" as const,
  },
];

const recentClients = [
  {
    id: "1",
    name: "Alex Thompson",
    joinDate: "2 days ago",
    level: "Beginner",
    progress: 15,
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    joinDate: "1 week ago",
    level: "Intermediate",
    progress: 65,
  },
  {
    id: "3",
    name: "David Kim",
    joinDate: "2 weeks ago",
    level: "Advanced",
    progress: 85,
  },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <DevModeNotice />
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
            Manage your personal training business - clients, sessions, and
            payments all in one place.
          </p>
        </div>
        <div className="flex gap-2">
          <NavigationButton to="/clients">
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </NavigationButton>
          <NavigationButton to="/sessions" variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Session
          </NavigationButton>
        </div>
      </div>

      {/* Admin Stats - Key Metrics */}
      <AdminSummary
        totalClients={stats.totalClients}
        upcomingSessions={stats.upcomingSessions}
        unpaidInvoices={stats.unpaidInvoices}
        monthlyRevenue={stats.monthlyRevenue}
      />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Today's Sessions
            </CardTitle>
            <CardDescription>Your scheduled sessions for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">{session.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{session.time}</span>
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
