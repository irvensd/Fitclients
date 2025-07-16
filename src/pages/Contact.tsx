import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send,
  CheckCircle,
  HelpCircle,
  Zap,
  Users,
  Shield,
  Star
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to FitClients
            </Link>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="font-semibold">Contact Support</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4" />
            Get in Touch
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about FitClients? Need help getting started? Our team is here to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
                    <p className="text-green-700 mb-4">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                          placeholder="Your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                          placeholder="Your last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="What can we help you with?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="sales">Sales & Pricing</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        required
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                        placeholder="Please provide details about your question or request..."
                        rows={6}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Email Support</h4>
                    <p className="text-sm text-muted-foreground">support@fitclients.app</p>
                    <p className="text-xs text-muted-foreground mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Phone Support</h4>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Business Hours</h4>
                    <p className="text-sm text-muted-foreground">Monday - Friday</p>
                    <p className="text-xs text-muted-foreground">9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Quick Help</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link 
                  to="/help-support" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Help Center</p>
                    <p className="text-xs text-muted-foreground">FAQs and guides</p>
                  </div>
                </Link>

                <Link 
                  to="/privacy" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Shield className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Privacy Policy</p>
                    <p className="text-xs text-muted-foreground">How we protect your data</p>
                  </div>
                </Link>

                <Link 
                  to="/terms" 
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Terms of Service</p>
                    <p className="text-xs text-muted-foreground">Service agreement</p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="shadow-sm border-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Star className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 text-sm">Fast Response</h4>
                    <p className="text-xs text-green-700">
                      Average response time: 4 hours
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Quick answers to common questions about FitClients
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm border-0 bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How do I get started with FitClients?</h3>
                <p className="text-sm text-muted-foreground">
                  Simply sign up for a free account, add your first client, and start managing your training business. 
                  Our onboarding guide will walk you through the setup process.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I try FitClients for free?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! We offer a Starter plan ($9/month) for up to 200 clients, plus a 14-day free trial of our Pro plan 
                  with no credit card required.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How secure is my client data?</h3>
                <p className="text-sm text-muted-foreground">
                  We use enterprise-grade security with end-to-end encryption, secure cloud storage, and GDPR compliance. 
                  Your data is always protected and never shared.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely! You can upgrade, downgrade, or cancel your subscription at any time with no long-term contracts. 
                  Your data remains accessible during the billing period.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="shadow-sm border-0 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Join thousands of personal trainers who have simplified their business with FitClients.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/login?mode=register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Free Trial
                  </Button>
                </Link>
                <Link to="/landing#demo">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    View Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact; 