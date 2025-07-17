import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ServiceSuspensionBanner } from "@/components/ServiceSuspensionBanner";
import { TrialExpirationModal } from "@/components/TrialExpirationModal";
import { useSubscription } from "@/contexts/SubscriptionContext";

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
  ExternalLink,
  HelpCircle,
  MessageSquare,
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
import { QuickActionsWidget } from "@/components/QuickActionsWidget";
import { DemoModeBanner } from "./DemoModeBanner";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
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
    name: "AI Coach",
    href: "/ai-recommendations",
    icon: Brain,
  },
];

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { logout, isDemoUser, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
      window.location.href = "/login";
    }
  };

  // Add demo portal to navigation for demo users
  const isDemo = isDemoUser || user?.email === 'trainer@demo.com';
  const demoNavigation = isDemo ? [
    ...navigation,
    {
      name: "Demo Portal",
      href: "/demo-portal",
      icon: ExternalLink,
    }
  ] : navigation;

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "hidden lg:flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
          <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
            <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold">FitClient</span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {demoNavigation.map((item) => (
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
          <SidebarNavItem
            item={{ name: "Help & Support", href: "/help", icon: HelpCircle }}
            isActive={location.pathname.startsWith("/help")}
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
        {!isCollapsed && (
          <div className="flex items-center gap-2 flex-1">
            <span>{item.name}</span>
          </div>
        )}
      </Link>
    </TooltipTrigger>
    {isCollapsed && (
      <TooltipContent side="right">
        <div className="flex items-center gap-2">
          <span>{item.name}</span>
        </div>
      </TooltipContent>
    )}
  </Tooltip>
);

const MobileSidebar = () => {
  const location = useLocation();
  const { logout, isDemoUser, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
      window.location.href = "/login";
    }
  };

  // Add demo portal to navigation for demo users
  const isDemo = isDemoUser || user?.email === 'trainer@demo.com';
  const demoNavigation = isDemo ? [
    ...navigation,
    {
      name: "Demo Portal",
      href: "/demo-portal",
      icon: ExternalLink,
    }
  ] : navigation;

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
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold">FitClient</span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            {demoNavigation.map((item) => (
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
                  <div className="flex items-center gap-2 flex-1">
                    <span>{item.name}</span>
                  </div>
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
            <SheetClose asChild>
              <Link
                to="/help"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-all duration-200",
                  location.pathname.startsWith("/help")
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "hover:bg-sidebar-accent"
                )}
              >
                <HelpCircle className="h-5 w-5" />
                Help & Support
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
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const { isTrialExpired, hasValidPaymentMethod } = useSubscription();

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

  // Show trial expiration modal when trial expires and no payment method
  useEffect(() => {
    if (isTrialExpired && !hasValidPaymentMethod) {
      setShowTrialModal(true);
    }
  }, [isTrialExpired, hasValidPaymentMethod]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleAddPaymentMethod = () => {
    // Navigate to billing page to add payment method
    window.location.href = "/payments";
  };

  const handleDismissBanner = () => {
    setBannerDismissed(true);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Service Suspension Banner */}
        {!bannerDismissed && (
          <ServiceSuspensionBanner
            onAddPaymentMethod={handleAddPaymentMethod}
            onDismiss={handleDismissBanner}
          />
        )}
        
        <header className="flex h-16 items-center justify-between gap-2 sm:gap-4 border-b bg-background px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <MobileSidebar />
            <BreadcrumbNav />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <GlobalSearch />
            <NotificationBell />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <DemoModeBanner className="mb-4" />
          {children}
        </main>
      </div>
      <QuickActionsWidget />
      
      {/* Trial Expiration Modal */}
      <TrialExpirationModal
        isOpen={showTrialModal}
        onClose={() => setShowTrialModal(false)}
        onAddPaymentMethod={handleAddPaymentMethod}
      />
    </div>
  );
};
