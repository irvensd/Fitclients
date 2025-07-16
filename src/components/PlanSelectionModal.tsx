import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap } from "lucide-react";
import { SUBSCRIPTION_PLANS, formatPrice } from "@/lib/stripe";

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanSelected: (planId: string) => void;
  selectedPlan?: string;
}

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onClose,
  onPlanSelected,
  selectedPlan = "starter",
}) => {
  const [plan, setPlan] = useState(selectedPlan);

  if (!isOpen) return null;

  const handleContinue = () => {
    onPlanSelected(plan);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
          <p className="text-muted-foreground">
            Start with a 14-day free trial. No credit card required to begin.
          </p>
        </div>

        {/* Trial Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-800">14-Day Free Trial</h3>
              <p className="text-sm text-blue-700">
                Try any plan for free. Cancel anytime during your trial.
              </p>
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Starter Plan */}
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              plan === "starter" 
                ? "ring-2 ring-primary border-primary shadow-lg" 
                : "hover:shadow-md hover:border-primary/50"
            }`}
            onClick={() => setPlan("starter")}
          >
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Starter</CardTitle>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold">{formatPrice(SUBSCRIPTION_PLANS.STARTER.price)}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <CardDescription>
                Perfect for new trainers getting started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {SUBSCRIPTION_PLANS.STARTER.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    Up to {SUBSCRIPTION_PLANS.STARTER.limits.clients} clients
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card 
            className={`cursor-pointer transition-all duration-300 relative ${
              plan === "pro" 
                ? "ring-2 ring-primary border-primary shadow-lg" 
                : "hover:shadow-md hover:border-primary/50"
            }`}
            onClick={() => setPlan("pro")}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Pro</CardTitle>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold">{formatPrice(SUBSCRIPTION_PLANS.PRO.price)}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <CardDescription>
                For growing fitness businesses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {SUBSCRIPTION_PLANS.PRO.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    Unlimited clients
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lifetime Plan */}
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              plan === "lifetime" 
                ? "ring-2 ring-primary border-primary shadow-lg" 
                : "hover:shadow-md hover:border-primary/50"
            }`}
            onClick={() => setPlan("lifetime")}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Best Value
              </Badge>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Lifetime</CardTitle>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold">{formatPrice(SUBSCRIPTION_PLANS.LIFETIME.price)}</span>
                <span className="text-muted-foreground">one-time</span>
              </div>
              <CardDescription>
                Pay once, own forever
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {SUBSCRIPTION_PLANS.LIFETIME.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    Unlimited everything
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-2">Important Information</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• 14-day free trial on all plans</li>
            <li>• No credit card required to start your trial</li>
            <li>• Cancel anytime during your trial period</li>
            <li>• Upgrade or downgrade your plan at any time</li>
            <li>• All plans include full access to core features during trial</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleContinue}>
            Continue with {SUBSCRIPTION_PLANS[plan.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS]?.name} Plan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionModal; 