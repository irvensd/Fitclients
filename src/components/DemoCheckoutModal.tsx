import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, CreditCard, Shield, Lock } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/stripe";

interface DemoCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  onSuccess: () => void;
}

export const DemoCheckoutModal = ({
  isOpen,
  onClose,
  planId,
  onSuccess,
}: DemoCheckoutModalProps) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"payment" | "processing" | "success">(
    "payment",
  );

  const plan = Object.values(SUBSCRIPTION_PLANS).find((p) => p.id === planId);

  if (!plan) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep("processing");

    // Simulate payment processing
    setTimeout(() => {
      setStep("success");
      setLoading(false);
    }, 2000);
  };

  const handleSuccess = () => {
    onSuccess();
    onClose();
    setStep("payment"); // Reset for next time
  };

  if (step === "processing") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">
              Processing Payment...
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we set up your {plan.name} subscription.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === "success") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Welcome to the {plan.name} plan! Your subscription is now active.
            </p>
            <Button onClick={handleSuccess} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Secure Checkout - FitClient
          </DialogTitle>
          <DialogDescription>
            Complete your subscription to the {plan.name} plan
          </DialogDescription>
        </DialogHeader>

        {/* Order Summary */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{plan.name} Plan</span>
            <Badge>{plan.interval}ly billing</Badge>
          </div>
          <div className="space-y-2 text-sm">
            {plan.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span>
              ${plan.price}/{plan.interval}
            </span>
          </div>
        </div>

        {/* Demo Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="demo-email">Email</Label>
              <Input
                id="demo-email"
                type="email"
                defaultValue="demo@fitclient.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-card">Card Information</Label>
              <div className="relative">
                <Input
                  id="demo-card"
                  placeholder="4242 4242 4242 4242"
                  defaultValue="4242 4242 4242 4242"
                  required
                />
                <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="demo-exp">Expiry</Label>
                <Input
                  id="demo-exp"
                  placeholder="MM/YY"
                  defaultValue="12/28"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demo-cvc">CVC</Label>
                <Input
                  id="demo-cvc"
                  placeholder="123"
                  defaultValue="123"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="demo-name">Name on Card</Label>
              <Input id="demo-name" defaultValue="Demo User" required />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
            <Shield className="h-4 w-4 text-blue-600" />
            <span>
              This is a demo checkout. No real payment will be processed.
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading
                ? "Processing..."
                : `Subscribe for $${plan.price}/${plan.interval}`}
            </Button>
          </div>
        </form>

        {/* Powered by Stripe */}
        <div className="text-center text-xs text-muted-foreground">
          Powered by <span className="font-semibold">Stripe</span> (Demo Mode)
        </div>
      </DialogContent>
    </Dialog>
  );
};
