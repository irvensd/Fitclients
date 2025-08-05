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
      color: "bg-gradient-to-r from-pink-500 to-purple-500",
    },
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 safe-bottom">
      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 touch-manipulation"
                  aria-label="Quick Actions"
                >
                  <Plus className="h-6 w-6 sm:h-7 sm:w-7" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="left" className="hidden sm:block">
              <p>Quick Actions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent 
          side="top" 
          align="end" 
          className="w-56 sm:w-64 mr-2 mb-2 touch-manipulation"
          sideOffset={8}
        >
          {quickActions.map((action) => (
            <DropdownMenuItem 
              key={action.title} 
              onClick={() => navigate(action.href)}
              className="py-3 px-4 text-base cursor-pointer touch-manipulation active:scale-95 transition-transform"
            >
              <action.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              <div className="flex flex-col">
                <span className="font-medium">{action.title}</span>
                <span className="text-xs text-muted-foreground">{action.description}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
