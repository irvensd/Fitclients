import { useState } from "react";
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
  Info
} from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I add a new client?",
      answer: "Navigate to the Clients page and click the 'Add Client' button. Fill in the required information including name, email, phone number, and fitness goals. You can also set up their initial assessment and workout preferences."
    },
    {
      question: "How do I schedule a session?",
      answer: "Go to the Sessions page and click 'Schedule Session'. Select the client, choose a date and time, and specify the session type (consultation, workout, assessment, etc.). The system will automatically send confirmation emails."
    },
    {
      question: "How do I track client progress?",
      answer: "Use the Progress page to log client measurements, weight, body composition, and performance metrics. You can also add progress photos and notes. The system will generate progress reports and trends over time."
    },
    {
      question: "How do I create workout plans?",
      answer: "Navigate to the Workouts page and click 'Create Workout Plan'. You can build custom workouts with exercises, sets, reps, and rest periods. Save templates for reuse and assign them to specific clients."
    },
    {
      question: "How do I process payments?",
      answer: "Go to the Payments page to view all client payments. You can manually record payments, set up recurring billing, and track payment history. The system integrates with Stripe for secure online payments."
    },
    {
      question: "How do I use the AI Coach feature?",
      answer: "The AI Coach provides personalized recommendations based on client data. Access it through the AI Recommendations page to get workout suggestions, nutrition advice, and progress insights tailored to each client."
    },
    {
      question: "How do I access client portals?",
      answer: "Clients can access their personal portal through a unique link. You can manage portal access through the Client Portals page, where you can customize what information clients can see and update."
    },
    {
      question: "How do I export client data?",
      answer: "You can export client data, progress reports, and session history from the respective pages. Look for the export button (usually in the top right) to download data in CSV or PDF format."
    }
  ];

  const contactOptions = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: Mail,
      action: "support@fitclients.com",
      type: "email"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      icon: MessageCircle,
      action: "Start Chat",
      type: "chat"
    },
    {
      title: "Phone Support",
      description: "Call us during business hours",
      icon: Phone,
      action: "+1 (555) 123-4567",
      type: "phone"
    }
  ];

  const resources = [
    {
      title: "User Guide",
      description: "Complete guide to using FitClients",
      icon: BookOpen,
      link: "#",
      type: "guide"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video instructions",
      icon: Video,
      link: "#",
      type: "video"
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers",
      icon: FileText,
      link: "#",
      type: "api"
    },
    {
      title: "Community Forum",
      description: "Connect with other trainers",
      icon: MessageCircle,
      link: "#",
      type: "community"
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContact = (type: string, action: string) => {
    switch (type) {
      case "email":
        window.location.href = `mailto:${action}`;
        break;
      case "phone":
        window.location.href = `tel:${action}`;
        break;
      case "chat":
        // In a real app, this would open a chat widget
        alert("Live chat feature coming soon!");
        break;
    }
  };

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

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search FAQ
              </CardTitle>
              <CardDescription>
                Search through our frequently asked questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to the most common questions about FitClients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
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
              <div className="grid gap-4 md:grid-cols-3">
                {contactOptions.map((option, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <option.icon className="h-6 w-6 text-primary" />
                        <h3 className="font-semibold">{option.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {option.description}
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleContact(option.type, option.action)}
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
                    <p className="text-sm text-muted-foreground">10:00 AM - 4:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Sunday</p>
                    <p className="text-sm text-muted-foreground">Email support only</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Helpful Resources</CardTitle>
              <CardDescription>
                Access guides, tutorials, and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {resources.map((resource, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <resource.icon className="h-6 w-6 text-primary" />
                        <h3 className="font-semibold">{resource.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {resource.description}
                      </p>
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Access Resource
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Check the current status of FitClients services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Application</p>
                      <p className="text-sm text-muted-foreground">All systems operational</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Operational</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Database</p>
                      <p className="text-sm text-muted-foreground">All systems operational</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Operational</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Payment Processing</p>
                      <p className="text-sm text-muted-foreground">All systems operational</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Operational</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Email Services</p>
                      <p className="text-sm text-muted-foreground">All systems operational</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Operational</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Help; 