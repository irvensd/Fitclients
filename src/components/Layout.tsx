import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Bell,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { GlobalSearch } from "@/components/GlobalSearch";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { QuickActions } from "@/components/QuickActions";

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
];

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      console.log("Logout button clicked");
      await logout();
      console.log("Logout completed");
    } catch (error) {
      console.error("Failed to logout:", error);
      // Force logout even if there's an error
      window.location.href = "/login";
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 hover:translate-x-1"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
};

const Sidebar = ({
  className,
  isMobile = false,
}: {
  className?: string;
  isMobile?: boolean;
}) => {
  const location = useLocation();

  if (isMobile) {
    return <MobileSidebar />;
  }

  return (
    <div className={cn("flex h-full w-64 flex-col", className)}>
      <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">
            FitClient
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4 space-y-2">
        <Link
          to="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            location.pathname === "/settings" ||
              location.pathname === "/admin/settings"
              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1",
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
};

const MobileSidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
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

  const handleNavClick = () => {
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Mobile Header */}
      <div className="flex h-20 items-center justify-center px-6 border-b bg-gradient-to-r from-primary to-primary/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-white">FitClient</h1>
            <p className="text-xs text-white/80">Trainer Dashboard</p>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Main Menu
          </h2>
        </div>

        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium transition-all duration-200 active:scale-95",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-gray-700 hover:bg-gray-50 active:bg-gray-100",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
                  isActive ? "bg-white/20" : "bg-gray-100",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-white" : "text-gray-600",
                  )}
                />
              </div>
              <span className="flex-1">{item.name}</span>
              {isActive && <div className="w-2 h-2 rounded-full bg-white/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Footer */}
      <div className="border-t bg-gray-50 p-4 space-y-2">
        <Link
          to="/settings"
          onClick={handleNavClick}
          className={cn(
            "flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium transition-all duration-200 active:scale-95",
            location.pathname === "/settings" ||
              location.pathname === "/admin/settings"
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : "text-gray-700 hover:bg-white active:bg-gray-100",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
              location.pathname === "/settings" ||
                location.pathname === "/admin/settings"
                ? "bg-white/20"
                : "bg-gray-200",
            )}
          >
            <Settings
              className={cn(
                "h-5 w-5",
                location.pathname === "/settings" ||
                  location.pathname === "/admin/settings"
                  ? "text-white"
                  : "text-gray-600",
              )}
            />
          </div>
          <span className="flex-1">Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium text-red-600 hover:bg-red-50 active:bg-red-100 transition-all duration-200 active:scale-95 w-full"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100">
            <LogOut className="h-5 w-5 text-red-600" />
          </div>
          <span className="flex-1 text-left">Logout</span>
        </button>
      </div>
    </div>
  );
};

