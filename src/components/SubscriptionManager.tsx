import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
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
  Plus,
  Trash2,
  Download,
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  SUBSCRIPTION_PLANS,
  formatPrice,
  cancelSubscription,
} from "@/lib/stripe";
import { useToast } from "@/hooks/use-toast";
import { ClientSelectionModal } from "@/components/ClientSelectionModal";
import { useData } from "@/contexts/DataContext";
import {
  willDowngradeAffectClients,
  getDowngradeImpact,
} from "@/lib/clientDowngrade";
import { billingHistoryService } from "@/lib/firebaseService";
import { useAuth } from "@/contexts/AuthContext";
import { BillingHistory as BillingHistoryType } from "@/lib/types";

const PlanCard = ({
  plan,
  isCurrentPlan,
  onUpgrade,
  loading,
}: {
  plan: typeof SUBSCRIPTION_PLANS.STARTER;
  isCurrentPlan: boolean;
  onUpgrade: (planId: string) => void;
  loading: boolean;
}) => {
      const isPro = plan.id === "pro" || plan.id === "lifetime";
      const isLifetime = plan.id === "lifetime";

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
                      {isLifetime && <Crown className="h-6 w-6 text-yellow-600 mr-2" />}
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
            disabled={loading}
          >
            {loading ? "Processing..." : "Switch to " + plan.name}
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
  const { user } = useAuth();
  const [billingHistory, setBillingHistory] = useState<BillingHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = billingHistoryService.subscribeToBillingHistory(
      user.uid,
      (history) => {
        setBillingHistory(history);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading billing history:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
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
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (billingHistory.length === 0) {
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
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No billing history found</p>
            <p className="text-sm text-gray-400">Your billing history will appear here once you have active subscriptions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                {invoice.planName && (
                  <p className="text-xs text-muted-foreground">
                    Plan: {invoice.planName}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(invoice.amount)}</p>
                <Badge className={getStatusBadgeVariant(invoice.status)}>
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

export const SubscriptionManager = ({
  onDowngradeClients,
}: {
  onDowngradeClients?: (newLimit: number, selectedIds: string[]) => void;
}) => {
  const {
    subscription,
    getCurrentPlan,
    isOnTrial,
    refreshSubscription,
    updateSubscriptionPlan,
  } = useSubscription();
  const { clients, handlePlanDowngrade } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [clientSelectionOpen, setClientSelectionOpen] = useState(false);
  const [pendingDowngrade, setPendingDowngrade] = useState<{
    planId: string;
    newLimit: number;
    selectedIds: string[];
  } | null>(null);

  const currentPlan = getCurrentPlan();

  const handleUpgrade = async (planId: string) => {
    setSelectedPlanId(planId);
    setCheckoutModalOpen(true);
  };

  const handleCheckoutSuccess = () => {
    if (!selectedPlanId) return;

    // Actually update the subscription plan
    updateSubscriptionPlan(selectedPlanId, user?.uid, onDowngradeClients);

    const planKey =
      selectedPlanId.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS;
    const selectedPlan = SUBSCRIPTION_PLANS[planKey];
    const isUpgrade = selectedPlan.price > currentPlan.price;
    const isDowngrade = selectedPlan.price < currentPlan.price;

    toast({
      title: "Subscription updated!",
      description: isUpgrade
        ? `Successfully upgraded to ${selectedPlan?.name || selectedPlanId} plan.`
        : isDowngrade
        ? `Successfully downgraded to ${selectedPlan?.name || selectedPlanId} plan.`
        : `You are now on the ${selectedPlan?.name || selectedPlanId} plan.`,
    });

    setCheckoutModalOpen(false);
    setSelectedPlanId(null);
  };

  const handleDowngrade = (planId: string) => {
    const newPlan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId);
    if (!newPlan) return;

    const impact = getDowngradeImpact(clients, newPlan.limits.clients);
    
    if (impact.needsSelection) {
      setPendingDowngrade({
        planId,
        newLimit: newPlan.limits.clients,
        selectedIds: [],
      });
    } else {
      // No client impact, proceed with downgrade
      updateSubscriptionPlan(planId, user?.uid, onDowngradeClients);
      toast({
        title: "Subscription downgraded",
        description: `Successfully downgraded to ${newPlan.name} plan.`,
      });
    }
  };

  const handleConfirmDowngrade = () => {
    if (!pendingDowngrade) return;

    updateSubscriptionPlan(pendingDowngrade.planId, user?.uid, onDowngradeClients);
    
    const newPlan = Object.values(SUBSCRIPTION_PLANS).find(
      (p) => p.id === pendingDowngrade.planId,
    );

    toast({
      title: "Subscription downgraded",
      description: `Successfully downgraded to ${newPlan?.name || pendingDowngrade.planId} plan.`,
    });

    setPendingDowngrade(null);
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

  const handleDowngradeToStarter = () => {
    updateSubscriptionPlan("starter", user?.uid, onDowngradeClients);
    toast({
      title: "Downgraded to Starter Plan",
      description: "You've been downgraded to the Starter plan. Some features may be limited.",
    });
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

      {/* Client Selection Modal for Downgrades */}
      {pendingDowngrade && (
        <ClientSelectionModal
          isOpen={clientSelectionOpen}
          onClose={() => {
            setClientSelectionOpen(false);
            setPendingDowngrade(null);
          }}
          clients={clients.filter((c) => c.status.isActive)}
          newPlanName={pendingDowngrade.planId}
          newLimit={pendingDowngrade.newLimit}
          onConfirm={handleConfirmDowngrade}
        />
      )}
    </div>
  );
};
