import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Lock, Database, Users, Calendar, FileText, Check, AlertTriangle } from "lucide-react";

interface DataProcessingAgreementProps {
  onAccept?: () => void;
  onDecline?: () => void;
  showAcceptance?: boolean;
}

export const DataProcessingAgreement = ({ 
  onAccept, 
  onDecline, 
  showAcceptance = false 
}: DataProcessingAgreementProps) => {
  const [accepted, setAccepted] = useState(false);
  const [showFullAgreement, setShowFullAgreement] = useState(false);

  const handleAccept = () => {
    if (accepted && onAccept) {
      onAccept();
    }
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-blue-800">Data Processing Agreement</CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">GDPR Compliant</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700">
            This agreement outlines how FitClients processes your data in compliance with GDPR and other data protection regulations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 text-sm">You are the Data Controller</h4>
                <p className="text-blue-600 text-xs">You control and are responsible for client data you input</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Database className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 text-sm">We are the Data Processor</h4>
                <p className="text-blue-600 text-xs">We process data only as instructed by you</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 text-sm">Security Measures</h4>
                <p className="text-blue-600 text-xs">Industry-standard encryption and access controls</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 text-sm">Data Retention</h4>
                <p className="text-blue-600 text-xs">Data deleted 30 days after account termination</p>
              </div>
            </div>
          </div>

          {showAcceptance && (
            <div className="flex items-center space-x-2 pt-4 border-t border-blue-200">
              <Checkbox
                id="dpa-accept"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked as boolean)}
              />
              <label htmlFor="dpa-accept" className="text-sm text-blue-700">
                I acknowledge that I have read and agree to the Data Processing Agreement
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {showAcceptance && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFullAgreement(!showFullAgreement)}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            {showFullAgreement ? "Hide" : "View"} Full Agreement
          </Button>
          
          <Button
            variant="outline"
            onClick={handleDecline}
            className="flex-1"
          >
            Decline
          </Button>
          
          <Button
            onClick={handleAccept}
            disabled={!accepted}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-2" />
            Accept Agreement
          </Button>
        </div>
      )}

      {/* Full Agreement */}
      {showFullAgreement && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Data Processing Agreement</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">1. Definitions</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><strong>"Data Controller"</strong> means you, the fitness professional using our service, who determines the purposes and means of processing client data.</p>
                <p><strong>"Data Processor"</strong> means FitClients, who processes data on behalf of the Data Controller.</p>
                <p><strong>"Personal Data"</strong> means any information relating to an identified or identifiable natural person.</p>
                <p><strong>"Processing"</strong> means any operation performed on Personal Data.</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">2. Subject Matter and Duration</h3>
              <p className="text-sm text-muted-foreground">
                This agreement applies to the processing of Personal Data by FitClients on behalf of the Data Controller for the purpose of providing CRM services. 
                This agreement remains in effect for the duration of the service agreement and until all Personal Data is deleted.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">3. Nature and Purpose of Processing</h3>
              <p className="text-sm text-muted-foreground mb-2">
                FitClients processes Personal Data for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Providing CRM functionality and client management</li>
                <li>Processing payments and billing</li>
                <li>Generating reports and analytics</li>
                <li>Providing customer support</li>
                <li>Ensuring service security and reliability</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">4. Types of Personal Data</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The following categories of Personal Data may be processed:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Client names, contact details, and demographic information</li>
                <li>Fitness goals, medical history, and progress measurements</li>
                <li>Session notes, workout plans, and progress tracking</li>
                <li>Payment records and billing information</li>
                <li>Photos and progress images (with consent)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">5. Data Controller Obligations</h3>
              <p className="text-sm text-muted-foreground mb-2">
                As the Data Controller, you are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Ensuring you have a legal basis for processing client data</li>
                <li>Obtaining necessary consents from clients</li>
                <li>Providing clients with information about data processing</li>
                <li>Responding to client data subject requests</li>
                <li>Maintaining accurate and up-to-date client information</li>
                <li>Notifying FitClients of any changes to processing instructions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">6. Data Processor Obligations</h3>
              <p className="text-sm text-muted-foreground mb-2">
                FitClients commits to:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Process Personal Data only as instructed by the Data Controller</li>
                <li>Implement appropriate technical and organizational security measures</li>
                <li>Ensure confidentiality of Personal Data</li>
                <li>Assist the Data Controller in responding to data subject requests</li>
                <li>Notify the Data Controller of any data breaches</li>
                <li>Delete or return Personal Data upon termination</li>
                <li>Maintain records of processing activities</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">7. Security Measures</h3>
              <p className="text-sm text-muted-foreground mb-2">
                FitClients implements the following security measures:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>End-to-end encryption for data in transit and at rest</li>
                <li>Access controls and authentication requirements</li>
                <li>Regular security audits and penetration testing</li>
                <li>Employee training on data protection</li>
                <li>Regular backups with encryption</li>
                <li>Incident response procedures</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">8. Subprocessors</h3>
              <p className="text-sm text-muted-foreground mb-2">
                FitClients may use the following subprocessors:
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Firebase (Google)</h4>
                  <p className="text-xs text-muted-foreground">Hosting, database, and authentication services</p>
                  <p className="text-xs text-muted-foreground">Data Processing Agreement: Yes</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Stripe</h4>
                  <p className="text-xs text-muted-foreground">Payment processing and billing</p>
                  <p className="text-xs text-muted-foreground">Data Processing Agreement: Yes</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">OpenAI</h4>
                  <p className="text-xs text-muted-foreground">AI-powered features and recommendations</p>
                  <p className="text-xs text-muted-foreground">Data Processing Agreement: Yes</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">9. Data Subject Rights</h3>
              <p className="text-sm text-muted-foreground mb-2">
                FitClients will assist the Data Controller in fulfilling data subject requests, including:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                <li>Right to access Personal Data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure of Personal Data</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to restrict processing</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">10. Data Breach Notification</h3>
              <p className="text-sm text-muted-foreground">
                FitClients will notify the Data Controller without undue delay after becoming aware of a Personal Data breach. 
                The notification will include information about the nature of the breach, the categories and number of data subjects affected, 
                the likely consequences, and the measures taken to address the breach.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">11. Data Retention and Deletion</h3>
              <p className="text-sm text-muted-foreground">
                Personal Data will be retained only for as long as necessary to provide the service. Upon termination of the service agreement, 
                FitClients will delete all Personal Data within 30 days, unless retention is required by law.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">12. Audit Rights</h3>
              <p className="text-sm text-muted-foreground">
                The Data Controller has the right to audit FitClients' compliance with this agreement. FitClients will provide reasonable assistance 
                and access to relevant documentation and personnel for such audits.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">13. Governing Law</h3>
              <p className="text-sm text-muted-foreground">
                This agreement is governed by the laws of the State of Delaware, United States, and the General Data Protection Regulation (GDPR) 
                where applicable.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-800 text-sm">Important Notice</h4>
                  <p className="text-amber-700 text-xs">
                    This agreement is a legally binding document. By accepting, you acknowledge that you have read, understood, 
                    and agree to be bound by these terms. If you have any questions, please contact us at legal@fitclients.app.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 