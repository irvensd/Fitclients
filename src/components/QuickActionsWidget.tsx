import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Calendar,
  DollarSign,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
  variant?: "default" | "secondary" | "outline";
}

interface UpcomingTask {
  id: string;
  title: string;
  time: string;
  type: "reminder" | "payment" | "progress";
}

const formatTimeUntil = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return diffMins <= 0 ? "Now" : `In ${diffMins} min`;
  } else if (diffHours < 24) {
    return `In ${diffHours} hours`;
  } else if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays < 7) {
    return `In ${diffDays} days`;
  } else {
    return `${date.toLocaleDateString()}`;
  }
};

export const QuickActionsWidget = () => {
  const { clients, sessions, payments, getClientName } = useData();
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: "add-client",
      title: "Add New Client",
      description: "Onboard a new client",
      icon: <Plus className="h-4 w-4" />,
      action: () => navigate("/clients"),
      variant: "default",
    },
    {
      id: "schedule-session",
      title: "Schedule Session",
      description: "Book upcoming sessions",
      icon: <Calendar className="h-4 w-4" />,
      action: () => navigate("/sessions"),
      variant: "outline",
    },
    {
      id: "record-payment",
      title: "Record Payment",
      description: "Log client payments",
      icon: <DollarSign className="h-4 w-4" />,
      action: () => navigate("/payments"),
      variant: "outline",
    },
    {
      id: "send-reminder",
      title: "Send Reminders",
      description: "Notify clients about sessions",
      icon: <MessageSquare className="h-4 w-4" />,
      action: () => console.log("Send reminder"),
      badge: "Auto",
      variant: "secondary",
    },
    {
      id: "follow-up",
      title: "Client Follow-up",
      description: "Check in with clients",
      icon: <Phone className="h-4 w-4" />,
      action: () => console.log("Follow up"),
      badge: payments.filter(p => p.status === "pending").length > 0 ? `${payments.filter(p => p.status === "pending").length} Due` : undefined,
      variant: "outline",
    },
    {
      id: "progress-update",
      title: "Progress Updates",
      description: "Review client progress",
      icon: <TrendingUp className="h-4 w-4" />,
      action: () => navigate("/progress"),
      variant: "outline",
    },
  ];

  // Generate real upcoming tasks from user data
  const generateUpcomingTasks = (): UpcomingTask[] => {
    const tasks: UpcomingTask[] = [];
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 1. Session reminders (next 24 hours)
    const upcomingSessions = sessions
      .filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= now && 
               sessionDate <= next24Hours && 
               session.status === "scheduled";
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 2); // Limit to 2 most urgent

    upcomingSessions.forEach(session => {
      const sessionDateTime = new Date(`${session.date}T${session.startTime}`);
      const clientName = getClientName(session.clientId);
      tasks.push({
        id: `session-${session.id}`,
        title: `${clientName}'s Session Reminder`,
        time: formatTimeUntil(sessionDateTime),
        type: "reminder",
      });
    });

    // 2. Payment reminders (pending payments)
    const pendingPayments = payments
      .filter(payment => payment.status === "pending")
      .slice(0, 2); // Limit to 2 most urgent

    pendingPayments.forEach(payment => {
      const clientName = getClientName(payment.clientId);
      const dueDate = new Date(payment.date);
      const isOverdue = dueDate < now;
      tasks.push({
        id: `payment-${payment.id}`,
        title: `${clientName}'s Payment ${isOverdue ? "Overdue" : "Due"}`,
        time: isOverdue ? "Overdue" : formatTimeUntil(dueDate),
        type: "payment",
      });
    });

    // 3. Progress check reminders (clients without recent sessions)
    const clientsNeedingFollowUp = clients
      .filter(client => {
        // Find last session for this client
        const clientSessions = sessions
          .filter(s => s.clientId === client.id && s.status === "completed")
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (clientSessions.length === 0) return false; // Skip clients with no sessions
        
        const lastSession = clientSessions[0];
        const lastSessionDate = new Date(lastSession.date);
        const daysSinceLastSession = (now.getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24);
        
        return daysSinceLastSession > 14; // 2 weeks without a session
      })
      .slice(0, 1); // Limit to 1 most urgent

    clientsNeedingFollowUp.forEach(client => {
      tasks.push({
        id: `progress-${client.id}`,
        title: `${client.name}'s Progress Check`,
        time: "This week",
        type: "progress",
      });
    });

    // If no real tasks, show a placeholder
    if (tasks.length === 0) {
      tasks.push({
        id: "no-tasks",
        title: "All caught up!",
        time: "Great work",
        type: "progress",
      });
    }

    return tasks.slice(0, 3); // Limit to 3 total tasks
  };

  const upcomingTasks = generateUpcomingTasks();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Quick Actions */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Fast access to common tasks and workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant || "outline"}
                className="h-auto p-4 flex flex-col items-start gap-2 relative"
                onClick={action.action}
              >
                {action.badge && (
                  <Badge className="absolute -top-1 -right-1 h-5 px-1 text-xs">
                    {action.badge}
                  </Badge>
                )}
                <div className="flex items-center gap-2 w-full">
                  {action.icon}
                  <span className="font-medium text-sm">{action.title}</span>
                </div>
                <span className="text-xs text-muted-foreground text-left">
                  {action.description}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Upcoming Tasks
          </CardTitle>
          <CardDescription>Things that need your attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    task.type === "reminder"
                      ? "bg-blue-500"
                      : task.type === "payment"
                        ? "bg-green-500"
                        : "bg-purple-500"
                  }`}
                />
                <div>
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.time}</p>
                </div>
              </div>
              <Button size="sm" variant="ghost">
                <Clock className="h-3 w-3" />
              </Button>
            </div>
          ))}

          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => navigate("/sessions")}
          >
            <Users className="h-4 w-4 mr-2" />
            View All Tasks
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
