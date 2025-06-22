import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Zap, Brain, CheckCircle } from "lucide-react";
import { useAINotifications } from "@/lib/aiNotifications";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useAINotifications();

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    // Potentially navigate to the notification's actionUrl if it exists
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 relative"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-5 w-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center border-2 border-background">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length > 0 ? (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} asChild>
                <Link
                  to={notification.actionUrl || "#"}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={cn(
                    "flex items-start gap-3 p-3 cursor-pointer hover:bg-muted transition-colors w-full",
                    !notification.read && "bg-blue-500/10"
                  )}
                >
                  <div className="flex-shrink-0 mt-1">
                    <Badge variant={notification.priority === 'high' ? 'destructive' : 'secondary'}>
                      {notification.priority}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500 self-center ml-2"></div>
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <DropdownMenuItem disabled className="flex items-center justify-center p-6">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs text-muted-foreground">No new notifications</p>
            </div>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            to="/ai-recommendations"
            className="flex items-center justify-center gap-2 p-3 text-sm text-primary"
          >
            <Brain className="h-4 w-4" />
            View All Insights
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell; 