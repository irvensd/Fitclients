import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Zap,
  Check,
  Star,
  ArrowRight,
  Crown,
  Sparkles,
  Shield,
  Brain,
  Share2,
  Trophy,
  Target,
  BarChart3,
  Bell,
  Smartphone,
  Link as LinkIcon,
  Activity,
  Dumbbell,
  Scale,
  FileText,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">FitClient</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            Simple CRM for Personal Trainers
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Manage Your <span className="text-primary">Fitness Business</span>{" "}
            Effortlessly
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Everything you need to run your personal training business: client
            management, session scheduling, payment tracking, and progress
            monitoring - all in one simple platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => (window.location.href = "/login")}
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Designed specifically for independent personal trainers and
              fitness coaches who manage clients 1-on-1.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Client Management</h3>
                <p className="text-sm text-muted-foreground">
                  Add, edit, and track client goals, contact info, and fitness
                  levels
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Session Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  Calendar UI with session notes and automated email/text
                  reminders
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Payment Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Mark payments manually or integrate with Stripe for seamless
                  billing
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Log weight, measurements, and progress photos to keep clients
                  motivated
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Focus on Training, Not Admin Work
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Stop juggling spreadsheets, text messages, and sticky notes.
                FitClient puts everything in one organized, easy-to-use
                dashboard.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Save 5+ Hours Per Week</h4>
                    <p className="text-sm text-muted-foreground">
                      Streamlined workflows mean less time on admin tasks
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Never Miss a Payment</h4>
                    <p className="text-sm text-muted-foreground">
                      Track outstanding balances and payment history
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Keep Clients Engaged</h4>
                    <p className="text-sm text-muted-foreground">
                      Visual progress tracking motivates long-term success
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Today's Overview</h3>
                  <span className="text-sm text-muted-foreground">
                    March 15, 2024
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-sm text-muted-foreground">
                      Total Clients
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-2xl font-bold">6</div>
                    <div className="text-sm text-muted-foreground">
                      Sessions Today
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Sarah Johnson - 9:00 AM</span>
                    <span className="text-green-600">Completed</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Mike Chen - 2:00 PM</span>
                    <span className="text-blue-600">Upcoming</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              <DollarSign className="h-4 w-4" />
              Simple, Transparent Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free, then grow with plans designed for trainers at every
              stage of their business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="border-2 hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Starter</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Perfect for new trainers
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-bold">Free</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Forever</p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Up to 5 clients</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Basic session scheduling</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Payment tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Progress photos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Email support</span>
                  </div>
                </div>

                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Start Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Professional Plan - Most Popular */}
            <Card className="border-2 border-primary shadow-lg transform hover:scale-105 transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Most Popular
                </div>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Professional</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    For growing training businesses
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm text-muted-foreground">$</span>
                    <span className="text-3xl font-bold">29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Billed monthly
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Up to 50 clients</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      Advanced scheduling & calendar
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      Automated reminders (SMS/Email)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Client progress reports</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Workout plan builder</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Client portal links</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">
                      AI Session Recaps
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>

                <Link to="/login" className="block">
                  <Button className="w-full">Start 14-Day Free Trial</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-xl font-bold">Enterprise</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    For established fitness businesses
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm text-muted-foreground">$</span>
                    <span className="text-3xl font-bold">79</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Billed monthly
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Unlimited clients</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Multi-trainer management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      Advanced analytics & reporting
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">White-label client portals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">API access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">
                      Advanced AI features
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Custom integrations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">
                      Dedicated support
                    </span>
                  </div>
                </div>

                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Pricing FAQ/Features */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">14-Day Free Trial</h4>
                <p className="text-sm text-muted-foreground">
                  Try all Pro features risk-free. No credit card required.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Cancel Anytime</h4>
                <p className="text-sm text-muted-foreground">
                  No long-term contracts. Upgrade, downgrade, or cancel with one
                  click.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Data Migration</h4>
                <p className="text-sm text-muted-foreground">
                  Moving from another platform? We'll help migrate your data for
                  free.
                </p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-blue/10 rounded-lg border">
              <h4 className="font-semibold mb-2">Questions about pricing?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Need a custom plan or have specific requirements? We're here to
                help.
              </p>
              <Button variant="outline" size="sm">
                Contact Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Grow Your Fitness Business?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of personal trainers who have simplified their
            business operations with FitClient.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 text-primary"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <p className="text-sm mt-4 opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-bold">FitClient</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 FitClient. Simple CRM for Personal Trainers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
