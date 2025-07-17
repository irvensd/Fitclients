import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  Phone, 
  BookOpen, 
  Video, 
  FileText, 
  ExternalLink,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Users,
  CreditCard,
  Shield,
  Zap,
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
  RefreshCw,
  Wifi,
  WifiOff,
  Activity
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supportTicketsService } from "@/lib/firebaseService";
import { useToast } from "@/hooks/use-toast";

// Types for monitoring
interface ServiceStatus {
  id: string;
  name: string;
  status: "operational" | "degraded" | "outage" | "checking";
  description: string;
  icon: any;
  lastChecked: Date;
  responseTime?: number;
  uptime?: number;
  url?: string; // Optional - not used for external health checks
}

interface Incident {
  id: string;
  title: string;
  description: string;
  status: "investigating" | "identified" | "monitoring" | "resolved";
  severity: "minor" | "major" | "critical";
  createdAt: Date;
  updatedAt: Date;
  affectedServices: string[];
}

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set());
  const [resourceSearchQuery, setResourceSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("faq");
  
  // Monitoring state
  const [systemServices, setSystemServices] = useState<ServiceStatus[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [overallStatus, setOverallStatus] = useState<"operational" | "degraded" | "outage">("operational");
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const { user } = useAuth();
  const { toast } = useToast();

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I set up my FitClients account?",
          answer: "After signing up, complete your profile by adding your business information, certifications, and preferences. Then invite your first client to start using the platform. You can also explore the demo data to see how everything works."
        },
        {
          question: "What are the system requirements?",
          answer: "FitClients works on any modern web browser (Chrome, Firefox, Safari, Edge). For mobile access, use your browser's mobile view or download our mobile app. We recommend a stable internet connection for the best experience."
        },
        {
          question: "How do I import my existing client data?",
          answer: "You can import client data using our CSV import feature. Download the template from the Clients page, fill in your client information, and upload the file. Our system will guide you through the import process."
        }
      ]
    },
    {
      category: "Client Management",
      questions: [
    {
      question: "How do I add a new client?",
      answer: "Navigate to the Clients page and click the 'Add Client' button. Fill in the required information including name, email, phone number, and fitness goals. You can also set up their initial assessment and workout preferences."
    },
        {
          question: "How do I manage client permissions?",
          answer: "Go to the Client Portal Manager to control what information each client can see and edit. You can customize access to progress tracking, workout plans, payment history, and communication features."
        },
        {
          question: "Can I create client groups or categories?",
          answer: "Yes! You can create custom tags and categories for your clients. This helps you organize clients by program type, fitness level, or any other criteria that makes sense for your business."
        }
      ]
    },
    {
      category: "Sessions & Scheduling",
      questions: [
    {
      question: "How do I schedule a session?",
      answer: "Go to the Sessions page and click 'Schedule Session'. Select the client, choose a date and time, and specify the session type (consultation, workout, assessment, etc.). The system will automatically send confirmation emails."
    },
        {
          question: "Can clients book sessions themselves?",
          answer: "Yes! Clients can book sessions through their portal if you enable this feature. You can set your availability, session types, and pricing. Clients will receive automatic confirmations and reminders."
        },
        {
          question: "How do I handle session cancellations?",
          answer: "Both you and your clients can cancel sessions through the platform. You can set cancellation policies and automatic notifications. Cancelled sessions are clearly marked in your calendar and reports."
        }
      ]
    },
    {
      category: "Progress Tracking",
      questions: [
    {
      question: "How do I track client progress?",
      answer: "Use the Progress page to log client measurements, weight, body composition, and performance metrics. You can also add progress photos and notes. The system will generate progress reports and trends over time."
    },
        {
          question: "What metrics can I track?",
          answer: "You can track weight, body measurements, body fat percentage, muscle mass, performance metrics (strength, endurance, flexibility), and custom metrics you define. The system creates visual charts and trends."
        },
        {
          question: "How do I share progress reports with clients?",
          answer: "Generate progress reports from the Progress page and share them directly through the client portal or email. Reports include charts, trends, and personalized insights to motivate your clients."
        }
      ]
    },
    {
      category: "Workouts & Programs",
      questions: [
    {
      question: "How do I create workout plans?",
      answer: "Navigate to the Workouts page and click 'Create Workout Plan'. You can build custom workouts with exercises, sets, reps, and rest periods. Save templates for reuse and assign them to specific clients."
    },
        {
          question: "Can I import exercises from a library?",
          answer: "Yes! We have a comprehensive exercise library with videos and descriptions. You can also add your own custom exercises and create exercise categories that match your training style."
        },
        {
          question: "How do I assign workouts to clients?",
          answer: "After creating a workout plan, you can assign it to individual clients or groups. Clients will see their assigned workouts in their portal, and you can track their completion and feedback."
        }
      ]
    },
    {
      category: "Payments & Billing",
      questions: [
    {
      question: "How do I process payments?",
      answer: "Go to the Payments page to view all client payments. You can manually record payments, set up recurring billing, and track payment history. The system integrates with Stripe for secure online payments."
    },
        {
          question: "Can I set up automatic billing?",
          answer: "Yes! You can set up recurring payments for clients on subscription plans. The system will automatically charge clients on their billing cycle and send them receipts and payment reminders."
        },
        {
          question: "How do I handle refunds?",
          answer: "Process refunds directly through the Payments page. You can issue full or partial refunds, and the system will update your financial records and notify the client automatically."
        }
      ]
    },
    {
      category: "AI Features",
      questions: [
    {
      question: "How do I use the AI Coach feature?",
      answer: "The AI Coach provides personalized recommendations based on client data. Access it through the AI Recommendations page to get workout suggestions, nutrition advice, and progress insights tailored to each client."
    },
    {
          question: "What data does the AI use?",
          answer: "The AI analyzes client progress, workout history, goals, and preferences to provide personalized recommendations. All data is kept secure and private, and you control what information is shared."
        },
        {
          question: "Can I customize AI recommendations?",
          answer: "Yes! You can review and modify AI recommendations before sharing them with clients. The AI learns from your feedback to provide better suggestions over time."
        }
      ]
    },
    {
      category: "Marketing & Growth",
      questions: [
        {
          question: "How do I use the marketing features?",
          answer: "Access the Marketing Hub to create campaigns, manage social media, and track analytics. You can send newsletters, create referral programs, and analyze your business growth."
        },
        {
          question: "Can I create referral programs?",
          answer: "Yes! Set up referral programs to encourage clients to bring friends. You can offer incentives, track referrals, and automatically manage the referral process through the platform."
        },
        {
          question: "How do I track marketing performance?",
          answer: "Use the Marketing Analytics dashboard to track campaign performance, client acquisition costs, and ROI. The system provides detailed insights to help you optimize your marketing efforts."
        }
      ]
    }
  ];

  const contactOptions = [
    {
      title: "Email Support",
      description: "Primary support method - get help via email",
      icon: Mail,
              action: "support@fitclients.io",
      type: "email",
      responseTime: "24 hours",
      availability: "24/7",
      primary: true
    },
    {
      title: "Live Chat",
      description: "Chat with our support team (Coming Soon)",
      icon: MessageCircle,
      action: "Coming Soon",
      type: "chat",
      responseTime: "Instant",
      availability: "Business hours",
      primary: false
    },
    {
      title: "Phone Support",
      description: "Call us during business hours",
      icon: Phone,
      action: "+1 (555) 123-4567",
      type: "phone",
      responseTime: "Immediate",
      availability: "Mon-Fri 9AM-6PM EST",
      primary: false
    },
    {
      title: "Priority Support",
      description: "Premium support for business clients",
      icon: Shield,
      action: "Contact Sales",
      type: "priority",
      responseTime: "4 hours",
      availability: "24/7",
      primary: false
    }
  ];

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Complete step-by-step guide to set up your FitClients account",
      icon: BookOpen,
      link: "#",
      type: "guide",
      duration: "15 min read",
      category: "Essentials",
      difficulty: "Beginner",
      lastUpdated: "2 days ago",
      completed: false
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video instructions for all features",
      icon: Video,
      link: "#",
      type: "video",
      duration: "2-5 min each",
      category: "Essentials",
      difficulty: "Beginner",
      lastUpdated: "1 week ago",
      completed: false
    },
    {
      title: "Client Portal Setup",
      description: "Learn how to customize and optimize client portals",
      icon: Users,
      link: "#",
      type: "guide",
      duration: "10 min read",
      category: "Client Management",
      difficulty: "Intermediate",
      lastUpdated: "3 days ago",
      completed: false
    },
    {
      title: "Payment Processing",
      description: "Complete guide to setting up payments and billing",
      icon: CreditCard,
      link: "#",
      type: "guide",
      duration: "12 min read",
      category: "Business",
      difficulty: "Intermediate",
      lastUpdated: "1 week ago",
      completed: false
    },
    {
      title: "Marketing Best Practices",
      description: "Tips and strategies to grow your fitness business",
      icon: TrendingUp,
      link: "#",
      type: "guide",
      duration: "20 min read",
      category: "Business",
      difficulty: "Advanced",
      lastUpdated: "5 days ago",
      completed: false
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers and integrations",
      icon: FileText,
      link: "#",
      type: "api",
      duration: "Advanced",
      category: "Technical",
      difficulty: "Advanced",
      lastUpdated: "2 weeks ago",
      completed: false
    },
    {
      title: "Workout Plan Templates",
      description: "Pre-built workout templates for different fitness levels",
      icon: Target,
      link: "#",
      type: "template",
      duration: "5 min read",
      category: "Training",
      difficulty: "Beginner",
      lastUpdated: "1 week ago",
      completed: false
    },
    {
      title: "Progress Tracking Guide",
      description: "How to effectively track and report client progress",
      icon: BarChart3,
      link: "#",
      type: "guide",
      duration: "8 min read",
      category: "Client Management",
      difficulty: "Intermediate",
      lastUpdated: "4 days ago",
      completed: false
    },
    {
      title: "AI Coach Setup",
      description: "Configure and optimize AI recommendations for clients",
      icon: Zap,
      link: "#",
      type: "guide",
      duration: "15 min read",
      category: "AI Features",
      difficulty: "Intermediate",
      lastUpdated: "1 week ago",
      completed: false
    },
    {
      title: "Mobile App Guide",
      description: "Using FitClients on mobile devices and tablets",
      icon: Users,
      link: "#",
      type: "guide",
      duration: "6 min read",
      category: "Essentials",
      difficulty: "Beginner",
      lastUpdated: "3 days ago",
      completed: false
    },
    {
      title: "Data Import/Export",
      description: "How to import existing data and export reports",
      icon: FileText,
      link: "#",
      type: "guide",
      duration: "10 min read",
      category: "Technical",
      difficulty: "Intermediate",
      lastUpdated: "1 week ago",
      completed: false
    },
    {
      title: "Security & Privacy",
      description: "Understanding data security and client privacy",
      icon: Shield,
      link: "#",
      type: "guide",
      duration: "7 min read",
      category: "Business",
      difficulty: "Beginner",
      lastUpdated: "2 weeks ago",
      completed: false
    }
  ];

  const resourceCategories = [
    { name: "Essentials", color: "bg-blue-100 text-blue-800" },
    { name: "Client Management", color: "bg-green-100 text-green-800" },
    { name: "Business", color: "bg-purple-100 text-purple-800" },
    { name: "Training", color: "bg-orange-100 text-orange-800" },
    { name: "AI Features", color: "bg-pink-100 text-pink-800" },
    { name: "Technical", color: "bg-gray-100 text-gray-800" }
  ];

  const difficultyLevels = [
    { name: "Beginner", color: "bg-green-100 text-green-800" },
    { name: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
    { name: "Advanced", color: "bg-red-100 text-red-800" }
  ];

  // Service definitions for monitoring
  const serviceDefinitions = [
    {
      id: "frontend",
      name: "Frontend Application",
      description: "Main React application and user interface",
      icon: Zap,
      uptime: 99.9
    },
    {
      id: "backend",
      name: "Backend API",
      description: "Server API and business logic",
      icon: Activity,
      uptime: 99.8
    },
    {
      id: "database",
      name: "Database",
      description: "Firebase Firestore data storage",
      icon: BarChart3,
      uptime: 99.95
    },
    {
      id: "auth",
      name: "Authentication",
      description: "Firebase Auth service",
      icon: Shield,
      uptime: 99.9
    },
    {
      id: "payments",
      name: "Payment Processing",
      description: "Stripe payment integration",
      icon: CreditCard,
      uptime: 99.99
    },
    {
      id: "email",
      name: "Email Services",
      description: "Transactional email delivery",
      icon: Mail,
      uptime: 99.8
    },
    {
      id: "ai",
      name: "AI Services",
      description: "OpenAI API for AI Coach",
      icon: Target,
      uptime: 99.5
    },
    {
      id: "storage",
      name: "File Storage",
      description: "Firebase Storage for files",
      icon: FileText,
      uptime: 99.9
    }
  ];

  // Health check functions
  const checkServiceHealth = useCallback(async (service: Omit<ServiceStatus, 'status' | 'lastChecked'>): Promise<ServiceStatus> => {
    const startTime = Date.now();
    let status: "operational" | "degraded" | "outage" = "operational";
    let responseTime: number | undefined;

    try {
      // Simulate health check for all services to avoid CSP issues
      // In a real production app, these would be checked by your backend
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
      responseTime = Date.now() - startTime;
      
      // Simulate realistic service status based on service type
      const random = Math.random();
      
      // Different services have different reliability patterns
      switch (service.id) {
        case 'frontend':
          // Frontend is usually very reliable
          if (random < 0.02) status = "degraded"; // 2% chance
          else if (random < 0.005) status = "outage"; // 0.5% chance
          break;
        case 'backend':
          // Backend has occasional issues
          if (random < 0.05) status = "degraded"; // 5% chance
          else if (random < 0.01) status = "outage"; // 1% chance
          break;
        case 'database':
          // Database is critical, very reliable
          if (random < 0.01) status = "degraded"; // 1% chance
          else if (random < 0.002) status = "outage"; // 0.2% chance
          break;
        case 'payments':
          // Payment systems are very reliable
          if (random < 0.03) status = "degraded"; // 3% chance
          else if (random < 0.005) status = "outage"; // 0.5% chance
          break;
        case 'email':
          // Email service has occasional issues
          if (random < 0.08) status = "degraded"; // 8% chance
          else if (random < 0.02) status = "outage"; // 2% chance
          break;
        case 'ai':
          // AI services can be less reliable
          if (random < 0.10) status = "degraded"; // 10% chance
          else if (random < 0.03) status = "outage"; // 3% chance
          break;
        case 'storage':
          // Storage is usually very reliable
          if (random < 0.02) status = "degraded"; // 2% chance
          else if (random < 0.005) status = "outage"; // 0.5% chance
          break;
        default:
          // Default pattern
          if (random < 0.05) status = "degraded"; // 5% chance
          else if (random < 0.01) status = "outage"; // 1% chance
      }
      
    } catch (error) {
      status = "outage";
      responseTime = Date.now() - startTime;
    }

    return {
      ...service,
      status,
      lastChecked: new Date(),
      responseTime
    };
  }, []);

  const performHealthChecks = useCallback(async () => {
    setIsMonitoring(true);
    
    try {
      const healthChecks = await Promise.allSettled(
        serviceDefinitions.map(service => checkServiceHealth(service))
      );

      const results = healthChecks.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          // If health check fails, mark as outage
          return {
            ...serviceDefinitions[index],
            status: "outage" as const,
            lastChecked: new Date()
          };
        }
      });

      setSystemServices(results);
      setLastUpdate(new Date());

      // Calculate overall status
      const hasOutage = results.some(s => s.status === "outage");
      const hasDegraded = results.some(s => s.status === "degraded");
      
      if (hasOutage) {
        setOverallStatus("outage");
      } else if (hasDegraded) {
        setOverallStatus("degraded");
      } else {
        setOverallStatus("operational");
      }

    } catch (error) {
      // Health check failed - continue silently
    } finally {
      setIsMonitoring(false);
    }
  }, [checkServiceHealth]);

  // Initialize services and start monitoring
  useEffect(() => {
    // Initialize with checking status
    const initialServices = serviceDefinitions.map(service => ({
      ...service,
      status: "checking" as const,
      lastChecked: new Date()
    }));
    setSystemServices(initialServices);

    // Perform initial health check
    performHealthChecks();

    // Set up periodic health checks every 30 seconds
    const interval = setInterval(performHealthChecks, 30000);

    return () => clearInterval(interval);
  }, [performHealthChecks]);

  // Format time ago
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Flatten all FAQ questions for search
  const allFaqs = faqs.flatMap(category => category.questions);

  const filteredFaqs = allFaqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContact = (type: string, action: string) => {
    try {
      switch (type) {
        case "email":
          window.location.href = `mailto:${action}?subject=FitClients Support Request`;
          break;
        case "phone":
          window.location.href = `tel:${action}`;
          break;
        case "chat":
          setShowChatWidget(true);
          // In a real app, this would open a chat widget
          setTimeout(() => {
            toast({
          title: "Live Chat Coming Soon",
          description: "For now, please use email support as our primary contact method.",
        });
            setShowChatWidget(false);
          }, 1000);
          break;
        case "priority":
          window.location.href = `mailto:support@fitclients.io?subject=Priority Support Inquiry`;
          break;
        default:
          // Unknown contact type - handle gracefully
          break;
      }
    } catch (error) {
      // Handle any errors gracefully
      // Contact action failed
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "outage":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Operational</Badge>;
      case "degraded":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Degraded</Badge>;
      case "outage":
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Outage</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  // Resource filtering and search functions
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(resourceSearchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(resourceSearchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || resource.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleResourceComplete = (resourceTitle: string) => {
    const newCompleted = new Set(completedResources);
    if (newCompleted.has(resourceTitle)) {
      newCompleted.delete(resourceTitle);
    } else {
      newCompleted.add(resourceTitle);
    }
    setCompletedResources(newCompleted);
  };

  const getCategoryColor = (categoryName: string) => {
    const category = resourceCategories.find(cat => cat.name === categoryName);
    return category ? category.color : "bg-gray-100 text-gray-800";
  };

  const getDifficultyColor = (difficultyName: string) => {
    const difficulty = difficultyLevels.find(diff => diff.name === difficultyName);
    return difficulty ? difficulty.color : "bg-gray-100 text-gray-800";
  };

  const completedCount = completedResources.size;
  const totalResources = resources.length;
  const progressPercentage = Math.round((completedCount / totalResources) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">
            Get help with FitClients and find answers to common questions
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Support Available
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="ticket">Submit Ticket</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search FAQ
              </CardTitle>
              <CardDescription>
                Search through our frequently asked questions by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search questions or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Search FAQ questions"
                  aria-describedby="search-results"
                />
              </div>
              {searchQuery && (
                <p id="search-results" className="text-sm text-muted-foreground mt-2">
                  Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''}
                </p>
              )}
            </CardContent>
          </Card>

          {searchQuery ? (
            // Show filtered results
          <Card>
            <CardHeader>
                <CardTitle>Search Results</CardTitle>
              <CardDescription>
                  Questions matching "{searchQuery}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`search-item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ) : (
            // Show categorized FAQ
            <div className="space-y-6">
              {faqs.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                    <CardDescription>
                      Common questions about {category.category.toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, index) => (
                        <AccordionItem key={index} value={`${categoryIndex}-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get in touch with our support team for personalized help
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {contactOptions.map((option, index) => (
                  <Card key={index} className={`cursor-pointer hover:shadow-md transition-shadow ${option.primary ? 'ring-2 ring-primary' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <option.icon className="h-6 w-6 text-primary" />
                        <div className="flex-1">
                        <h3 className="font-semibold">{option.title}</h3>
                          {option.primary && (
                            <Badge variant="secondary" className="text-xs mt-1">Primary Method</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {option.description}
                      </p>
                      <div className="text-xs text-muted-foreground mb-4 space-y-1">
                        <div>Response: {option.responseTime}</div>
                        <div>Available: {option.availability}</div>
                      </div>
                      <Button 
                        variant={option.primary ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handleContact(option.type, option.action)}
                        disabled={option.type === "chat"}
                      >
                        {option.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Monday - Friday</p>
                    <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Saturday</p>
                    <p className="text-sm text-muted-foreground">Closed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Sunday</p>
                    <p className="text-sm text-muted-foreground">Email support only</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Priority Support</p>
                    <p className="text-sm text-muted-foreground">Available 24/7 for business clients</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Resources & Documentation
              </CardTitle>
              <CardDescription>
                Comprehensive guides, tutorials, and documentation to help you succeed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Resources Coming Soon</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We're working hard to create comprehensive guides, video tutorials, and documentation to help you get the most out of FitClients.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Getting Started Guide</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Video Tutorials</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Client Portal Setup Guide</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Payment Processing Documentation</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Marketing Best Practices</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Button variant="outline" onClick={() => window.location.href = 'mailto:support@fitclients.io?subject=Resource Request'}>
                    <Mail className="h-4 w-4 mr-2" />
                    Request Specific Resources
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help Now?</CardTitle>
              <CardDescription>
                While we're building our resource library, here are other ways to get help
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    FAQ Section
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Check our frequently asked questions for quick answers
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("faq")}>
                    Browse FAQ
                  </Button>
                      </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Support
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get personalized help from our support team
                  </p>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = 'mailto:support@fitclients.io'}>
                    Contact Support
                      </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ticket" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Submit Support Ticket
              </CardTitle>
              <CardDescription>
                Submit a support request to the FitClients team. We'll respond as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Support Ticket Form */}
              {(() => {
                const [formData, setFormData] = useState({
                  subject: '',
                  description: '',
                  category: 'Technical',
                  priority: 'medium'
                });
                const [isSubmitting, setIsSubmitting] = useState(false);
                const [submitted, setSubmitted] = useState(false);
                const [error, setError] = useState<string | null>(null);

                const handleSubmit = async (e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  setError(null); // Clear any previous errors
                  
                  try {
                    // Validate form data
                    if (!formData.subject.trim()) {
                      throw new Error('Please enter a subject for your ticket');
                    }
                    if (formData.subject.trim().length < 5) {
                      throw new Error('Subject must be at least 5 characters long');
                    }
                    if (!formData.description.trim()) {
                      throw new Error('Please provide a description of your issue');
                    }
                    if (formData.description.trim().length < 20) {
                      throw new Error('Description must be at least 20 characters long');
                    }

                    // Attempt to submit the ticket
                    await supportTicketsService.addSupportTicket({
                      ...formData,
                      clientName: user?.displayName || user?.email || 'Unknown',
                      clientEmail: user?.email || 'Unknown',
                      status: 'open',
                      comments: [],
                      tags: [],
                      attachments: [],
                    });
                    
                    // Success - show confirmation
                    setSubmitted(true);
                    toast({
                      title: "Ticket Submitted",
                      description: "Your support request has been received. We'll get back to you soon.",
                    });
                    setTimeout(() => {
                      setSubmitted(false);
                      setFormData({
                        subject: '',
                        description: '',
                        category: 'Technical',
                        priority: 'medium'
                      });
                    }, 3000);
                    
                  } catch (err) {
                    // Handle different types of errors
                    let errorMessage = 'Failed to submit ticket. Please try again.';
                    
                    if (err instanceof Error) {
                      if (err.message.includes('permission-denied')) {
                        errorMessage = 'You do not have permission to submit tickets. Please contact support directly.';
                      } else if (err.message.includes('unavailable')) {
                        errorMessage = 'Service temporarily unavailable. Please try again in a few minutes.';
                      } else if (err.message.includes('network')) {
                        errorMessage = 'Network error. Please check your connection and try again.';
                      } else if (err.message.includes('timeout')) {
                        errorMessage = 'Request timed out. Please try again.';
                      } else if (err.message.includes('Please enter') || err.message.includes('Please provide')) {
                        errorMessage = err.message; // Use validation error messages as-is
                      }
                    }
                    
                    setError(errorMessage);
                    toast({
                      title: "Submission Failed",
                      description: errorMessage,
                      variant: "destructive",
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                };

                if (submitted) {
                  return (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ticket Submitted!</h3>
                      <p className="text-muted-foreground">
                        Your support request has been received. We'll get back to you soon.
                      </p>
                    </div>
                  );
                }

                return (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error Message Display */}
                    {error && (
                      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-red-800">Error</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                        <div className="mt-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setError(null)}
                            className="text-red-700 border-red-300 hover:bg-red-100"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your issue"
                        required
                        disabled={isSubmitting}
                        aria-describedby="subject-help"
                      />
                      <p id="subject-help" className="text-xs text-muted-foreground mt-1">
                        Provide a clear, concise title for your issue
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full border border-input rounded-md px-3 py-2 text-sm"
                        disabled={isSubmitting}
                        aria-describedby="category-help"
                      >
                        <option value="Technical">Technical Issue</option>
                        <option value="Billing">Billing & Payments</option>
                        <option value="Account">Account Access</option>
                        <option value="Feature">Feature Request</option>
                        <option value="Other">Other</option>
                      </select>
                      <p id="category-help" className="text-xs text-muted-foreground mt-1">
                        Select the category that best describes your issue
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        value={formData.priority}
                        onChange={e => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full border border-input rounded-md px-3 py-2 text-sm"
                        disabled={isSubmitting}
                        aria-describedby="priority-help"
                      >
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Minor issue</option>
                        <option value="high">High - Affecting usage</option>
                        <option value="urgent">Urgent - Cannot use system</option>
                      </select>
                      <p id="priority-help" className="text-xs text-muted-foreground mt-1">
                        Choose the urgency level of your issue
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Please provide detailed information about your issue..."
                        className="min-h-[120px]"
                        required
                        disabled={isSubmitting}
                        aria-describedby="description-help"
                        maxLength={1000}
                      />
                      <p id="description-help" className="text-xs text-muted-foreground mt-1">
                        Provide detailed information about your issue. Include steps to reproduce, error messages, and any relevant context.
                      </p>
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Submit Ticket
                        </>
                      )}
                    </Button>
                    
                    {/* Fallback Contact Info */}
                    <div className="text-center text-sm text-muted-foreground">
                      <p>Having trouble? Contact us directly at{' '}
                        <a 
                          href="mailto:support@fitclients.io" 
                          className="text-blue-600 hover:underline"
                        >
                          support@fitclients.io
                        </a>
                      </p>
                  </div>
                  </form>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Help; 