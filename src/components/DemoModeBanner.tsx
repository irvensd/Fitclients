import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sparkles, ExternalLink, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DemoModeBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({ 
  onDismiss, 
  className = "" 
}) => {
  const { isDemoUser } = useAuth();

  if (!isDemoUser) return null;

  return (
    <Alert className={`bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 ${className}`}>
      <Sparkles className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-800 font-medium">Demo Mode Active</span>
          <span className="text-blue-600 text-sm">
            You're exploring FitClient with sample data. All changes are temporary.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-700 border-blue-300 hover:bg-blue-100"
            onClick={() => window.open('/demo-portal', '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View Client Portal
          </Button>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}; 