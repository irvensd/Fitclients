import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TestTube, Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DemoPaymentBannerProps {
  className?: string;
  variant?: "compact" | "full";
}

export const DemoPaymentBanner: React.FC<DemoPaymentBannerProps> = ({ 
  className = "",
  variant = "full"
}) => {
  const { isDemoUser } = useAuth();

  if (!isDemoUser) return null;

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-full text-xs ${className}`}>
        <TestTube className="h-3 w-3 text-yellow-600" />
        <span className="text-yellow-800 font-medium">Demo Payments</span>
        <Badge variant="secondary" className="bg-yellow-200 text-yellow-800 text-xs">
          Test Mode
        </Badge>
      </div>
    );
  }

  return (
    <Alert className={`bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 ${className}`}>
      <CreditCard className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-yellow-800 font-medium">Demo Payment System</span>
            <p className="text-yellow-700 text-sm mt-1">
              All payment features are in test mode. No real charges will be processed.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
            <TestTube className="h-3 w-3 mr-1" />
            Test Mode
          </Badge>
          <div className="flex items-center gap-1 text-xs text-yellow-600">
            <Info className="h-3 w-3" />
            Safe to test
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}; 