const AINotifications = () => {
  const { clients } = useData();
  const appliedRecs = JSON.parse(
    localStorage.getItem("appliedRecommendations") || "[]",
  );

  // Generate dynamic notifications based on real data
  const notifications = [];

  // High priority client alerts
  const clientsNeedingAttention = clients
    .filter(
      (client) => client.fitnessLevel === "beginner" || Math.random() > 0.7,
    )
    .slice(0, 2);

  if (clientsNeedingAttention.length > 0) {
    notifications.push({
      id: "client-attention",
      icon: Sparkles,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      title: "High Priority Alert",
      description: `${clientsNeedingAttention[0]?.name || "Client"} needs attention - check AI recommendations`,
      link: "/ai-recommendations",
    });
  }

  // Progress updates
  const activeProgressCount = Math.max(0, clients.length - appliedRecs.length);
  if (activeProgressCount > 0) {
    notifications.push({
      id: "progress-update",
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Progress Update",
      description: `${activeProgressCount} clients ready for workout progression`,
      link: "/progress",
    });
  }

  // New AI insights
  const insightCount = Math.max(0, 5 - appliedRecs.length);
  if (insightCount > 0) {
    notifications.push({
      id: "new-insights",
      icon: Zap,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "New Insights Available",
      description: `AI has generated ${insightCount} new training recommendations`,
      link: "/ai-recommendations",
    });
  }

  // Session alerts (if there are recent sessions)
  if (clients.length > 0) {
    notifications.push({
      id: "session-alert",
      icon: Calendar,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      title: "Session Reminder",
      description: `Upcoming sessions today - check your schedule`,
      link: "/sessions",
    });
  }

  return (
    <>
      {notifications.slice(0, 3).map((notification) => (
        <DropdownMenuItem key={notification.id} asChild>
          <Link
            to={notification.link}
            className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted transition-colors"
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${notification.iconBg}`}
            >
              <notification.icon
                className={`h-4 w-4 ${notification.iconColor}`}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs text-muted-foreground">
                {notification.description}
              </p>
            </div>
          </Link>
        </DropdownMenuItem>
      ))}

      {notifications.length === 0 && (
        <DropdownMenuItem
          disabled
          className="flex items-center justify-center p-6"
        >
          <div className="text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">All caught up!</p>
            <p className="text-xs text-muted-foreground">
              No new notifications
            </p>
          </div>
        </DropdownMenuItem>
      )}
    </>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-sidebar-background border-r border-sidebar-border">
          <Sidebar />
        </div>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          >
            <Menu className="h-6 w-6 text-white" />
            <span className="sr-only">Open navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-80 sm:w-96 bg-white border-r-0 shadow-2xl"
        >
          <VisuallyHidden.Root>
            <SheetTitle>Navigation Menu</SheetTitle>
          </VisuallyHidden.Root>
          <MobileSidebar onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar with mobile search */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile spacing for menu button */}
            <div className="flex-1 lg:hidden pl-16"></div>

            {/* Desktop title */}
            <div className="hidden lg:flex flex-1">
              <h1 className="text-xl font-semibold text-foreground">
                FitClient Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Search - responsive sizing */}
              <div className="hidden sm:block w-64 lg:w-80">
                <GlobalSearch />
              </div>

              {/* AI Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 relative"
                    title="AI Coach Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
                    </span>
                    <span className="sr-only">AI Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    AI Coach Notifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/ai-recommendations"
                      className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                        <Sparkles className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          High Priority Alert
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(() => {
                            const appliedRecs = JSON.parse(
                              localStorage.getItem("appliedRecommendations") ||
                                "[]",
                            );
                            const activeCount = Math.max(
                              0,
                              2 -
                                appliedRecs.filter(
                                  (r) => r.clientName === "Sarah Johnson",
                                ).length,
                            );
                            return activeCount > 0
                              ? `Sarah Johnson needs attention - ${activeCount} urgent recommendations`
                              : "All recommendations addressed ✓";
                          })()}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/progress"
                      className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Progress Update</p>
                        <p className="text-xs text-muted-foreground">
                          {(() => {
                            const appliedRecs = JSON.parse(
                              localStorage.getItem("appliedRecommendations") ||
                                "[]",
                            );
                            const activeCount = Math.max(
                              0,
                              3 - appliedRecs.length,
                            );
                            return `${activeCount} clients ready for workout progression`;
                          })()}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/ai-recommendations"
                      className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <Zap className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          New Insights Available
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(() => {
                            const appliedRecs = JSON.parse(
                              localStorage.getItem("appliedRecommendations") ||
                                "[]",
                            );
                            const activeCount = Math.max(
                              0,
                              5 - appliedRecs.length,
                            );
                            return `AI has generated ${activeCount} new training recommendations`;
                          })()}
                        </p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/ai-recommendations"
                      className="flex items-center justify-center gap-2 p-3 text-purple-600"
                    >
                      <Brain className="h-4 w-4" />
                      View AI Coach Dashboard
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile search icon */}
              <div className="sm:hidden">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="sr-only">Search</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <BreadcrumbNav />
            </div>
            {children}
          </div>
        </main>

        {/* Quick Actions FAB - optimized for mobile */}
        <div className="fixed bottom-6 right-6 z-40">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};
