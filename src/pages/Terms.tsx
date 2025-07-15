import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, AlertTriangle, FileText, CreditCard, Calendar, Users, Lock, Activity, Mail, Phone } from "lucide-react";

const Terms = () => {
  const lastUpdated = "January 15, 2025";
  
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
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Legal Documents</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FileText className="h-4 w-4" />
            Legal Agreement
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Important Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Important Notice</h3>
                <p className="text-amber-700 text-sm">
                  By using FitClients, you agree to these terms. Please read them carefully. 
                  If you don't agree with any part of these terms, please don't use our service.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                By accessing and using FitClients ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms of Service ("Terms") govern your use of our website located at fitclients.app and our mobile application 
                (together or individually "Service") operated by FitClients ("us", "we", or "our").
              </p>
              <p>
                <strong>Changes to Terms:</strong> We reserve the right to modify these terms at any time. We will notify users of material changes 
                via email or through the Service at least 30 days before the changes take effect.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                FitClients is a customer relationship management (CRM) platform designed specifically for personal trainers and fitness professionals. 
                Our service includes:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Client management and tracking</li>
                <li>Session scheduling and management</li>
                <li>Payment tracking and billing history</li>
                <li>Progress monitoring and analytics</li>
                <li>Workout plan creation and management</li>
                <li>AI-powered session recaps and recommendations</li>
                <li>Client portal generation and sharing</li>
                <li>Payment processing and subscription management</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Accounts and Registration</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                To access certain features of the Service, you must register for an account. When you register for an account, you must provide 
                information that is accurate, complete, and current at all times.
              </p>
              <p>
                You are responsible for safeguarding the password and for all activities that occur under your account. 
                You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account.
              </p>
              <p>
                <strong>Account Security:</strong> You must notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
              <p>
                We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Subscription and Billing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Subscription Plans</h4>
                  <p>
                    FitClients offers both free and paid subscription plans. Paid subscriptions are billed in advance on a monthly or annual basis.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li><strong>Starter Plan:</strong> $9/month, up to 200 clients</li>
                    <li><strong>Pro Plan:</strong> $19/month, unlimited clients</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Payment Processing</h4>
                  <p>
                    All payments are processed securely through Stripe, our third-party payment processor. By providing payment information, 
                    you authorize us to charge your payment method for all fees incurred.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Payments are processed in USD</li>
                    <li>All fees are non-refundable except as required by law</li>
                    <li>Failed payments may result in service suspension</li>
                    <li>We reserve the right to change pricing with 30 days notice</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Billing and Renewal</h4>
                  <p>
                    Your subscription will automatically renew at the end of each billing period unless you cancel it before the renewal date. 
                    You can cancel your subscription at any time through your account settings.
                  </p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Billing occurs on the same date each month/year</li>
                    <li>You will be charged the then-current price for your plan</li>
                    <li>Cancellation takes effect at the end of the current billing period</li>
                    <li>No refunds for partial months or unused periods</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Free Trial</h4>
                  <p>
                    We offer a 14-day free trial for paid plans. No credit card is required to start the trial. 
                    If you don't cancel before the trial ends, you will be charged for the selected plan.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Data Processing and Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Data Processing Agreement</h4>
                  <p>
                    By using our Service, you acknowledge that you are the data controller for any client data you input, 
                    and we act as a data processor. We process your data in accordance with our Privacy Policy and applicable data protection laws.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Your Responsibilities</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Ensure you have legal basis for processing client data</li>
                    <li>Obtain necessary consents from clients</li>
                    <li>Provide clients with information about data processing</li>
                    <li>Respond to client data requests</li>
                    <li>Maintain accurate and up-to-date client information</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Our Commitments</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Process data only as instructed by you</li>
                    <li>Implement appropriate security measures</li>
                    <li>Assist with data subject requests</li>
                    <li>Notify you of any data breaches</li>
                    <li>Delete data upon account termination</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">GDPR Compliance</h4>
                  <p>
                    For users in the European Union, we comply with the General Data Protection Regulation (GDPR). 
                    You have the right to access, rectify, erase, and port your data, as well as object to processing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Acceptable Use Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>You agree not to use the Service:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>For any obscene or immoral purpose</li>
                <li>To interfere with or circumvent the security features of the Service</li>
                <li>To exceed reasonable usage limits or attempt to overload our systems</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of FitClients and its licensors. 
                The Service is protected by copyright, trademark, and other laws.
              </p>
              <p>
                You may not duplicate, copy, or reuse any portion of the HTML/CSS, JavaScript, or visual design elements or concepts without express written permission.
              </p>
              <p>
                <strong>Your Content:</strong> You retain ownership of all data you input into the Service. You grant us a limited license to process and store this data 
                solely for the purpose of providing the Service to you.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Service Availability and Support</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Service Level</h4>
                  <p>
                    We strive to maintain 99.9% uptime for our Service. However, we do not guarantee uninterrupted access and may perform maintenance 
                    that temporarily affects availability.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Support</h4>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Free Plan:</strong> Email support with 48-hour response time</li>
                    <li><strong>Pro Plan:</strong> Email support with 24-hour response time</li>
                    <li><strong>Pro Lifetime Plan:</strong> Priority email and phone support with 4-hour response time</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Updates and Maintenance</h4>
                  <p>
                    We may update the Service from time to time to improve functionality, security, or user experience. 
                    We will provide reasonable notice for major updates that may affect your use of the Service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                In no event shall FitClients, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, 
                special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, 
                resulting from your use of the Service.
              </p>
              <p>
                Our total liability to you for any claim arising out of or relating to these Terms or the Service shall not exceed the amount you paid us 
                for the Service in the 12 months preceding the claim.
              </p>
              <p>
                <strong>Force Majeure:</strong> We shall not be liable for any failure to perform due to circumstances beyond our reasonable control, 
                including but not limited to acts of God, war, terrorism, riots, fire, natural disasters, or government actions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Termination</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, 
                under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p>
                If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
              </p>
              <p>
                Upon termination, your right to use the Service will cease immediately. We will retain your data for 30 days after termination, 
                after which it will be permanently deleted. You are responsible for exporting any data you wish to keep before termination.
              </p>
              <p>
                All provisions of the Terms which by their nature should survive termination shall survive termination.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Governing Law and Disputes</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, 
                without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in accordance 
                with the rules of the American Arbitration Association. The arbitration shall take place in Delaware, United States.
              </p>
              <p>
                You agree to waive any right to a jury trial or to participate in a class action lawsuit.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">legal@fitclients.app</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <Link to="/" className="text-sm text-primary hover:underline">fitclients.app</Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/privacy">
              <Button variant="outline">
                View Privacy Policy
              </Button>
            </Link>
            <Link to="/login">
              <Button>
                Accept & Continue to FitClients
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            By using FitClients, you acknowledge that you have read and agree to these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms; 