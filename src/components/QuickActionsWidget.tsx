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

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
  variant?: "default" | "secondary" | "outline";
}

export const QuickActionsWidget = () => {
  const quickActions: QuickAction[] = [
    {
      id: "add-client",
      title: "Add New Client",
      description: "Onboard a new client",
      icon: <Plus className="h-4 w-4" />,
      action: () => console.log("Add client"),
      variant: "default",
    },
    {
      id: "schedule-session",
      title: "Schedule Session",
      description: "Book upcoming sessions",
      icon: <Calendar className="h-4 w-4" />,
      action: () => console.log("Schedule session"),
      variant: "outline",
    },
    {
      id: "record-payment",
      title: "Record Payment",
      description: "Log client payments",
      icon: <DollarSign className="h-4 w-4" />,
      action: () => console.log("Record payment"),
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
      badge: "3 Due",
      variant: "outline",
    },
    {
      id: "progress-update",
      title: "Progress Updates",
      description: "Review client progress",
      icon: <TrendingUp className="h-4 w-4" />,
      action: () => console.log("Progress update"),
      variant: "outline",
    },
  ];

  const upcomingTasks = [
    {
      id: "1",
      title: "Sarah's Session Reminder",
      time: "In 2 hours",
      type: "reminder",
    },
    {
      id: "2",
      title: "Mike's Payment Due",
      time: "Tomorrow",
      type: "payment",
    },
    {
      id: "3",
      title: "Emma's Progress Check",
      time: "This week",
      type: "progress",
    },
  ];

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

          <Button variant="outline" className="w-full mt-4">
            <Users className="h-4 w-4 mr-2" />
            View All Tasks
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
