import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Settings,
  CheckCircle,
  Users,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const DevModeNotice = () => {
  const { isDevMode, user } = useAuth();

  if (isDevMode) {
    return (
      <Alert className="mb-6 border-yellow-200 bg-yellow-50">
        <Settings className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex-1">
            <strong>Development Mode:</strong> Firebase not configured. Using
            local authentication.
            <br />
            <span className="text-sm">
              To enable full authentication, set up Firebase and add environment
              variables.
            </span>
          </div>
          <Button variant="outline" size="sm" asChild className="ml-4">
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              Setup Firebase
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show Firebase setup status for production
  return (
    <Alert className="mb-6 border-blue-200 bg-blue-50">
      <CheckCircle className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between text-blue-800">
        <div className="flex-1">
          <strong>🔥 Firebase Connected!</strong>{" "}
          {user ? `Welcome back, ${user.email}` : "Ready for trainer accounts."}
          <br />
          <span className="text-sm">
            {user
              ? "You're logged in and ready to manage clients."
              : "Create your first trainer account or sign in to get started."}
          </span>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-300 hover:bg-blue-100"
            onClick={() =>
              window.open(
                "https://console.firebase.google.com/project/fitclients-4c5f2/authentication/users",
                "_blank",
              )
            }
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Users
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
