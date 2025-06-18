import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

const Sidebar = ({ className }: { className?: string }) => {
  const location = useLocation();

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
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-3 left-3 z-50 h-10 w-10 bg-background/80 backdrop-blur border shadow-sm"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar-background">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar with mobile search */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-3 sm:px-4 lg:px-6">
            <div className="flex-1 lg:hidden"></div>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Hide search on very small screens, show on sm+ */}
              <div className="hidden sm:block w-48 md:w-64">
                <GlobalSearch />
              </div>
              {/* Mobile search button for xs screens */}
              <div className="sm:hidden">
                <Button variant="ghost" size="sm">
                  <svg
                    className="h-4 w-4"
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
                </Button>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="mb-4 lg:mb-6">
              <BreadcrumbNav />
            </div>
            {children}
          </div>
        </main>

        {/* Quick Actions FAB - positioned better for mobile */}
        <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-40">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};
