import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Dumbbell,
  CreditCard,
  TrendingUp,
  Settings,
  LogOut,
  Brain,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  MessageSquare,
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your fitness business",
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
    description: "Manage your clients",
  },
  {
    name: "Sessions",
    href: "/sessions",
    icon: Calendar,
    description: "Schedule and track sessions",
  },
  {
    name: "Workouts",
    href: "/workouts",
    icon: Dumbbell,
    description: "Create and manage workout plans",
  },
  {
    name: "Payments",
    href: "/payments",
    icon: CreditCard,
    description: "Track payments and revenue",
  },
  {
    name: "Progress",
    href: "/progress",
    icon: TrendingUp,
    description: "Monitor client progress",
  },
  {
    name: "AI Coach",
    href: "/ai-recommendations",
    icon: Brain,
    badge: "AI",
    description: "AI-powered recommendations",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account and app settings",
  },
  {
    name: "Help",
    href: "/help",
    icon: HelpCircle,
    description: "Get help and support",
  },
];

interface AccessibleSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AccessibleSidebar: React.FC<AccessibleSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const sidebarRef = React.useRef<HTMLElement>(null);

  // Enable keyboard navigation for the sidebar
  useKeyboardNavigation(sidebarRef, {
    enableArrowKeys: true,
    enableEscapeKey: true,
  });

  const handleKeyDown = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = href;
    }
  };

  return (
    <TooltipProvider>
      <aside
        ref={sidebarRef}
        id="navigation"
        className={cn(
          "flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
        role="navigation"
        aria-label="Main navigation"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <h1 className="text-lg font-semibold">FitClient</h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
            aria-controls="navigation"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4" role="navigation" aria-label="Primary navigation">
          <ul className="space-y-2" role="list">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.name} role="listitem">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isCollapsed ? "justify-center" : ""
                        )}
                        aria-current={isActive ? "page" : undefined}
                        aria-label={isCollapsed ? `${item.name}. ${item.description}` : undefined}
                        onKeyDown={(e) => handleKeyDown(e, item.href)}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        {!isCollapsed && (
                          <div className="flex items-center gap-2 flex-1">
                            <span>{item.name}</span>
                            {item.badge && (
                              <Badge 
                                className="bg-purple-100 text-purple-800 text-xs"
                                aria-label={`${item.badge} feature`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        )}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">
                        <div className="flex items-center gap-2">
                          <span>{item.name}</span>
                          {item.badge && (
                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sm font-medium",
              isCollapsed ? "px-2" : "px-3"
            )}
            aria-label="Sign out of your account"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            {!isCollapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}; 