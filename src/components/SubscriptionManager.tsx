import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Crown,
  Check,
  Star,
  AlertTriangle,
  CreditCard,
  Calendar,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  SUBSCRIPTION_PLANS,
  formatPrice,
  createCheckoutSession,
  cancelSubscription,
} from "@/lib/stripe";
import { useToast } from "@/hooks/use-toast";
import { DemoCheckoutModal } from "@/components/DemoCheckoutModal";

const PlanCard = ({
  plan,
  isCurrentPlan,
  onUpgrade,
  loading,
}: {
  plan: typeof SUBSCRIPTION_PLANS.FREE;
  isCurrentPlan: boolean;
  onUpgrade: (planId: string) => void;
  loading: boolean;
}) => {
  const isPro = plan.id === "professional";
  const isGold = plan.id === "gold";

  return (
    <Card
      className={`relative transition-all duration-300 ${
        isPro ? "ring-2 ring-primary shadow-lg scale-105" : "hover:shadow-md"
      } ${isCurrentPlan ? "bg-green-50 border-green-200" : ""}`}
    >
      {isPro && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-white">
            <Star className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-green-600 text-white">
            <Check className="h-3 w-3 mr-1" />
            Current Plan
          </Badge>
        </div>
      )}

      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          {isGold && <Crown className="h-6 w-6 text-yellow-600 mr-2" />}
          <CardTitle className="text-xl">{plan.name}</CardTitle>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            {plan.price > 0 && (
              <span className="text-sm text-muted-foreground">$</span>
            )}
            <span className="text-3xl font-bold">
              {plan.price === 0 ? "Free" : plan.price}
            </span>
            {plan.price > 0 && (
              <span className="text-muted-foreground">/{plan.interval}</span>
            )}
          </div>
          {plan.id === "free" && (
            <p className="text-sm text-muted-foreground mt-1">Forever</p>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 mb-6 p-3 bg-muted rounded-lg">
          <h4 className="font-medium text-sm">Plan Limits</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>
              Clients:{" "}
              {plan.limits.clients === -1 ? "Unlimited" : plan.limits.clients}
            </div>
            <div>
              Sessions:{" "}
              {plan.limits.sessions === -1 ? "Unlimited" : plan.limits.sessions}
              /month
            </div>
            <div>Storage: {plan.limits.storage}</div>
          </div>
        </div>

        {!isCurrentPlan && (
          <Button
            className="w-full"
            variant={isPro ? "default" : "outline"}
            onClick={() => onUpgrade(plan.id)}
            disabled={loading || plan.id === "free"}
          >
            {loading ? "Processing..." : "Upgrade to " + plan.name}
          </Button>
        )}

        {isCurrentPlan && plan.id !== "free" && (
          <Button variant="outline" className="w-full" disabled>
            <Check className="h-4 w-4 mr-2" />
            Current Plan
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const TrialStatus = () => {
  const { isOnTrial, trialDaysLeft, subscription } = useSubscription();

  if (!isOnTrial) return null;

  const progressValue = ((14 - trialDaysLeft) / 14) * 100;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Free Trial Status
        </CardTitle>
        <CardDescription>
          Your 14-day free trial is currently active
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Trial Progress</span>
              <span className="font-medium">
                {14 - trialDaysLeft} of 14 days used
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div>
              <p className="font-medium">{trialDaysLeft} days remaining</p>
              <p className="text-sm text-muted-foreground">
                Trial ends on{" "}
                {new Date(subscription?.trialEnd || "").toLocaleDateString()}
              </p>
            </div>
            {trialDaysLeft <= 3 && (
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            )}
          </div>

          {trialDaysLeft <= 7 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Action needed:</strong> Your trial will end soon. Choose
                a plan to continue using FitClient.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const BillingHistory = () => {
  // Mock billing history - in real app, fetch from Stripe/backend
  const billingHistory = [
    {
      id: "inv_001",
      date: "2024-01-15",
      amount: 29,
      status: "paid",
      description: "Professional Plan - January 2024",
    },
    {
      id: "inv_002",
      date: "2023-12-15",
      amount: 29,
      status: "paid",
      description: "Professional Plan - December 2023",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Billing History
        </CardTitle>
        <CardDescription>View your past invoices and payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {billingHistory.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">{invoice.description}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(invoice.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(invoice.amount)}</p>
                <Badge className="bg-green-100 text-green-800">
                  {invoice.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const SubscriptionManager = () => {
  const { subscription, getCurrentPlan, isOnTrial, refreshSubscription } =
    useSubscription();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const currentPlan = getCurrentPlan();

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return;

    setSelectedPlanId(planId);
    setCheckoutModalOpen(true);
  };

  const handleCheckoutSuccess = () => {
    const planKey =
      selectedPlanId?.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS;
    const selectedPlan = SUBSCRIPTION_PLANS[planKey];

    toast({
      title: "Subscription updated!",
      description: `Successfully upgraded to ${selectedPlan?.name || selectedPlanId} plan.`,
    });
    refreshSubscription();
    setCheckoutModalOpen(false);
    setSelectedPlanId(null);
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.subscriptionId) return;

    setLoading(true);
    try {
      await cancelSubscription(subscription.subscriptionId);

      toast({
        title: "Subscription cancelled",
        description:
          "Your subscription has been cancelled. You'll continue to have access until the end of your billing period.",
      });

      setCancelDialogOpen(false);
      refreshSubscription();
    } catch (error) {
      toast({
        title: "Cancellation failed",
        description:
          "There was an error cancelling your subscription. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Trial Status */}
      <TrialStatus />

      {/* Current Plan Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>
            Manage your FitClient subscription and billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-semibold text-lg">{currentPlan.name} Plan</h3>
              <p className="text-muted-foreground">
                {currentPlan.price === 0
                  ? "Free forever"
                  : `$${currentPlan.price}/${currentPlan.interval}`}
              </p>
              {isOnTrial && (
                <Badge className="bg-blue-100 text-blue-800 mt-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  Free Trial Active
                </Badge>
              )}
            </div>

            {currentPlan.id !== "free" && (
              <Dialog
                open={cancelDialogOpen}
                onOpenChange={setCancelDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Cancel Subscription
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel your subscription? You'll
                      lose access to premium features at the end of your billing
                      period.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setCancelDialogOpen(false)}
                    >
                      Keep Subscription
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleCancelSubscription}
                      disabled={loading}
                    >
                      {loading ? "Cancelling..." : "Cancel Subscription"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={currentPlan.id === plan.id}
              onUpgrade={handleUpgrade}
              loading={loading}
            />
          ))}
        </div>
      </div>

      {/* Billing History */}
      {currentPlan.id !== "free" && <BillingHistory />}

      {/* Security & Trust */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Security & Trust
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium">Secure Payments</h4>
              <p className="text-sm text-muted-foreground">Powered by Stripe</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium">Cancel Anytime</h4>
              <p className="text-sm text-muted-foreground">
                No long-term contracts
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium">14-Day Free Trial</h4>
              <p className="text-sm text-muted-foreground">
                Try before you buy
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Checkout Modal */}
      {selectedPlanId && (
        <DemoCheckoutModal
          isOpen={checkoutModalOpen}
          onClose={() => {
            setCheckoutModalOpen(false);
            setSelectedPlanId(null);
          }}
          planId={selectedPlanId}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
};
