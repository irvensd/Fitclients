import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CreditCard,
  Lock,
  Shield,
  Zap,
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface ServiceRestrictionProps {
  children: React.ReactNode;
  featureName?: string;
  showUpgradePrompt?: boolean;
}

export const ServiceRestriction: React.FC<ServiceRestrictionProps> = ({
  children,
  featureName = "this feature",
  showUpgradePrompt = true,
}) => {
  const { isServiceSuspended, isTrialExpired, hasValidPaymentMethod } = useSubscription();

  // If service is not suspended, show the normal content
  if (!isServiceSuspended) {
    return <>{children}</>;
  }

  const handleAddPaymentMethod = () => {
    window.location.href = "/payments";
  };

  return (
    <div className="space-y-4">
      {/* Service Suspended Banner */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Lock className="h-5 w-5" />
            Service Temporarily Suspended
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-red-700">
              Your access to {featureName} has been suspended because your trial period has ended 
              and no payment method is on file.
            </p>
            
            {showUpgradePrompt && (
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <h4 className="font-medium text-gray-900 mb-2">To restore access:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Add a payment method to your account
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Choose from our Starter ($9/month) or Pro ($19/month) plans
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Access will be restored immediately after payment confirmation
                  </li>
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={handleAddPaymentMethod}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Data is Safe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-700 text-sm">
            All your client data, progress tracking, and settings are preserved and will be 
            immediately available once you add a payment method. We never delete your data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}; 