import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExternalLink, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const DevModeNotice = () => {
  const { isDevMode } = useAuth();

  if (!isDevMode) return null;

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
};
