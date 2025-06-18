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
  ArrowLeft,
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
import { DemoCheckoutModal } from "@/components/DemoCheckoutModal";

// Mock payment methods - in real app, these would come from Stripe
const mockPaymentMethods = [
  {
    id: "pm_1",
    type: "card",
    card: {
      brand: "visa",
      last4: "4242",
      exp_month: 12,
      exp_year: 2027,
    },
    isDefault: true,
  },
  {
    id: "pm_2",
    type: "card",
    card: {
      brand: "mastercard",
      last4: "5555",
      exp_month: 8,
      exp_year: 2026,
    },
    isDefault: false,
  },
];

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
    <Card className={method.isDefault ? "ring-2 ring-primary" : ""}>
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
              <Badge className="bg-green-100 text-green-800">Default</Badge>
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
      // In real implementation, this would create a payment method with Stripe
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
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem
                      key={i + 1}
                      value={String(i + 1).padStart(2, "0")}
                    >
                      {String(i + 1).padStart(2, "0")}
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
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem
                      key={i}
                      value={String(new Date().getFullYear() + i)}
                    >
                      {new Date().getFullYear() + i}
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
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={loading}>
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
      invoiceUrl: "#",
    },
    {
      id: "inv_002",
      date: "2023-12-15",
      amount: 29,
      status: "paid",
      description: "Professional Plan - December 2023",
      invoiceUrl: "#",
    },
    {
      id: "inv_003",
      date: "2023-11-15",
      amount: 29,
      status: "paid",
      description: "Professional Plan - November 2023",
      invoiceUrl: "#",
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
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium">{formatPrice(invoice.amount)}</p>
                  <Badge className="bg-green-100 text-green-800">
                    {invoice.status}
                  </Badge>
                </div>
                <Button size="sm" variant="outline" className="h-8">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
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

  const currentPlan = getCurrentPlan();

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return;

    setSelectedPlanId(planId);
    setCheckoutModalOpen(true);
  };

  const handleCheckoutSuccess = () => {
    if (!selectedPlanId) return;

    // Actually update the subscription plan
    updateSubscriptionPlan(selectedPlanId);

    const planKey =
      selectedPlanId.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS;
    const selectedPlan = SUBSCRIPTION_PLANS[planKey];

    toast({
      title: "Subscription updated!",
      description: `Successfully upgraded to ${selectedPlan?.name || selectedPlanId} plan.`,
    });

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
    <div className="p-6 space-y-6">
      <DevModeNotice />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/settings")}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Billing & Payments
            </h1>
            <p className="text-muted-foreground">
              Manage your subscription, payment methods, and billing history.
            </p>
          </div>
        </div>
      </div>

      {/* Trial Status */}
      <TrialStatus />

      {/* Current Subscription */}
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

export default Billing;
