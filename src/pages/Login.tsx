import { useState, useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowLeft, Check, X, Gift, Users, Calendar, DollarSign, Star, Shield, Sparkles, Target, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isFirebaseConfigured } from "@/lib/firebase";
import PlanSelectionModal from "@/components/PlanSelectionModal";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [searchParams] = useSearchParams();
  const [referralCode, setReferralCode] = useState("");
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("starter");

  const { login, register, user, isDevMode, authError, clearError } = useAuth();

  // Get referral code and mode from URL parameters
  useEffect(() => {
    const refParam = searchParams.get("ref");
    const modeParam = searchParams.get("mode");
    
    if (refParam) {
      setReferralCode(refParam);
    }
    
    if (modeParam === "register") {
      setMode("register");
    }
  }, [searchParams]);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        // For registration, show plan selection first
        setShowPlanSelection(true);
        setLoading(false);
        return;
      }
    } catch (err: any) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelected = async (planId: string) => {
    setSelectedPlan(planId);
    setLoading(true);
    clearError();

    try {
      await register(email, password, firstName, lastName, referralCode, planId);
    } catch (err: any) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      // Handle error - email required
      return;
    }
    
    setResetLoading(true);
    try {
      // For demo purposes, we'll simulate sending a reset email
      // In a real implementation, this would call Firebase Auth's sendPasswordResetEmail
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResetEmailSent(true);
    } catch (error) {
      console.error("Password reset error:", error);
    } finally {
      setResetLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    Object.values(checks).forEach(check => {
      if (check) score += 20;
    });

    return {
      score: Math.min(score, 100),
      checks,
      level: score < 40 ? 'weak' : score < 80 ? 'medium' : 'strong'
    };
  };

  const passwordStrength = mode === "register" ? getPasswordStrength(password) : null;

  const switchMode = () => {
    if (mode === "login") {
      setMode("register");
    } else if (mode === "register") {
      setMode("login");
    } else {
      setMode("login");
    }
    clearError();
    setResetEmailSent(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section with Value Proposition */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white py-6 sm:py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Zap className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold">FitClient</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Stop Losing Clients to <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Poor Organization</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-4 sm:mb-6 max-w-3xl mx-auto px-2">
              Built for personal trainers. Track sessions, clients, and payments in one place.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-300" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-300" />
                <span>30-day guarantee</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-300" />
                <span>5 min setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          
          {/* Left Column - Login Form */}
          <div className="w-full max-w-md mx-auto order-2 lg:order-1">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 sm:mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
              <h2 className="text-xl sm:text-2xl font-bold">
                {mode === "login" ? "Trainer Login" : mode === "register" ? "Create Trainer Account" : "Reset Password"}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {mode === "login"
                  ? "Access your personal training dashboard"
                  : mode === "register"
                  ? "Set up your FitClient trainer account"
                  : "Enter your email to receive a password reset link"}
              </p>
            </div>

            {/* Login Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {mode === "login" ? "Welcome Back" : mode === "register" ? "Create Your Account" : "Reset Your Password"}
                </CardTitle>
                <CardDescription>
                  {mode === "login"
                    ? "Sign in to manage your clients and sessions"
                    : mode === "register"
                    ? "Join FitClient and start managing your training business"
                    : "We'll send you a link to reset your password"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mode === "reset" ? (
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    {resetEmailSent ? (
                      <div className="text-center space-y-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h3 className="font-semibold text-green-800 mb-2">Email Sent!</h3>
                          <p className="text-sm text-green-700">
                            We've sent a password reset link to <strong>{email}</strong>. 
                            Check your email and click the link to reset your password.
                          </p>
                        </div>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setMode("login")}
                          className="w-full"
                        >
                          Back to Login
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">Email Address</Label>
                          <Input
                            id="reset-email"
                            type="email"
                            placeholder="trainer@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={resetLoading || !email}
                        >
                          {resetLoading ? "Sending Reset Link..." : "Send Reset Link"}
                        </Button>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => setMode("login")}
                            className="text-sm text-primary hover:underline"
                          >
                            Back to Login
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {authError && (
                    <Alert variant="destructive">
                      <AlertDescription>{authError}</AlertDescription>
                    </Alert>
                  )}

                  {!isFirebaseConfigured && mode === "register" && (
                    <Alert>
                      <AlertDescription>
                        🔧 Account creation requires Firebase configuration. Contact
                        support for assistance.
                      </AlertDescription>
                    </Alert>
                  )}

                  {mode === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {mode === "register" && (
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {mode === "register" && referralCode && (
                    <div className="space-y-2">
                      <Label htmlFor="referralCode">Referral Code</Label>
                      <div className="relative">
                        <Input
                          id="referralCode"
                          type="text"
                          placeholder="Referral code"
                          value={referralCode}
                          onChange={(e) => setReferralCode(e.target.value)}
                          className="pr-10"
                        />
                        <Gift className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-xs text-green-600">
                        🎉 You'll both get a free month when you subscribe!
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="trainer@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={mode === "register" ? "Min. 8 characters" : ""}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    
                    {mode === "register" && password && passwordStrength && (
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Password strength:</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength.level === 'weak' ? 'text-red-600' :
                            passwordStrength.level === 'medium' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}
                          </span>
                        </div>
                        <Progress 
                          value={passwordStrength.score} 
                          className={`h-2 ${
                            passwordStrength.level === 'weak' ? '[&>div]:bg-red-500' :
                            passwordStrength.level === 'medium' ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'
                          }`}
                        />
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordStrength.checks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            8+ characters
                          </div>
                          <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordStrength.checks.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            Lowercase
                          </div>
                          <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordStrength.checks.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            Uppercase
                          </div>
                          <div className={`flex items-center gap-1 ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-400'}`}>
                            {passwordStrength.checks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            Number
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      loading || (!isFirebaseConfigured && mode === "register")
                    }
                  >
                    {loading
                      ? mode === "login"
                        ? "Signing in..."
                        : "Creating account..."
                      : mode === "login"
                        ? "Sign In"
                        : "Create Account"}
                  </Button>

                  {mode === "login" && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setMode("reset")}
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  )}
                </form>
                )}

                {/* Demo Credentials - Always Available */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-medium text-blue-800">
                      Demo Account Always Available
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Try FitClient instantly with our demo account:
                  </p>
                  <div className="bg-white p-3 rounded border text-sm font-mono">
                    <div>Email: trainer@demo.com</div>
                    <div>Password: demo123</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                    onClick={() => {
                      setEmail("trainer@demo.com");
                      setPassword("demo123");
                    }}
                  >
                    🚀 Use Demo Account
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Works regardless of Firebase configuration
                  </p>
                </div>

                {/* Mode Switching */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {mode === "login"
                      ? "Don't have an account? "
                      : "Already have an account? "}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="text-primary hover:underline font-medium"
                    >
                      {mode === "login" ? "Create one here" : "Sign in instead"}
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Features Preview */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Why FitClient?</h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                <li className="flex items-start">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <span>Seamless client management</span>
                </li>
                <li className="flex items-start">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <span>Clear, actionable goals</span>
                </li>
                <li className="flex items-start">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <span>Track sessions and progress</span>
                </li>
                <li className="flex items-start">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <span>Effortless payment processing</span>
                </li>
                <li className="flex items-start">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <span>Built-in client communication</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                  <span>Scalable and customizable</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Selection Modal */}
      <PlanSelectionModal
        isOpen={showPlanSelection}
        onClose={() => setShowPlanSelection(false)}
        onPlanSelected={handlePlanSelected}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default Login;
