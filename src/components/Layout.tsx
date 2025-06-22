import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

import {
  LayoutDashboard,
  Users,
  Calendar,
  Dumbbell,
  CreditCard,
  TrendingUp,
  Menu,
  Zap,
  Settings,
  LogOut,
  Share2,
  Brain,
  Sparkles,
  Megaphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalSearch } from "@/components/GlobalSearch";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { QuickActions } from "@/components/QuickActions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-media-query";
import NotificationBell from "./NotificationBell";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Features",
    href: "/features",
    icon: Sparkles,
  },
  {
    name: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    name: "Sessions",
    href: "/sessions",
    icon: Calendar,
  },
  {
    name: "Workouts",
    href: "/workouts",
    icon: Dumbbell,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    name: "Progress",
    href: "/progress",
    icon: TrendingUp,
  },
  {
    name: "Client Portals",
    href: "/client-portals",
    icon: Share2,
  },
  {
    name: "AI Coach",
    href: "/ai-recommendations",
    icon: Brain,
  },
  {
    name: "Marketing",
    href: "/marketing",
    icon: Megaphone,
    soon: true,
  },
];

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
      window.location.href = "/login";
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "hidden lg:flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
          <Link to="/admin" className="flex items-center gap-2 overflow-hidden">
            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold">FitClient</span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => (
            <SidebarNavItem
              key={item.name}
              item={item}
              isActive={location.pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-sidebar-border space-y-2">
          <SidebarNavItem
            item={{ name: "Settings", href: "/settings", icon: Settings }}
            isActive={location.pathname.startsWith("/settings")}
            isCollapsed={isCollapsed}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center gap-3 transition-all",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm">Logout</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">Logout</TooltipContent>}
          </Tooltip>
        </div>

        <div className="px-4 py-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={onToggleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

const SidebarNavItem = ({ item, isActive, isCollapsed }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "hover:bg-sidebar-accent",
          isCollapsed ? "justify-center" : ""
        )}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span>{item.name}</span>}
      </Link>
    </TooltipTrigger>
    {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
  </Tooltip>
);

const MobileSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
      window.location.href = "/login";
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72 bg-sidebar text-sidebar-foreground">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">FitClient</span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <SheetClose key={item.name} asChild>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all duration-200",
                    location.pathname === item.href
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </SheetClose>
            ))}
          </nav>

          <div className="px-4 py-4 border-t border-sidebar-border space-y-2">
            <SheetClose asChild>
              <Link
                to="/settings"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all duration-200",
                  location.pathname.startsWith("/settings")
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent"
                )}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </SheetClose>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 justify-start px-3 py-2 text-base font-medium"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Collapse sidebar by default on smaller desktop screens
    if (isDesktop) {
        const mediaQuery = window.matchMedia('(max-width: 1280px)');
        setIsCollapsed(mediaQuery.matches);

        const listener = (e: MediaQueryListEvent) => setIsCollapsed(e.matches);
        mediaQuery.addEventListener('change', listener);

        return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [isDesktop]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <MobileSidebar />
            <BreadcrumbNav />
          </div>

          <div className="flex items-center gap-4">
            <GlobalSearch />
            <QuickActions />
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
