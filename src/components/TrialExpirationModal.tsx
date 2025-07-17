import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CreditCard,
  Calendar,
  Shield,
  Zap,
  Check,
  X,
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";

interface TrialExpirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPaymentMethod: () => void;
}

export const TrialExpirationModal: React.FC<TrialExpirationModalProps> = ({
  isOpen,
  onClose,
  onAddPaymentMethod,
}) => {
  const { isTrialExpired, hasValidPaymentMethod, trialDaysLeft } = useSubscription();
  const { user } = useAuth();

  // Don't show modal if trial hasn't expired or user has valid payment method
  if (!isTrialExpired || hasValidPaymentMethod) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Trial Period Expired
          </DialogTitle>
          <DialogDescription>
            Your 14-day free trial has ended. Add a payment method to continue using FitClient.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning Card */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <X className="h-5 w-5" />
                Service Temporarily Suspended
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">
                Your access to FitClient features has been suspended because your trial period has ended 
                and no payment method is on file. Add a payment method to restore full access.
              </p>
            </CardContent>
          </Card>

          {/* What's Happening */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                What Happened?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Trial Period Ended</p>
                  <p className="text-sm text-muted-foreground">
                    Your 14-day free trial has expired. You had {Math.abs(trialDaysLeft)} days to add a payment method.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">No Payment Method Found</p>
                  <p className="text-sm text-muted-foreground">
                    We couldn't find a valid payment method on your account to continue billing.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Service Suspended</p>
                  <p className="text-sm text-muted-foreground">
                    Your access to paid features has been temporarily suspended until payment is set up.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How to Fix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                How to Restore Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Add Payment Method</p>
                  <p className="text-sm text-muted-foreground">
                    Add a credit card or debit card to your account to continue billing.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Choose Your Plan</p>
                  <p className="text-sm text-muted-foreground">
                    Select from our Starter ($9/month) or Pro ($19/month) plans.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Instant Restoration</p>
                  <p className="text-sm text-muted-foreground">
                    Your access will be restored immediately once payment is confirmed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>All payments processed securely via Stripe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>PCI DSS compliant payment processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Your data is safe and never shared</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Cancel anytime with one click</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={onAddPaymentMethod}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              size="lg"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Add Payment Method & Continue
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              size="lg"
            >
              Maybe Later
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-muted-foreground">
            Need help? Contact our support team at support@fitclients.io
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 