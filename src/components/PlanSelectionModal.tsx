import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap, Clock, Users, TrendingUp, X } from "lucide-react";
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
  selectedPlan = "pro",
}) => {
  const [plan, setPlan] = useState(selectedPlan);
  const [spotsRemaining, setSpotsRemaining] = useState(
    SUBSCRIPTION_PLANS.LIFETIME.limitedSpots ? 
    SUBSCRIPTION_PLANS.LIFETIME.limitedSpots - (SUBSCRIPTION_PLANS.LIFETIME.spotsTaken || 0) : 0
  );

  // Simulate dynamic spots counter (in real app, this would come from backend)
  useEffect(() => {
    if (!isOpen || !SUBSCRIPTION_PLANS.LIFETIME.urgency) return;
    
    const interval = setInterval(() => {
      if (Math.random() < 0.1 && spotsRemaining > 100) { // 10% chance every 30 seconds
        setSpotsRemaining(prev => prev - 1);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen, spotsRemaining]);

  if (!isOpen) return null;

  const handleContinue = () => {
    onPlanSelected(plan);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-2 sm:p-4">
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-5xl p-3 sm:p-6 max-h-[95vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-1"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <div className="text-center mb-4 sm:mb-8 pr-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Choose Your Plan</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Start with a 14-day free trial. No credit card required to begin.
          </p>
        </div>

        {/* Trial Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-blue-800">14-Day Free Trial</h3>
              <p className="text-xs sm:text-sm text-blue-700">
                Try any plan for free. Cancel anytime during your trial.
              </p>
            </div>
          </div>
        </div>

        {/* Lifetime Plan Urgency Banner */}
        {SUBSCRIPTION_PLANS.LIFETIME.urgency && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-red-800">⚡ Limited Time: Lifetime Access</h3>
                <p className="text-xs sm:text-sm text-red-700">
                  Only {spotsRemaining} lifetime spots remaining! Once sold out, this offer is gone forever.
                </p>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="text-lg sm:text-2xl font-bold text-red-600">{spotsRemaining}</div>
                <div className="text-xs text-red-600">spots left</div>
              </div>
            </div>
          </div>
        )}

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Starter Plan */}
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              plan === "starter" 
                ? "ring-2 ring-primary border-primary shadow-lg" 
                : "hover:shadow-md hover:border-primary/50"
            }`}
            onClick={() => setPlan("starter")}
          >
            <CardHeader className="text-center pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">{SUBSCRIPTION_PLANS.STARTER.name}</CardTitle>
              <div className="flex items-center justify-center gap-1">
                <span className="text-xl sm:text-2xl font-bold">{formatPrice(SUBSCRIPTION_PLANS.STARTER.price)}</span>
                <span className="text-muted-foreground text-xs sm:text-sm">/month</span>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                {SUBSCRIPTION_PLANS.STARTER.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-3 sm:p-6">
              <div className="space-y-1">
                {SUBSCRIPTION_PLANS.STARTER.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span className="leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <Badge variant="outline" className="w-full text-xs justify-center">
                  <Users className="h-3 w-3 mr-1" />
                  {SUBSCRIPTION_PLANS.STARTER.limits.clients} clients max
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Professional Plan */}
          <Card 
            className={`cursor-pointer transition-all duration-300 relative ${
              plan === "pro" 
                ? "ring-2 ring-primary border-primary shadow-lg" 
                : "hover:shadow-md hover:border-primary/50"
            }`}
            onClick={() => setPlan("pro")}
          >
            {SUBSCRIPTION_PLANS.PRO.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg">{SUBSCRIPTION_PLANS.PRO.name}</CardTitle>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold">{formatPrice(SUBSCRIPTION_PLANS.PRO.price)}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <CardDescription className="text-xs">
                {SUBSCRIPTION_PLANS.PRO.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                {SUBSCRIPTION_PLANS.PRO.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <Badge variant="outline" className="w-full text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {SUBSCRIPTION_PLANS.PRO.limits.clients} clients max
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Studio Plan */}
          <Card 
            className={`cursor-pointer transition-all duration-300 ${
              plan === "studio" 
                ? "ring-2 ring-primary border-primary shadow-lg" 
                : "hover:shadow-md hover:border-primary/50"
            }`}
            onClick={() => setPlan("studio")}
          >
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg">{SUBSCRIPTION_PLANS.STUDIO.name}</CardTitle>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold">{formatPrice(SUBSCRIPTION_PLANS.STUDIO.price)}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <CardDescription className="text-xs">
                {SUBSCRIPTION_PLANS.STUDIO.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                {SUBSCRIPTION_PLANS.STUDIO.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <Badge variant="outline" className="w-full text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Unlimited clients
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Lifetime Plan */}
          <Card 
            className={`cursor-pointer transition-all duration-300 relative ${
              plan === "lifetime" 
                ? "ring-2 ring-red-500 border-red-500 shadow-lg shadow-red-100" 
                : "hover:shadow-md hover:border-red-400 border-red-200"
            } ${SUBSCRIPTION_PLANS.LIFETIME.urgency ? "border-red-300" : ""}`}
            onClick={() => setPlan("lifetime")}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse">
                <Crown className="h-3 w-3 mr-1" />
                LIMITED
              </Badge>
            </div>
            <CardHeader className="text-center pb-3">
              <CardTitle className="text-lg">{SUBSCRIPTION_PLANS.LIFETIME.name}</CardTitle>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold">{formatPrice(SUBSCRIPTION_PLANS.LIFETIME.price)}</span>
                <span className="text-muted-foreground text-sm">one-time</span>
              </div>
              <CardDescription className="text-xs">
                {SUBSCRIPTION_PLANS.LIFETIME.description}
              </CardDescription>
              {SUBSCRIPTION_PLANS.LIFETIME.urgency && (
                <div className="text-xs text-red-600 font-medium">
                  {spotsRemaining} spots left!
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                {SUBSCRIPTION_PLANS.LIFETIME.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <Badge variant="outline" className="w-full text-xs border-red-200 text-red-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Pay once, own forever
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Competitive Advantage Banner */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-2 text-green-800">💪 Why FitClients Beats the Competition</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-green-700">Trainerize</div>
              <div className="text-xs text-muted-foreground">30 clients for $70/month</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-700">FitClients Pro</div>
              <div className="text-xs text-green-600">100 clients for $49/month</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-700">Better Value</div>
              <div className="text-xs text-green-600">3x more clients, 30% less cost</div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-2">What's Included</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <ul className="space-y-1">
              <li>• 14-day free trial on all monthly plans</li>
              <li>• No credit card required to start</li>
              <li>• Cancel anytime during trial</li>
              <li>• Upgrade or downgrade anytime</li>
            </ul>
            <ul className="space-y-1">
              <li>• AI-powered session analysis</li>
              <li>• No-login client portals</li>
              <li>• Custom business branding</li>
              <li>• Mobile apps for you and clients</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-0">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleContinue}
            className={`w-full sm:w-auto order-1 sm:order-2 ${plan === "lifetime" ? "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600" : ""}`}
          >
            {plan === "lifetime" ? "🔥 Claim Lifetime Spot" : "Continue with " + SUBSCRIPTION_PLANS[plan.toUpperCase() as keyof typeof SUBSCRIPTION_PLANS]?.name}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionModal; 