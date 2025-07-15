import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceRestriction } from "@/components/ServiceRestriction";
import { ServiceSuspensionBanner } from "@/components/ServiceSuspensionBanner";
import { TrialExpirationModal } from "@/components/TrialExpirationModal";
import {
  AlertTriangle,
  CreditCard,
  Calendar,
  Shield,
  Check,
  X,
  Clock,
  User,
} from "lucide-react";

const TrialTest = () => {
  const { 
    isOnTrial, 
    trialDaysLeft, 
    isTrialExpired, 
    hasValidPaymentMethod, 
    isServiceSuspended,
    subscription 
  } = useSubscription();
  const { user } = useAuth();
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const handleAddPaymentMethod = () => {
    alert("This would navigate to the billing page in a real app");
  };

  const handleDismissBanner = () => {
    setBannerDismissed(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Trial Status Test</h1>
          <p className="text-muted-foreground">
            Test page to demonstrate trial expiration functionality.
          </p>
        </div>
      </div>

      {/* Service Suspension Banner */}
      {!bannerDismissed && (
        <ServiceSuspensionBanner
          onAddPaymentMethod={handleAddPaymentMethod}
          onDismiss={handleDismissBanner}
        />
      )}

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Trial Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {isOnTrial ? "Yes" : "No"}
              </div>
              <div className="text-sm text-blue-600">On Trial</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {trialDaysLeft}
              </div>
              <div className="text-sm text-green-600">Days Left</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {isTrialExpired ? "Yes" : "No"}
              </div>
              <div className="text-sm text-orange-600">Trial Expired</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {isServiceSuspended ? "Yes" : "No"}
              </div>
              <div className="text-sm text-red-600">Service Suspended</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Payment Method</h4>
              <div className="flex items-center gap-2">
                {hasValidPaymentMethod ? (
                  <>
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">Valid payment method</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">No payment method</span>
                  </>
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Subscription Plan</h4>
              <Badge variant="outline">
                {subscription?.currentPlan || "Unknown"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => setShowTrialModal(true)}
              variant="outline"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Show Trial Modal
            </Button>
            <Button
              onClick={() => setBannerDismissed(false)}
              variant="outline"
            >
              <Shield className="h-4 w-4 mr-2" />
              Show Banner
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Restriction Test */}
      <ServiceRestriction featureName="this test feature">
        <Card>
          <CardHeader>
            <CardTitle>Protected Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This content should only be visible when service is not suspended.</p>
            <p>If you see this, it means the service restriction is working correctly.</p>
          </CardContent>
        </Card>
      </ServiceRestriction>

      {/* Trial Expiration Modal */}
      <TrialExpirationModal
        isOpen={showTrialModal}
        onClose={() => setShowTrialModal(false)}
        onAddPaymentMethod={handleAddPaymentMethod}
      />
    </div>
  );
};

export default TrialTest; 