import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
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
  Gift,
  X,
  AlertTriangle,
  Clock,
  MessageSquare,
} from "lucide-react";
import AnimatedHero from "@/components/AnimatedHero";
import MotivationalElements from "@/components/MotivationalElements";
import ColorPsychology from "@/components/ColorPsychology";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/SEO";

const Landing = () => {
  // Scroll progress state
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const { user, logout } = useAuth();

  // Force logout in dev mode on landing page mount
  React.useEffect(() => {
    if (import.meta.env.DEV && user) {
      logout();
    }
    // eslint-disable-next-line
  }, []);

  // Update scroll progress
  React.useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "FitClient",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "description": "Simple CRM software for personal trainers. Manage clients, schedule sessions, track payments and monitor progress - all in one platform.",
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "0",
      "highPrice": "79",
      "priceCurrency": "USD",
      "offerCount": "3"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    },
    "featureList": [
      "Client Management",
      "Session Scheduling", 
      "Payment Tracking",
      "Progress Monitoring",
      "AI-Powered Recommendations",
      "Client Portal",
      "Workout Planning",
      "Analytics Dashboard"
    ]
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FitClient",
    "url": "https://fitclients-4c5f2.web.app",
    "logo": "https://fitclients-4c5f2.web.app/logo.png",
    "sameAs": [
      "https://twitter.com/fitclient",
      "https://facebook.com/fitclient",
      "https://linkedin.com/company/fitclient"
    ]
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is FitClient?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FitClient is a simple CRM software designed specifically for personal trainers. It helps manage clients, schedule sessions, track payments, monitor progress, and grow your fitness business - all in one platform."
        }
      },
      {
        "@type": "Question",
        "name": "How much does FitClient cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FitClient offers three plans: Starter ($9/month for up to 200 clients), Pro ($19/month for unlimited clients with advanced features), and Pro Lifetime ($199 one-time payment for unlimited clients forever). All plans include a 14-day free trial."
        }
      },
      {
        "@type": "Question",
        "name": "Do clients need to create accounts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No! FitClient's unique client portal feature allows you to share secure links with clients that work instantly - no passwords or account creation required."
        }
      },
      {
        "@type": "Question",
        "name": "Can I try FitClient before purchasing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! You can start with our Starter plan ($9/month) that supports up to 200 clients. For Pro and Pro Lifetime plans, we offer a 14-day free trial with no credit card required."
        }
      },
      {
        "@type": "Question",
        "name": "What makes FitClient different from other fitness software?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FitClient stands out with its AI-powered features including smart recommendations and session recaps, no-login client portals, gamification with streaks and badges, and a simple, intuitive interface designed specifically for personal trainers."
        }
      }
    ]
  };

  return (
    <div>
      <SEO
        title="FitClient - Simple CRM Software for Personal Trainers | Client Management Made Easy"
        description="Manage your personal training business effortlessly with FitClient CRM. Schedule sessions, track payments, monitor client progress, and grow your fitness business. Start free today!"
        keywords="personal trainer software, fitness CRM, client management software, personal training business, fitness business software, workout planning software, gym management, fitness client tracking, personal trainer app, fitness scheduling software"
        url="https://fitclients-4c5f2.web.app"
        image="https://fitclients-4c5f2.web.app/og-image.png"
        type="website"
      />
      <Helmet>
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        {/* Mobile Sticky CTA */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg p-3 sm:p-4 safe-bottom">
          <div className="flex gap-2 sm:gap-3">
            <Button 
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white text-sm sm:text-base"
              onClick={() => window.location.href = '/login?mode=register'}
            >
                Start Free Trial
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            <Button 
              variant="outline" 
              className="flex-1 text-sm sm:text-base"
              onClick={() => window.open('https://www.loom.com/share/5c5dbae5eced4f0caf3d5c48ea91ae58?sid=3785c9dd-f0e5-484d-abf4-cc4b2cee980f', '_blank')}
            >
                Watch Demo
              </Button>
          </div>
        </div>
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <nav className="container mx-auto px-4 h-16 flex items-center justify-between" aria-label="Main navigation">
            <Link to="/" className="flex items-center gap-2" aria-label="FitClient Home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground" aria-hidden="true">
                <Zap className="h-5 w-5" aria-label="FitClient Logo" />
              </div>
              <span className="text-xl font-bold">FitClient</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/login?mode=register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section id="demo" className="py-20 px-4 relative">
          <AnimatedHero />
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            {/* Demo Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-6 animate-pulse">
              <Zap className="h-4 w-4" />
              Now in Demo Mode - Try It Free
            </div>
            
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 px-2">
              Stop Losing Clients to <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">Poor Organization</span>
            </h1>
            
            {/* Subheadline with Problem-Solution */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto px-4">
              Struggling with scattered client info, missed payments, and chaotic scheduling? 
              <span className="font-semibold text-foreground"> FitClient organizes everything in one place</span> - 
              so you can focus on what matters: growing your fitness business.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-6 md:mb-8 text-xs sm:text-sm text-muted-foreground px-4">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <span>30-day guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                <span>5 min setup</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 md:mb-8 px-4">
              <Link to="/login?mode=register">
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Free Trial - No Credit Card
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <a
                href="https://www.loom.com/share/5c5dbae5eced4f0caf3d5c48ea91ae58?sid=3785c9dd-f0e5-484d-abf4-cc4b2cee980f"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base sm:text-lg px-6 sm:px-8 border-2 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300"
                >
                  Watch 2-Min Demo
                </Button>
              </a>
            </div>
            
            {/* Demo Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-3xl mx-auto px-4">
              <div className="text-center p-2 sm:p-3 md:p-0">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">Free</div>
                <div className="text-xs sm:text-sm text-muted-foreground">14-Day Trial</div>
              </div>
              <div className="text-center p-2 sm:p-3 md:p-0">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">No Setup</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Fees</div>
              </div>
              <div className="text-center p-2 sm:p-3 md:p-0">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">5 Min</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Setup Time</div>
              </div>
              <div className="text-center p-2 sm:p-3 md:p-0">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">$9</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Starting Price</div>
              </div>
            </div>
          </div>
        </section>

        {/* Email Capture Section */}


        {/* Most Common Pain Points Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                Common Pain Points
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
                The <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Biggest Challenges</span> Personal Trainers Face
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
                We've identified the most common pain points that hold personal trainers back from growing their business
              </p>
            </div>

            {/* Pain Points Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
              {/* Pain Point 1 */}
              <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-all">
                <CardContent className="p-4 sm:p-6">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 sm:mb-3 text-center text-sm sm:text-base">Time-Consuming Admin</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center">
                    Spending 15+ hours per week on scheduling, payments, and client communication instead of training
                  </p>
                </CardContent>
              </Card>

              {/* Pain Point 2 */}
              <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3 text-center">Missed Payments</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Losing thousands in revenue due to manual payment tracking and forgotten invoices
                  </p>
                </CardContent>
              </Card>

              {/* Pain Point 3 */}
              <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3 text-center">Client Retention</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Struggling to keep clients engaged and motivated between sessions
                  </p>
                </CardContent>
              </Card>

              {/* Pain Point 4 */}
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3 text-center">No Business Insights</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Flying blind without data on client progress, revenue trends, and business performance
                  </p>
                </CardContent>
              </Card>

              {/* Pain Point 5 */}
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-blue-500 to-green-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3 text-center">Poor Communication</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Endless back-and-forth emails and texts with clients about scheduling and updates
                  </p>
                </CardContent>
              </Card>

              {/* Pain Point 6 */}
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3 text-center">Limited Growth</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Hitting a ceiling on client capacity due to manual processes and lack of automation
                  </p>
                </CardContent>
              </Card>
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

        {/* Why Choose FitClient Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BarChart3 className="h-4 w-4" />
                Why Choose FitClient
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                FitClient vs <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Other Solutions</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See how FitClient stacks up against other fitness business management tools
              </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-4 font-semibold">Features</th>
                    <th className="text-center p-4 font-semibold bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-t-lg">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="h-5 w-5 text-green-600" />
                        FitClient
                      </div>
                    </th>
                    <th className="text-center p-4 font-semibold">Other CRM Tools</th>
                    <th className="text-center p-4 font-semibold">Spreadsheets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">AI-Powered Recommendations</td>
                    <td className="text-center p-4 bg-green-50">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">No-Login Client Portal</td>
                    <td className="text-center p-4 bg-green-50">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">Gamification & Streaks</td>
                    <td className="text-center p-4 bg-green-50">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">Free Forever Plan</td>
                    <td className="text-center p-4 bg-green-50">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    </td>
                    <td className="text-center p-4">
                      <Check className="h-5 w-5 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">Setup Time</td>
                    <td className="text-center p-4 bg-green-50">
                      <span className="text-green-600 font-semibold">5 minutes</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-muted-foreground">2-4 hours</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-muted-foreground">1-2 hours</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">Client Onboarding</td>
                    <td className="text-center p-4 bg-green-50">
                      <span className="text-green-600 font-semibold">Instant</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-muted-foreground">Account creation required</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-muted-foreground">Manual sharing</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium">Monthly Cost (5 clients)</td>
                    <td className="text-center p-4 bg-green-50">
                      <span className="text-green-600 font-semibold">$9</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-muted-foreground">$29-79</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-600 font-semibold">$0</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Comparison Cards */}
            <div className="md:hidden space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-800">FitClient</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">AI-Powered Recommendations</span>
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">No-Login Client Portal</span>
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Gamification & Streaks</span>
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Free Forever Plan</span>
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Setup Time</span>
                    <span className="text-green-600 font-semibold">5 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Monthly Cost (5 clients)</span>
                    <span className="text-green-600 font-semibold">$9</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Other CRM Tools</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">AI-Powered Recommendations</span>
                    <X className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">No-Login Client Portal</span>
                    <X className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Gamification & Streaks</span>
                    <X className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Free Forever Plan</span>
                    <X className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Setup Time</span>
                    <span className="text-muted-foreground">2-4 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Monthly Cost (5 clients)</span>
                    <span className="text-muted-foreground">$29-79</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Ready to see the difference?
              </p>
              <Link to="/login?mode=register">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Complete Training Business Solution Section */}
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
                  <h3 className="font-semibold mb-2">Client Portal - No Login Required</h3>
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

              {/* Referral Program */}
              <Card className="border-2 hover:border-primary/20 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-purple-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                  NEW
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <div className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
                      Referral Rewards
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Referral Program - "Give a Month, Get a Month"</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Invite other trainers and both get a free month when they subscribe
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-green-600" />
                      Unique referral links
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-green-600" />
                      Automatic rewards
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-green-600" />
                      Track earnings
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
                  <h3 className="font-semibold mb-2">Gamification - Streak Tracker & Achievement Badges</h3>
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
                  <h3 className="font-semibold mb-2">Client Management System</h3>
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
                  <h3 className="font-semibold mb-2">Session Scheduling & Calendar</h3>
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
                  <h3 className="font-semibold mb-2">Client Progress Monitoring & Analytics</h3>
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
                  <h3 className="font-semibold mb-2">Payment & Revenue Tracking</h3>
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
                      Outstanding balances
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
                  <h3 className="font-semibold mb-2">Workout Planning & Exercise Library</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Create and assign personalized workout plans with exercise
                    demonstrations
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
                  <h3 className="font-semibold mb-2">Business Analytics & Insights</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Track revenue, client retention, and business performance
                    metrics
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-green-600" />
                      Revenue tracking
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-green-600" />
                      Performance metrics
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Features */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-center mb-8">
                Plus Everything Else You Need
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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



        {/* Motivational Elements Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Trophy className="h-4 w-4" />
                Motivation & Achievement
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Celebrate Every <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Victory</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Transform your training business with motivational elements that inspire both you and your clients to achieve greatness.
              </p>
            </div>
            <MotivationalElements />
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
                      March 15, 2025
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

        {/* Referral Program Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Gift className="h-4 w-4" />
                Referral Program
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Invite Trainers,{" "}
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Earn Together
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Share FitClient with other trainers and both get a free month when they subscribe. 
                It's that simple - give a month, get a month!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">How the Referral Program Works</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Share Your Unique Link</h4>
                      <p className="text-muted-foreground">
                        Get your personalized referral link from your dashboard and share it with other trainers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">They Sign Up & Subscribe</h4>
                      <p className="text-muted-foreground">
                        When they use your link to create an account and subscribe to a paid plan
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Both Get Rewards</h4>
                      <p className="text-muted-foreground">
                        You both automatically get a free month added to your subscription
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white rounded-lg border border-pink-200">
                  <h4 className="font-semibold mb-3 text-center">Free Month Rewards</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">1 Month</div>
                      <div className="text-sm text-muted-foreground">Starter Plan</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">1 Month</div>
                      <div className="text-sm text-muted-foreground">Pro Plan</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">1 Month</div>
                      <div className="text-sm text-muted-foreground">Pro Lifetime Plan</div>
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Both trainers get 1 free month added to their subscription
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-200">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your Referral Dashboard</h3>
                  <p className="text-muted-foreground">
                    Track your referrals and earnings in real-time
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Total Referrals</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Completed</span>
                    <span className="font-semibold text-green-600">8</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm">Total Earnings</span>
                    <span className="font-semibold text-green-600">$156</span>
                  </div>
                </div>

                <div className="text-center">
                  <Link to="/login">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                      <Gift className="h-4 w-4 mr-2" />
                      Start Earning Rewards
                    </Button>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-2">
                    Sign up to get your referral link
                  </p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter Plan */}
              <Card className="border-2 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">Starter</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Perfect for growing trainers
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm text-muted-foreground">$</span>
                      <span className="text-3xl font-bold">9</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Billed monthly</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Manage up to 200 clients</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Session scheduling & calendar</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Payment tracking & invoicing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Progress tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Client portal links (no login)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Workout plan builder</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Session recaps</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Custom business branding</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Email support</span>
                    </div>
                  </div>

                  <Link to="/login" className="block">
                    <Button variant="outline" className="w-full">
                      Start 14-Day Free Trial
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Pro Plan - Most Popular */}
              <Card className="border-2 border-primary shadow-lg transform hover:scale-105 transition-all duration-300 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Most Popular
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">Pro</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      For growing coaches who need unlimited clients
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm text-muted-foreground">$</span>
                      <span className="text-3xl font-bold">19</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Billed monthly
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Everything in Starter, plus:</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Unlimited clients</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">AI-powered recommendations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Client progress stats & performance summaries</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Priority support</span>
                    </div>
                  </div>

                  <Link to="/login" className="block">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">Start 14-Day Free Trial</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Lifetime Plan */}
              <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-white hover:border-yellow-300 transition-all duration-300 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Limited Time
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">Pro Lifetime</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Get FitClient forever — one-time payment
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-sm text-muted-foreground">$</span>
                      <span className="text-3xl font-bold">149</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      One-time payment
                    </p>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      Save over $500 vs. monthly plans
                    </p>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Everything in Pro, forever</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">No monthly fees</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">All future updates included</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Lifetime support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Limited to first 100 trainers</span>
                    </div>
                  </div>

                  <Link to="/login" className="block">
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                      Get Lifetime Access
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-12">
              <p className="text-lg text-muted-foreground mb-4">
                💬 Not sure which plan is right for you?
              </p>
              <p className="text-muted-foreground">
                Start with a 14-day free trial – upgrade or cancel anytime. No credit card required.
              </p>
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



        {/* FAQ Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FileText className="h-4 w-4" />
                Frequently Asked Questions
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Know</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get answers to the most common questions about FitClient
              </p>
            </div>

            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">How much does FitClient cost?</h3>
                  <p className="text-muted-foreground">
                    FitClient offers two simple plans: <strong>Starter ($9/month for up to 200 clients)</strong> 
                    and Pro ($19/month for unlimited clients). Both plans include a 14-day free trial with no credit card required.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ Item 2 */}
              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Do my clients need to create accounts?</h3>
                  <p className="text-muted-foreground">
                    <strong>No!</strong> FitClient's unique client portal feature allows you to share secure links 
                    with clients that work instantly - no passwords or account creation required. Your clients 
                    can access their workouts, progress, and schedule directly through their personalized link.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ Item 3 */}
              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Can I try FitClient before purchasing?</h3>
                  <p className="text-muted-foreground">
                    <strong>Absolutely!</strong> Both Starter and Pro plans include a 14-day free trial with no credit card required. 
                    You can upgrade, downgrade, or cancel anytime.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ Item 4 */}
              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">What makes FitClient different from other fitness software?</h3>
                  <p className="text-muted-foreground">
                    FitClient stands out with its <strong>AI-powered features</strong> including smart recommendations 
                    and session recaps, <strong>no-login client portals</strong>, gamification with streaks and badges, 
                    and a simple, intuitive interface designed specifically for personal trainers.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ Item 5 */}
              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Is my data secure?</h3>
                  <p className="text-muted-foreground">
                    <strong>Yes!</strong> We take security seriously. FitClient is SOC 2 Type II compliant, 
                    uses 256-bit SSL encryption, and is PCI DSS compliant for payment processing. 
                    Your data is backed up daily and stored in secure, enterprise-grade data centers.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ Item 6 */}
              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">What if I'm not satisfied?</h3>
                  <p className="text-muted-foreground">
                    We offer a <strong>30-day money-back guarantee</strong>. If you're not completely satisfied 
                    within 30 days, we'll refund your subscription - no questions asked. We also provide 
                    free data migration from other platforms and dedicated support to ensure your success.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact CTA */}
            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-4">
                Still have questions? We're here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button variant="outline" size="lg">
                    Contact Our Team
                  </Button>
                </Link>
                <a
                  href="https://www.loom.com/share/5c5dbae5eced4f0caf3d5c48ea91ae58?sid=3785c9dd-f0e5-484d-abf4-cc4b2cee980f"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="shadow-lg">
                    Watch Demo
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>



        {/* Footer */}
        <footer className="border-t py-12 px-4">
          <div className="container mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground" aria-hidden="true">
                <Zap className="h-4 w-4" aria-label="FitClient Logo" />
              </div>
              <span className="font-bold">FitClient</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 FitClient. Simple CRM for Personal Trainers.
            </p>
            <nav className="mt-4" aria-label="Footer navigation">
              <ul className="flex flex-wrap justify-center gap-4 text-sm">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
                <li><a href="/sitemap.xml" className="text-muted-foreground hover:text-primary transition-colors">Sitemap</a></li>
              </ul>
            </nav>
          </div>
        </footer>
        {/* Floating Action Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
            scrollProgress > 20 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <ArrowRight className="h-5 w-5 rotate-[-90deg]" />
        </button>

        {/* Bottom spacing for mobile sticky CTA */}
        <div className="md:hidden h-20"></div>
      </div>
    </div>
  );
};

export default Landing;
