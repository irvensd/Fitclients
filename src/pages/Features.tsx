import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Brain,
  Sparkles,
  Users,
  Calendar,
  TrendingUp,
  Share2,
  Trophy,
  Zap,
  Target,
  CreditCard,
  BarChart3,
  Clock,
  Shield,
  Smartphone,
  CheckCircle,
  Star,
  Activity,
  Bell,
  FileText,
  Camera,
  Link,
  Award,
  MessageSquare,
  Dumbbell,
  Scale,
  Gift,
} from "lucide-react";
import { NavigationButton } from "@/components/NavigationButton";

const Features = () => {
  const aiFeatures = [
    {
      icon: Brain,
      title: "Smart Recommendations",
      description:
        "AI-powered insights that analyze client progress, attendance, and performance to provide personalized training recommendations.",
      highlights: [
        "Performance analysis",
        "Progress trend detection",
        "Personalized action items",
        "Confidence scoring",
      ],
    },
    {
      icon: Sparkles,
      title: "Real-time Analysis",
      description:
        "Continuous monitoring of client data with instant notifications for high-priority recommendations.",
      highlights: [
        "Live data processing",
        "Priority alerts",
        "Automated insights",
        "Trend predictions",
      ],
    },
    {
      icon: Target,
      title: "Goal Optimization",
      description:
        "AI automatically adjusts training plans based on client progress toward specific fitness goals.",
      highlights: [
        "Goal tracking",
        "Adaptive planning",
        "Progress milestones",
        "Success prediction",
      ],
    },
  ];

  const coreFeatures = [
    {
      icon: Share2,
      title: "Client Portal (No Login)",
      description:
        "Shareable client portals that work instantly - no passwords or accounts required.",
      highlights: [
        "One-click sharing",
        "Secure unique links",
        "Mobile responsive",
        "Instant access",
      ],
      badge: "No Login Required",
    },
    {
      icon: Gift,
      title: "Referral Program",
      description:
        "Invite other trainers and both get a free month when they subscribe. Give a month, get a month!",
      highlights: [
        "Unique referral links",
        "Automatic rewards",
        "Track earnings",
        "Real-time stats",
      ],
      badge: "NEW",
    },
    {
      icon: Trophy,
      title: "Streak Tracker + Badges",
      description:
        "Gamification system with achievement badges, streaks, and milestone celebrations.",
      highlights: [
        "Session streaks",
        "Achievement badges",
        "Progress milestones",
        "Motivation rewards",
      ],
      badge: "Gamification",
    },
    {
      icon: Users,
      title: "Client Management",
      description:
        "Complete client profiles with goals, fitness levels, contact info, and progress history.",
      highlights: [
        "Detailed profiles",
        "Goal tracking",
        "Contact management",
        "Progress history",
      ],
    },
    {
      icon: Calendar,
      title: "Session Scheduling",
      description:
        "Smart scheduling system with cancellation management and session tracking.",
      highlights: [
        "Easy scheduling",
        "Cancellation handling",
        "Session history",
        "Recurring bookings",
      ],
    },
    {
      icon: TrendingUp,
      title: "Progress Monitoring",
      description:
        "Track weight, body measurements, progress photos, and fitness milestones.",
      highlights: [
        "Weight tracking",
        "Body measurements",
        "Progress photos",
        "Visual charts",
      ],
      badge: "Visual Charts",
    },
    {
      icon: CreditCard,
      title: "Payment Tracking",
      description:
        "Monitor payments, outstanding balances, and billing history for all clients.",
      highlights: [
        "Payment status",
        "Balance tracking",
        "Billing history",
        "Revenue analytics",
      ],
    },
    {
      icon: Dumbbell,
      title: "Workout Planning",
      description:
        "Create and manage personalized workout plans with exercise libraries and progression tracking.",
      highlights: [
        "Custom workouts",
        "Exercise library",
        "Progression tracking",
        "Plan templates",
      ],
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Comprehensive business analytics with revenue tracking, client growth, and performance metrics.",
      highlights: [
        "Revenue charts",
        "Client growth",
        "Session analytics",
        "Performance KPIs",
      ],
    },
    {
      icon: FileText,
      title: "Session Recaps",
      description:
        "AI-generated session summaries with personalized feedback and next-session recommendations.",
      highlights: [
        "AI summaries",
        "Personalized feedback",
        "Progress notes",
        "Action items",
      ],
      badge: "AI-Powered",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Intelligent alerts for cancellations, high-priority recommendations, and client milestones.",
      highlights: [
        "Priority alerts",
        "Milestone notifications",
        "Cancellation management",
        "Custom settings",
      ],
    },
  ];

  const technicalFeatures = [
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description:
        "Fully optimized for mobile devices with touch-friendly interfaces.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Client data protection with secure portals and privacy controls.",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description:
        "Instant synchronization across all devices and client portals.",
    },
    {
      icon: Link,
      title: "No Complex Setup",
      description:
        "Get started immediately - no complicated configuration required.",
    },
    {
      icon: Smartphone,
      title: "Native Mobile App",
      description:
        "Coming soon: Native iOS and Android apps with full feature access and offline capabilities.",
      badge: "Coming Soon",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            FitClient Features
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          The complete AI-Powered personal training management platform to deliver enhanced, innovative 
          client expereinces to help grow your business. 
        </p>
      </div>

      {/* AI Features Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            AI-Powered Intelligence
          </Badge>
          <h2 className="text-3xl font-bold">
            AI Coach - Your Smart Training Assistant
          </h2>
          <p className="text-muted-foreground">
            Revolutionary AI technology that analyzes client data to provide
            personalized recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {aiFeatures.map((feature, index) => (
            <Card
              key={index}
              className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-400 rounded-bl-3xl opacity-10"></div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <NavigationButton
            to="/ai-recommendations"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
          >
            <Brain className="h-4 w-4 mr-2" />
            Explore AI Coach Dashboard
          </NavigationButton>
        </div>
      </section>

      {/* Core Features */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Core Features</h2>
          <p className="text-muted-foreground">
            Everything you need to manage your personal training business
            effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  {feature.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technical Features */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Technical Excellence</h2>
          <p className="text-muted-foreground">
            Built with modern technology for reliability and performance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {technicalFeatures.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h3 className="font-semibold">{feature.title}</h3>
                      {feature.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="space-y-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Star className="h-5 w-5" />
              Why FitClient Stands Out
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">
                  🤖 AI-First Approach
                </h4>
                <p className="text-sm text-green-700">
                  The only fitness platform with built-in AI coach that learns
                  from your client data
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">
                  🔗 No-Login Client Portals
                </h4>
                <p className="text-sm text-green-700">
                  Share secure client portals instantly - no passwords or
                  accounts needed
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">
                  📱 Mobile-First Design
                </h4>
                <p className="text-sm text-green-700">
                  Fully responsive interface optimized for trainers on the go
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">
                  🎮 Gamification Built-In
                </h4>
                <p className="text-sm text-green-700">
                  Keep clients motivated with streaks, badges, and achievement
                  tracking
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">
                  ⚡ Real-Time Updates
                </h4>
                <p className="text-sm text-green-700">
                  Instant synchronization across all devices and client portals
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-green-800">
                  📊 Comprehensive Analytics
                </h4>
                <p className="text-sm text-green-700">
                  Track business performance with detailed revenue and client
                  metrics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 py-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">
            Ready to Transform Your Training Business?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join the future of personal training with AI-powered insights,
            seamless client management, and professional tools designed for
            modern fitness professionals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NavigationButton
            to="/ai-recommendations"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
          >
            <Brain className="h-4 w-4 mr-2" />
            Try AI Coach Now
          </NavigationButton>
          <NavigationButton to="/clients" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Manage Clients
          </NavigationButton>
          <NavigationButton to="/client-portals" variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Client Portals
          </NavigationButton>
        </div>
      </section>
    </div>
  );
};

export default Features;
