import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Lock, Eye, Download, Trash2, AlertCircle } from "lucide-react";

const Privacy = () => {
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
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">GDPR Compliant</Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">CCPA Compliant</Badge>
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
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Account Information</h4>
                <p className="text-sm text-muted-foreground">
                  When you create a FitClients account, we collect your name, email address, and encrypted password. 
                  This information is necessary to provide you with access to our service.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Client Data</h4>
                <p className="text-sm text-muted-foreground">
                  As a fitness professional using our CRM, you may input client information including names, contact details, 
                  fitness goals, session notes, progress measurements, and payment records. This data belongs to you and is 
                  processed solely to provide our service.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Your Rights (GDPR & CCPA)</CardTitle>
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
                    Request a copy of all personal data we hold about you
                  </p>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Trash2 className="h-4 w-4 text-red-600" />
                    <h4 className="font-semibold text-red-800">Right to Erasure</h4>
                  </div>
                  <p className="text-sm text-red-700">
                    Request deletion of your personal data
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
              <CardTitle>3. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For privacy-related questions, data requests, or concerns, contact us:
              </p>
              <div className="space-y-2">
                <p className="text-sm"><strong>Email:</strong> privacy@fitclients.app</p>
                <p className="text-sm"><strong>Response Time:</strong> Within 30 days</p>
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