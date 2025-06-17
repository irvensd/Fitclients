import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Users,
  Calendar,
  CreditCard,
  Dumbbell,
  Zap,
  UserPlus,
  CalendarPlus,
  DollarSign,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickActions = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "Add New Client",
      icon: <UserPlus className="h-4 w-4" />,
      action: () => navigate("/clients"),
      color: "text-blue-600",
    },
    {
      label: "Schedule Session",
      icon: <CalendarPlus className="h-4 w-4" />,
      action: () => navigate("/sessions"),
      color: "text-green-600",
    },
    {
      label: "Record Payment",
      icon: <DollarSign className="h-4 w-4" />,
      action: () => navigate("/payments"),
      color: "text-emerald-600",
    },
    {
      label: "Create Workout",
      icon: <Target className="h-4 w-4" />,
      action: () => navigate("/workouts"),
      color: "text-purple-600",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <TooltipProvider>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  size="lg"
                  className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
                >
                  <Plus
                    className={`h-6 w-6 transition-transform duration-200 ${
                      open ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Quick Actions</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent
            align="end"
            side="top"
            className="w-56 mb-2"
            sideOffset={8}
          >
            <DropdownMenuLabel className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {quickActions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  action.action();
                  setOpen(false);
                }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <span className={action.color}>{action.icon}</span>
                <span>{action.label}</span>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                navigate("/admin");
                setOpen(false);
              }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Users className="h-4 w-4 text-gray-600" />
              <span>Go to Dashboard</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    </div>
  );
};
