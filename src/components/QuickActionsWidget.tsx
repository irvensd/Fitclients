import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  FileText,
  MessageSquare,
  Zap,
  Target,
  Award,
  Share2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export const QuickActionsWidget = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Add Client",
      description: "Register a new client",
      icon: Users,
      href: "/clients",
      color: "bg-blue-500",
    },
    {
      title: "Schedule Session",
      description: "Book a training session",
      icon: Calendar,
      href: "/sessions",
      color: "bg-green-500",
    },
    {
      title: "Record Payment",
      description: "Log a payment received",
      icon: DollarSign,
      href: "/payments",
      color: "bg-emerald-500",
    },
    {
      title: "View Analytics",
      description: "Check your business metrics",
      icon: BarChart3,
      href: "/admin",
      color: "bg-purple-500",
    },
    {
      title: "Create Workout",
      description: "Design a new workout plan",
      icon: Target,
      href: "/workouts",
      color: "bg-orange-500",
    },
    {
      title: "Referral Program",
      description: "Invite trainers & earn rewards",
      icon: Share2,
      href: "/settings?tab=referrals",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  aria-label="Quick Actions"
                >
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Quick Actions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent side="top" align="end" className="w-48 sm:w-56">
          {quickActions.map((action) => (
            <DropdownMenuItem key={action.title} onClick={() => navigate(action.href)}>
              <span className="text-sm sm:text-base">{action.title}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
