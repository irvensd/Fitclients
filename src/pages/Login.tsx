import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
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
import { Zap, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  const { login, register, user, isDevMode, authError, clearError } = useAuth();

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
        await register(email, password, displayName);
      }
    } catch (err: any) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    clearError();
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
            {mode === "login" ? "Trainer Login" : "Create Trainer Account"}
          </h1>
          <p className="text-muted-foreground">
            {mode === "login"
              ? "Access your personal training dashboard"
              : "Set up your FitClient trainer account"}
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "login" ? "Welcome Back" : "Create Your Account"}
            </CardTitle>
            <CardDescription>
              {mode === "login"
                ? "Sign in to manage your clients and sessions"
                : "Join FitClient and start managing your training business"}
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Your full name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
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
                  placeholder={mode === "register" ? "Min. 6 characters" : ""}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
            </form>

            {/* Development Mode / Demo Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              {isDevMode && (
                <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-xs">
                  🔧 <strong>Development Mode</strong> - Firebase not configured
                </div>
              )}
              <p className="text-sm font-medium mb-2">
                {isDevMode ? "Development Login:" : "Demo Credentials:"}
              </p>
              <p className="text-sm text-muted-foreground">
                Email: trainer@demo.com
                <br />
                Password: demo123
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => {
                  setEmail("trainer@demo.com");
                  setPassword("demo123");
                }}
              >
                {isDevMode ? "Use Dev Account" : "Use Demo Account"}
              </Button>
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
