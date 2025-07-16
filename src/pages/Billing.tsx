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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Settings,
  FileText,
  Users,
  Database,
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  SUBSCRIPTION_PLANS,
  formatPrice,
  createCheckoutSession,
  cancelSubscription,
} from "@/lib/stripe";
import { useToast } from "@/hooks/use-toast";
import { DevModeNotice } from "@/components/DevModeNotice";
import { useNavigate } from "react-router-dom";
import { billingHistoryService } from "@/lib/firebaseService";
import { useAuth } from "@/contexts/AuthContext";
import { BillingHistory as BillingHistoryType } from "@/lib/types";
import "@/lib/resetSubscription";

// Real payment methods will be loaded from Stripe
const mockPaymentMethods: any[] = [];

const PaymentMethodCard = ({
  method,
  onSetDefault,
  onDelete,
}: {
  method: (typeof mockPaymentMethods)[0];
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const getCardIcon = (brand: string) => {
    switch (brand) {
      case "visa":
        return "💳";
      case "mastercard":
        return "💳";
      case "amex":
        return "💳";
      default:
        return "💳";
    }
  };

  return (
    <Card className={`${method.isDefault ? "ring-2 ring-primary border-primary" : "hover:shadow-md"} transition-all duration-200`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getCardIcon(method.card.brand)}</div>
            <div>
              <p className="font-medium">
                {method.card.brand.toUpperCase()} ****{method.card.last4}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires {method.card.exp_month}/{method.card.exp_year}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {method.isDefault && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Default
              </Badge>
            )}
            <div className="flex gap-1">
              {!method.isDefault && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSetDefault(method.id)}
                >
                  Set Default
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(method.id)}
                disabled={method.isDefault}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AddPaymentMethodDialog = ({
  onAdd,
}: {
  onAdd: (method: any) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardData, setCardData] = useState({
    number: "",
    exp_month: "",
    exp_year: "",
    cvc: "",
    name: "",
  });

  const handleAdd = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newMethod = {
        id: `pm_${Date.now()}`,
        type: "card",
        card: {
          brand: "visa",
          last4: cardData.number.slice(-4),
          exp_month: parseInt(cardData.exp_month),
          exp_year: parseInt(cardData.exp_year),
        },
        isDefault: false,
      };

      onAdd(newMethod);
      setOpen(false);
      setCardData({
        number: "",
        exp_month: "",
        exp_year: "",
        cvc: "",
        name: "",
      });
    } catch (error) {
      console.error("Error adding payment method:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
          <DialogDescription>
            Add a new credit or debit card to your account
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input
              id="card-number"
              placeholder="1234 5678 9012 3456"
              value={cardData.number}
              onChange={(e) =>
                setCardData({ ...cardData, number: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardholder-name">Cardholder Name</Label>
            <Input
              id="cardholder-name"
              placeholder="John Doe"
              value={cardData.name}
              onChange={(e) =>
                setCardData({ ...cardData, name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exp-month">Month</Label>
              <Select
                value={cardData.exp_month}
                onValueChange={(value) =>
                  setCardData({ ...cardData, exp_month: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {month.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-year">Year</Label>
              <Select
                value={cardData.exp_year}
                onValueChange={(value) =>
                  setCardData({ ...cardData, exp_year: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="YYYY" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={cardData.cvc}
                onChange={(e) =>
                  setCardData({ ...cardData, cvc: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Card"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
  const isPro = plan.id === "pro";
  const isLifetime = plan.id === "lifetime";

  return (
    <Card
      className={`relative transition-all duration-300 ${
        isCurrentPlan 
          ? "ring-2 ring-green-500 shadow-lg bg-green-50 border-green-200" 
          : isPro 
            ? "ring-2 ring-primary shadow-lg" 
            : "hover:shadow-md"
      }`}
    >
      {isPro && !isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-white">
            <Star className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-green-600 text-white">
            <Check className="h-3 w-3 mr-1" />
            Current Plan
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
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

      <CardContent className="pt-0">
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
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Clients: {plan.limits.clients === -1 ? "Unlimited" : plan.limits.clients}
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Sessions: {plan.limits.sessions === -1 ? "Unlimited" : plan.limits.sessions}/month
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              Storage: {plan.limits.storage}
            </div>
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
          <Button variant="outline" className="w-full bg-green-100 border-green-300 text-green-800" disabled>
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

const BillingHistoryComponent = () => {
  const { user, isDemoUser } = useAuth();
  const [billingHistory, setBillingHistory] = useState<BillingHistoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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

  const handleAddSampleData = async () => {
    if (!user?.uid) return;

    try {
      await billingHistoryService.addSampleBillingHistory(user.uid);
      toast({
        title: "Sample data added",
        description: "Sample billing history has been added to your account.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add sample data.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Billing History
            </CardTitle>
            <CardDescription>
              View your past invoices and payments
            </CardDescription>
          </div>
          {(isDemoUser || user?.email === 'trainer@demo.com') && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddSampleData}
            >
              Add Sample Data
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading billing history...</p>
          </div>
        ) : billingHistory.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No billing history found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your invoices and payments will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {billingHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusBadgeVariant(item.status)}>
                    {item.status}
                  </Badge>
                  <p className="font-medium">{formatPrice(item.amount)}</p>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Billing = () => {
  const {
    subscription,
    getCurrentPlan,
    isOnTrial,
    refreshSubscription,
    updateSubscriptionPlan,
  } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const { user } = useAuth();

  const currentPlan = getCurrentPlan();

  const handleUpgrade = async (planId: string) => {
    if (planId === "starter") {
      updateSubscriptionPlan(planId, user?.uid);
      toast({
        title: "Switched to Starter Plan",
        description: "You've been switched to the Starter plan. Some features may be limited.",
      });
      return;
    }

    setSelectedPlanId(planId);
    setCheckoutModalOpen(true);
  };

  const handleCheckoutSuccess = async () => {
    if (!selectedPlanId) return;

    setLoading(true);
    try {
      // Update the subscription plan
      await updateSubscriptionPlan(selectedPlanId, user?.uid);

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

      // Refresh subscription data to reflect changes
      await refreshSubscription();
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setCheckoutModalOpen(false);
      setSelectedPlanId(null);
    }
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

  const handleSetDefaultPaymentMethod = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      })),
    );
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been updated successfully.",
    });
  };

  const handleDeletePaymentMethod = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.filter((method) => method.id !== methodId),
    );
    toast({
      title: "Payment method removed",
      description: "The payment method has been removed from your account.",
    });
  };

  const handleAddPaymentMethod = (newMethod: any) => {
    setPaymentMethods((prev) => [...prev, newMethod]);
    toast({
      title: "Payment method added",
      description: "Your new payment method has been added successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trial Status */}
          <TrialStatus />

          {/* Current Plan Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Crown className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {currentPlan.name} Plan
                    </h3>
                    <p className="text-muted-foreground">
                      {currentPlan.price === 0
                        ? "Free forever"
                        : `$${currentPlan.price}/${currentPlan.interval}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      currentPlan.id === "lifetime"
                        ? "default"
                        : currentPlan.id === "pro"
                          ? "secondary"
                          : "outline"
                    }
                    className={
                      currentPlan.id === "lifetime"
                        ? "bg-yellow-100 text-yellow-800"
                        : ""
                    }
                  >
                    {subscription?.status === "active"
                      ? "Active"
                      : subscription?.status || "Active"}
                  </Badge>
                  {isOnTrial && (
                    <Badge className="bg-blue-100 text-blue-800 mt-2 block">
                      <Calendar className="h-3 w-3 mr-1" />
                      Free Trial
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
                const isCurrent = currentPlan.id === plan.id;
                return (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isCurrentPlan={isCurrent}
                    onUpgrade={handleUpgrade}
                    loading={loading}
                  />
                );
              })}
            </div>
          </div>

          {/* Billing History */}
          <BillingHistoryComponent />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your credit cards and payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  onSetDefault={handleSetDefaultPaymentMethod}
                  onDelete={handleDeletePaymentMethod}
                />
              ))}
              <Separator />
              <AddPaymentMethodDialog onAdd={handleAddPaymentMethod} />
            </CardContent>
          </Card>

          {/* Subscription Management */}
          {currentPlan.id !== "free" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Subscription Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog
                  open={cancelDialogOpen}
                  onOpenChange={setCancelDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
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
              </CardContent>
            </Card>
          )}

          {/* Security & Trust */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Security & Trust
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Secure Payments</h4>
                    <p className="text-xs text-muted-foreground">Powered by Stripe</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Cancel Anytime</h4>
                    <p className="text-xs text-muted-foreground">No long-term contracts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">14-Day Free Trial</h4>
                    <p className="text-xs text-muted-foreground">Try before you buy</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      <Dialog open={checkoutModalOpen} onOpenChange={setCheckoutModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Upgrade Your Plan
            </DialogTitle>
            <DialogDescription>
              {selectedPlanId && (
                <>
                  You're about to upgrade to the{" "}
                  <span className="font-semibold">
                    {SUBSCRIPTION_PLANS[selectedPlanId.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS]?.name}
                  </span>{" "}
                  plan.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedPlanId && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Plan Details:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium">
                      {SUBSCRIPTION_PLANS[selectedPlanId.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS]?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span className="font-medium">
                      ${SUBSCRIPTION_PLANS[selectedPlanId.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS]?.price}
                      {SUBSCRIPTION_PLANS[selectedPlanId.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS]?.interval === "one-time" 
                        ? " (one-time)" 
                        : "/month"}
                    </span>
                  </div>
                  {isOnTrial && (
                    <div className="flex justify-between">
                      <span>Trial Status:</span>
                      <span className="font-medium text-green-600">Free Trial Active</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-1">Important:</p>
                  <p className="text-yellow-700">
                    {isOnTrial 
                      ? "You're currently on a free trial. No charges will be made until your trial ends."
                      : "This will update your subscription immediately."
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={handleCheckoutSuccess}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Upgrade"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCheckoutModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
