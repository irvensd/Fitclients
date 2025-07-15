import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CreditCard,
  X,
  Shield,
  Check,
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface ServiceSuspensionBannerProps {
  onAddPaymentMethod: () => void;
  onDismiss?: () => void;
}

export const ServiceSuspensionBanner: React.FC<ServiceSuspensionBannerProps> = ({
  onAddPaymentMethod,
  onDismiss,
}) => {
  const { isServiceSuspended, isTrialExpired, hasValidPaymentMethod } = useSubscription();

  // Don't show banner if service is not suspended
  if (!isServiceSuspended) {
    return null;
  }

  return (
    <div className="bg-red-50 border-b border-red-200 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <Badge variant="destructive" className="text-xs">
                Service Suspended
              </Badge>
            </div>
            <div className="text-sm">
              <p className="font-medium text-red-800">
                Trial expired - Payment method required
              </p>
              <p className="text-red-600">
                Add a payment method to restore access to all features
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={onAddPaymentMethod}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
            {onDismiss && (
              <Button
                onClick={onDismiss}
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 