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
} from "lucide-react";
import AnimatedHero from "@/components/AnimatedHero";
import MotivationalElements from "@/components/MotivationalElements";
import ColorPsychology from "@/components/ColorPsychology";

const Landing = () => {
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
          "text": "FitClient offers three plans: Starter (Free forever for up to 5 clients), Professional ($29/month for up to 50 clients with advanced features), and Gold ($79/month for unlimited clients with enterprise features). All paid plans include a 14-day free trial."
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
          "text": "Yes! You can start with our free Starter plan that supports up to 5 clients forever. For Professional and Gold plans, we offer a 14-day free trial with no credit card required."
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
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>FitClient - Simple CRM Software for Personal Trainers | Client Management Made Easy</title>
        <meta name="title" content="FitClient - Simple CRM Software for Personal Trainers | Client Management Made Easy" />
        <meta name="description" content="Manage your personal training business effortlessly with FitClient CRM. Schedule sessions, track payments, monitor client progress, and grow your fitness business. Start free today!" />
        <meta name="keywords" content="personal trainer software, fitness CRM, client management software, personal training business, fitness business software, workout planning software, gym management, fitness client tracking, personal trainer app, fitness scheduling software" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="FitClient" />
        <link rel="canonical" href="https://fitclients-4c5f2.web.app" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fitclients-4c5f2.web.app/" />
        <meta property="og:title" content="FitClient - Simple CRM Software for Personal Trainers" />
        <meta property="og:description" content="Everything you need to run your personal training business: client management, session scheduling, payment tracking, and progress monitoring." />
        <meta property="og:image" content="https://fitclients-4c5f2.web.app/og-image.png" />
        <meta property="og:site_name" content="FitClient" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fitclients-4c5f2.web.app/" />
        <meta property="twitter:title" content="FitClient - Simple CRM Software for Personal Trainers" />
        <meta property="twitter:description" content="Everything you need to run your personal training business: client management, session scheduling, payment tracking, and progress monitoring." />
        <meta property="twitter:image" content="https://fitclients-4c5f2.web.app/twitter-image.png" />

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
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section id="demo" className="py-20 px-4 relative">
          <AnimatedHero />
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-6 animate-pulse">
              <Star className="h-4 w-4" />
              Trusted by 1,000+ Personal Trainers
            </div>
            
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Stop Losing Clients to <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">Poor Organization</span>
            </h1>
            
            {/* Subheadline with Problem-Solution */}
            <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
              Struggling with scattered client info, missed payments, and chaotic scheduling? 
              <span className="font-semibold text-foreground"> FitClient organizes everything in one place</span> - 
              so you can focus on what matters: growing your fitness business.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>Free forever for 5 clients</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span>Set up in 5 minutes</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/login">
                <Button size="lg" className="text-lg px-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Free Trial - No Credit Card
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a
                href="https://app.storylane.io/share/dvcmg9nwour6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-2 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent transition-all duration-300"
                >
                  Watch 2-Min Demo
                </Button>
              </a>
            </div>
            
            {/* Social Proof Numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1,000+</div>
                <div className="text-sm text-muted-foreground">Active Trainers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50,000+</div>
                <div className="text-sm text-muted-foreground">Clients Managed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10+ hrs</div>
                <div className="text-sm text-muted-foreground">Saved Per Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof & Testimonials Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="h-4 w-4" />
                Trusted by Personal Trainers Worldwide
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See What <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Real Trainers</span> Are Saying
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join hundreds of personal trainers who have transformed their business with FitClient
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Testimonial 1 */}
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    "FitClient saved me 15 hours a week on admin work. My clients love the portal - no more back-and-forth emails. My business has grown 40% since switching!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      SM
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Sarah Martinez</div>
                      <div className="text-xs text-muted-foreground">Personal Trainer, Miami</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    "The AI recommendations are game-changing. My clients are hitting their goals faster, and I'm making more money. Best investment I've made for my business."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      MJ
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Mike Johnson</div>
                      <div className="text-xs text-muted-foreground">Fitness Coach, NYC</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    "Setup took 5 minutes, and my clients were using the portal the same day. The payment tracking alone has saved me thousands in missed payments."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      LC
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Lisa Chen</div>
                      <div className="text-xs text-muted-foreground">Wellness Coach, LA</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trust Indicators */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Join 1,000+ trainers who trust FitClient with their business
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">256-bit SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium">99.9% Uptime</span>
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

        {/* Problem-Solution Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Activity className="h-4 w-4" />
                Common Pain Points
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tired of <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Losing Money</span> to Poor Organization?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Most personal trainers struggle with these common problems. FitClient solves them all.
              </p>
            </div>

            {/* Problems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* Problem 1 */}
              <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Chaotic Scheduling</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Double-booked sessions, missed appointments, and endless back-and-forth emails with clients trying to reschedule.
                  </p>
                  <div className="text-sm text-red-600 font-medium">
                    ❌ Losing $500+ monthly in missed sessions
                  </div>
                </CardContent>
              </Card>

              {/* Problem 2 */}
              <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Missed Payments</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Forgetting to invoice clients, lost payment records, and chasing down late payments takes hours every week.
                  </p>
                  <div className="text-sm text-red-600 font-medium">
                    ❌ 15% of revenue lost to payment issues
                  </div>
                </CardContent>
              </Card>

              {/* Problem 3 */}
              <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg">Client Dropout</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Clients lose motivation when they can't track progress or feel disconnected from their fitness journey.
                  </p>
                  <div className="text-sm text-red-600 font-medium">
                    ❌ 30% client retention rate
                  </div>
                </CardContent>
              </Card>

              {/* Problem 4 */}
              <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg">No Business Growth</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Spending all your time on admin work instead of growing your business and taking on more clients.
                  </p>
                  <div className="text-sm text-red-600 font-medium">
                    ❌ Stuck at same income level
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Solution Introduction */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Check className="h-4 w-4" />
                FitClient Solution
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Everything Organized in <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">One Simple Platform</span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stop losing money and start growing your fitness business with the complete solution.
              </p>
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
                  <h3 className="font-semibold mb-2">Personalized Workout Planning</h3>
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
                  <h3 className="font-semibold mb-2">Business Analytics Dashboard</h3>
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
                  <h3 className="font-semibold mb-2">AI-Powered Session Recaps</h3>
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

              {/* Mobile App - Coming Soon */}
              <Card className="border-2 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-primary" />
                    </div>
                    <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      Coming Soon
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2">Mobile App (Coming Soon)</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Native mobile app for iOS and Android with full feature access
                    and offline capabilities
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-green-600" />
                      iOS & Android
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-green-600" />
                      Offline support
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

        {/* Color Psychology Section (after Core Features) */}
        <section className="py-20 px-4 bg-gradient-to-br from-orange-50 to-purple-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                Color Psychology
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Colors That <span className="bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">Motivate</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Harness the power of color psychology to create an inspiring and motivating experience for your fitness business.
              </p>
            </div>
            <ColorPsychology />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Star className="h-4 w-4" />
                Trusted by Personal Trainers
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Real Results from Real Trainers
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how FitClient is helping personal trainers transform their business operations and client relationships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 - Focus on Time Saving */}
              <Card className="border-2 hover:border-primary/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "FitClient has given me back 10+ hours every week. The automated scheduling and payment tracking means I can focus on what I do best - training my clients. The gamification features keep my clients more engaged than ever!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                      SM
                    </div>
                    <div>
                      <p className="font-semibold">Sarah Mitchell</p>
                      <p className="text-sm text-muted-foreground">Personal Trainer, NYC</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 2 - Focus on Client Portals */}
              <Card className="border-2 hover:border-primary/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "The no-login client portal is a game-changer! My older clients love how easy it is to track their progress without remembering passwords. It's professional, simple, and my retention rate has improved by 30%."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                      JR
                    </div>
                    <div>
                      <p className="font-semibold">James Rodriguez</p>
                      <p className="text-sm text-muted-foreground">Fitness Coach, Miami</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 3 - Focus on Business Growth */}
              <Card className="border-2 hover:border-primary/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "Since switching to FitClient, I've doubled my client base. The professional image it gives my business and the AI recommendations help me provide personalized service at scale. Worth every penny!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                      ET
                    </div>
                    <div>
                      <p className="font-semibold">Emma Thompson</p>
                      <p className="text-sm text-muted-foreground">Online PT, Los Angeles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional testimonials row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* Testimonial 4 - Focus on AI Features */}
              <Card className="border-2 hover:border-primary/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "The AI-powered session recaps save me 30 minutes after each session. My clients love receiving personalized summaries, and the smart recommendations help me adjust their programs perfectly. It's like having an assistant!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                      MK
                    </div>
                    <div>
                      <p className="font-semibold">Marcus King</p>
                      <p className="text-sm text-muted-foreground">Strength Coach, Chicago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 5 - Focus on Payment Tracking */}
              <Card className="border-2 hover:border-primary/20 transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "Managing payments used to be my biggest headache. FitClient makes it crystal clear who's paid and who hasn't. The revenue analytics help me make better business decisions. I've increased my income by 40% this year!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                      AL
                    </div>
                    <div>
                      <p className="font-semibold">Amanda Liu</p>
                      <p className="text-sm text-muted-foreground">Boutique Trainer, Boston</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <p className="text-sm text-muted-foreground mt-1">Active Trainers</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">15,000+</div>
                  <p className="text-sm text-muted-foreground mt-1">Clients Managed</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">4.8/5</div>
                  <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <p className="text-sm text-muted-foreground mt-1">Would Recommend</p>
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
                  <h4 className="font-semibold mb-3 text-center">Reward Structure</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">$29</div>
                      <div className="text-sm text-muted-foreground">Professional Plan</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">$79</div>
                      <div className="text-sm text-muted-foreground">Gold Plan</div>
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Both trainers get credit equal to one month of the subscribed plan
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
                    <span className="font-semibold text-green-600">$232</span>
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

                  <Link to="/login" className="block mt-6">
                    <Button variant="outline" className="w-full">
                      Start 14-Day Free Trial
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
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Limited Time: Free Forever Plan Available
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Stop Losing Money to <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Poor Organization</span>
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join 1,000+ trainers who've saved 10+ hours per week and grown their business by 40% with FitClient.
            </p>
            
            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-8 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-300" />
                <span>Free forever for 5 clients</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-300" />
                <span>30-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-300" />
                <span>Set up in 5 minutes</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 text-primary bg-white hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free Trial - No Credit Card
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a
                href="https://app.storylane.io/share/dvcmg9nwour6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-2 border-white/30 text-white hover:bg-white hover:text-primary transition-all duration-300"
                >
                  Watch 2-Min Demo
                </Button>
              </a>
            </div>
            
            {/* Urgency & Trust */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">5,000+</div>
                <div className="text-sm opacity-90">Active Trainers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">$2M+</div>
                <div className="text-sm opacity-90">Revenue Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">4.9★</div>
                <div className="text-sm opacity-90">Average Rating</div>
              </div>
            </div>
            
            <p className="text-sm opacity-75">
              ⚡ No credit card required • 🛡️ 30-day guarantee • ⏰ Cancel anytime • 🚀 Set up in 5 minutes
            </p>
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
      </div>
    </>
  );
};

export default Landing;
