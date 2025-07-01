import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Lock, Eye, Download, Trash2, AlertCircle, Mail, Phone, Calendar, Users, Database, CreditCard, Activity } from "lucide-react";

const Privacy = () => {
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
              <Lock className="h-5 w-5 text-primary" />
              <span className="font-semibold">Privacy & Security</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="h-4 w-4" />
            Privacy Protection
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {lastUpdated}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">GDPR Compliant</Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">CCPA Compliant</Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">SOC 2 Ready</Badge>
          </div>
        </div>

        {/* Quick Summary */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Privacy at a Glance</h3>
                <div className="text-blue-700 text-sm space-y-1">
                  <p>• We only collect data necessary to provide our fitness CRM service</p>
                  <p>• Your client data belongs to you - we never sell or share it</p>
                  <p>• You can export or delete your data at any time</p>
                  <p>• We use industry-standard encryption and security measures</p>
                  <p>• We process data based on legitimate business interests and consent</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Account Information</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  When you create a FitClients account, we collect:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Name and email address</li>
                  <li>• Encrypted password</li>
                  <li>• Business information (optional)</li>
                  <li>• Profile information and preferences</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  <strong>Legal Basis:</strong> Contract performance and legitimate business interests
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Client Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  As a fitness professional using our CRM, you may input client information including:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Names, contact details, and demographic information</li>
                  <li>• Fitness goals, medical history, and progress measurements</li>
                  <li>• Session notes, workout plans, and progress tracking</li>
                  <li>• Payment records and billing information</li>
                  <li>• Photos and progress images (with consent)</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  <strong>Legal Basis:</strong> Legitimate business interests (providing CRM services) and consent
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Usage Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  We automatically collect technical information about your use of our service:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• IP address and device information</li>
                  <li>• Browser type and version</li>
                  <li>• Pages visited and features used</li>
                  <li>• Error logs and performance data</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  <strong>Legal Basis:</strong> Legitimate business interests (service improvement and security)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-green-800">Service Provision</h4>
                  </div>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Provide CRM functionality</li>
                    <li>• Process payments and billing</li>
                    <li>• Send service notifications</li>
                    <li>• Provide customer support</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Service Improvement</h4>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Analyze usage patterns</li>
                    <li>• Improve features and performance</li>
                    <li>• Develop new functionality</li>
                    <li>• Ensure security and reliability</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Data Sharing and Third Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">We Do NOT Sell Your Data</h4>
                <p className="text-sm text-muted-foreground">
                  We never sell, rent, or trade your personal information or client data to third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  We use trusted third-party services to operate our platform:
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <h5 className="font-medium text-sm">Firebase (Google)</h5>
                    <p className="text-xs text-muted-foreground">Hosting, database, and authentication services</p>
                    <p className="text-xs text-muted-foreground">Data Processing Agreement: Yes</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h5 className="font-medium text-sm">Stripe</h5>
                    <p className="text-xs text-muted-foreground">Payment processing and billing</p>
                    <p className="text-xs text-muted-foreground">Data Processing Agreement: Yes</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <h5 className="font-medium text-sm">OpenAI</h5>
                    <p className="text-xs text-muted-foreground">AI-powered features and recommendations</p>
                    <p className="text-xs text-muted-foreground">Data Processing Agreement: Yes</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p className="text-sm text-muted-foreground">
                  We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Your Rights (GDPR & CCPA)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">You have the following rights regarding your personal data:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="h-4 w-4 text-green-600" />
                    <h4 className="font-semibold text-green-800">Right to Access</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    Request a copy of all personal data we hold about you in a portable format
                  </p>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Trash2 className="h-4 w-4 text-red-600" />
                    <h4 className="font-semibold text-red-800">Right to Erasure</h4>
                  </div>
                  <p className="text-sm text-red-700">
                    Request deletion of your personal data (subject to legal requirements)
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Right to Rectification</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Request correction of inaccurate or incomplete personal data
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <h4 className="font-semibold text-purple-800">Right to Object</h4>
                  </div>
                  <p className="text-sm text-purple-700">
                    Object to processing based on legitimate interests
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                To exercise these rights, contact us at <strong>privacy@fitclients.app</strong>. We will respond within 30 days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Data Retention and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Data Retention</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Account Data:</strong> Retained while your account is active, deleted 30 days after account closure</p>
                  <p><strong>Client Data:</strong> Retained while your account is active, deleted 30 days after account closure</p>
                  <p><strong>Usage Data:</strong> Retained for 2 years for service improvement</p>
                  <p><strong>Payment Data:</strong> Retained for 7 years for tax and legal compliance</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Security Measures</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• End-to-end encryption for data in transit and at rest</p>
                  <p>• Regular security audits and penetration testing</p>
                  <p>• Access controls and authentication requirements</p>
                  <p>• Regular backups with encryption</p>
                  <p>• Employee training on data protection</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Your data may be processed in countries outside your residence. We ensure adequate protection through:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Standard Contractual Clauses (SCCs) for EU data transfers</li>
                <li>• Adequacy decisions where applicable</li>
                <li>• Data Processing Agreements with all service providers</li>
                <li>• Regular compliance monitoring and audits</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For privacy-related questions, data requests, or concerns, contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">privacy@fitclients.app</p>
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
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Response Time</p>
                    <p className="text-sm text-muted-foreground">Within 30 days for data requests</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/terms">
              <Button variant="outline">
                View Terms of Service
              </Button>
            </Link>
            <Link to="/login">
              <Button>
                Accept & Continue to FitClients
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            By using FitClients, you acknowledge that you have read and understand this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 