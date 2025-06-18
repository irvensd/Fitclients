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

      {/* AI-Powered Features Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Brain className="h-4 w-4" />
              AI-Powered Intelligence
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Coach Assistant
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The first fitness CRM with built-in AI that analyzes client data
              to provide personalized training recommendations and insights.
            </p>
          </div>

          {/* AI Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Smart Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  AI analyzes client progress, attendance, and performance to
                  suggest personalized training adjustments
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Goal Optimization</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically adapts training plans based on client progress
                  toward specific fitness goals
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Smart Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time notifications for high-priority recommendations and
                  client milestones
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Training Business Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage clients, track progress, and grow
              your personal training business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Client Portal - No Login */}
            <Card className="border-2 hover:border-primary/20 transition-colors group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Share2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    No Login Required
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Client Portal</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Shareable client portals that work instantly - no passwords or
                  accounts required
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    One-click sharing
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Secure unique links
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gamification */}
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Gamification
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Streak Tracker + Badges</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Keep clients motivated with achievement badges, streaks, and
                  milestone celebrations
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Session streaks
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Achievement badges
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Management */}
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Client Management</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete client profiles with goals, fitness levels, and
                  progress history
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Detailed profiles
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Goal tracking
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Scheduling */}
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Session Scheduling</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Smart scheduling with cancellation management and session
                  tracking
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Easy scheduling
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Cancellation handling
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Monitoring */}
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    Visual Charts
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Progress Monitoring</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Track weight, body measurements, progress photos, and fitness
                  milestones
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Weight tracking
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Body measurements
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Tracking */}
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Payment Tracking</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Monitor payments, outstanding balances, and billing history
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Payment status
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Revenue analytics
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workout Planning */}
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Workout Planning</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Create personalized workout plans with exercise libraries and
                  progression tracking
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Custom workouts
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Exercise library
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Dashboard */}
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Comprehensive business analytics with revenue tracking and
                  client growth
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Revenue charts
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Performance KPIs
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Recaps */}
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    AI-Powered
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Session Recaps</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  AI-generated session summaries with personalized feedback and
                  recommendations
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    AI summaries
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-green-600" />
                    Progress notes
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Technical Features */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">
              Built for Modern Trainers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Mobile Responsive</h4>
                <p className="text-sm text-muted-foreground">
                  Fully optimized for mobile devices
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Secure & Private</h4>
                <p className="text-sm text-muted-foreground">
                  Client data protection and privacy
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">Real-time Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Instant synchronization across devices
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <LinkIcon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-1">No Complex Setup</h4>
                <p className="text-sm text-muted-foreground">
                  Get started immediately
                </p>
              </div>
            </div>
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

            {/* Gold Plan */}
            <Card className="border-2 hover:border-primary/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-xl font-bold">Gold</h3>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm text-muted-foreground">$</span>
                      <span className="text-3xl font-bold">79</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Unlimited clients</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        Everything in Professional
                      </span>
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
                      <span className="text-sm">
                        White-label client portals
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        API access for integrations
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">
                        Advanced AI coaching
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">
                        Dedicated phone support
                      </span>
                    </div>
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
