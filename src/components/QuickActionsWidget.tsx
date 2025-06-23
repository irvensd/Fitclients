import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

  const actions = [
    { name: "Dashboard", path: "/admin" },
    { name: "Add New Client", path: "/clients" },
    { name: "Schedule Session", path: "/sessions" },
    { name: "Record Payment", path: "/payments" },
    { name: "Add Progress", path: "/progress" },
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
          {actions.map((action) => (
            <DropdownMenuItem key={action.name} onClick={() => navigate(action.path)}>
              <span className="text-sm sm:text-base">{action.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
