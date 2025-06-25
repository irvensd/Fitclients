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
import { Zap, ArrowLeft, Check, X, Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isFirebaseConfigured } from "@/lib/firebase";

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

  const { login, register, user, isDevMode, authError, clearError } = useAuth();

  // Get referral code from URL parameters
  useEffect(() => {
    const refParam = searchParams.get("ref");
    if (refParam) {
      setReferralCode(refParam);
      // If there's a referral code, switch to register mode
      if (mode === "login") {
        setMode("register");
      }
    }
  }, [searchParams, mode]);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, firstName, lastName, referralCode);
      }
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">FitClient</span>
          </div>
          <h1 className="text-2xl font-bold">
            {mode === "login" ? "Trainer Login" : mode === "register" ? "Create Trainer Account" : "Reset Password"}
          </h1>
          <p className="text-muted-foreground">
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

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="p-4">
            <div className="text-2xl font-bold text-primary">24/7</div>
            <p className="text-sm text-muted-foreground">Access Anywhere</p>
          </div>
          <div className="p-4">
            <div className="text-2xl font-bold text-primary">5min</div>
            <p className="text-sm text-muted-foreground">Quick Setup</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
