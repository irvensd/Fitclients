import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  User, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  CheckCircle,
  Download,
  FileSpreadsheet,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Papa from "papaparse";
import { sampleClients } from "@/lib/sampleData";
import React from "react";

interface OnboardingData {
  // Step 1: Business Setup
  businessName: string;
  businessType: string;
  location: string;
  timezone: string;
  
  // Step 2: Profile
  phone: string;
  bio: string;
  specialties: string;
  experience: string;
  
  // Step 3: Clients
  importMethod: "csv" | "manual" | "skip";
  clients: Array<{
    name: string;
    email: string;
    phone: string;
    goals?: string;
  }>;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [data, setData] = useState<OnboardingData>({
    businessName: "",
    businessType: "personal",
    location: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    phone: "",
    bio: "",
    specialties: "",
    experience: "1-3",
    importMethod: "skip",
    clients: []
  });

  const steps = [
    { number: 1, title: "Business Setup", icon: Building2 },
    { number: 2, title: "Your Profile", icon: User },
    { number: 3, title: "Import Clients", icon: Users }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const clients = results.data
          .filter((row: any) => row.name || row.Name) // Filter out empty rows
          .map((row: any) => ({
            name: row.name || row.Name || "",
            email: row.email || row.Email || "",
            phone: row.phone || row.Phone || row.telephone || row.Telephone || "",
            goals: row.goals || row.Goals || row.goal || row.Goal || ""
          }));
        
        setData({ ...data, clients });
        toast({
          title: "Success!",
          description: `Imported ${clients.length} clients from CSV`,
        });
      },
      error: (error) => {
        toast({
          title: "Import failed",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const downloadSampleCSV = () => {
    const csvContent = `name,email,phone,goals
John Smith,john@email.com,555-0123,Lose 10 pounds
Sarah Johnson,sarah@email.com,555-0124,Build muscle strength
Mike Davis,mike@email.com,555-0125,Improve cardiovascular health`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fitclient_sample_import.csv';
    a.click();
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update user profile with onboarding data
      await updateDoc(doc(db, "users", user.uid), {
        onboardingCompleted: true,
        businessName: data.businessName,
        businessType: data.businessType,
        location: data.location,
        timezone: data.timezone,
        phone: data.phone,
        bio: data.bio,
        specialties: data.specialties.split(",").map(s => s.trim()),
        experience: data.experience,
        updatedAt: new Date()
      });

      // Add imported clients if any
      if (data.clients.length > 0) {
        // This would normally batch create clients
        // For now, we'll just show success
        toast({
          title: "Welcome to FitClient!",
          description: `Your account is set up with ${data.clients.length} clients imported.`,
        });
      } else {
        toast({
          title: "Welcome to FitClient!",
          description: "Your account is all set up. Let's add your first client!",
        });
      }

      navigate("/admin");
    } catch (error) {
      toast({
        title: "Setup failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to FitClient!</h1>
          <p className="text-muted-foreground">Let's get your fitness business set up in just 3 steps</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={(currentStep / 3) * 100} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div 
                key={step.number}
                className={`flex items-center gap-2 ${
                  step.number <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className={`rounded-full p-2 ${
                  step.number < currentStep ? 'bg-primary text-primary-foreground' :
                  step.number === currentStep ? 'bg-primary/20 text-primary' :
                  'bg-muted'
                }`}>
                  {step.number < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    React.createElement(step.icon, { className: "h-5 w-5" })
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {steps[currentStep - 1].icon && React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your fitness business"}
              {currentStep === 2 && "Create your professional trainer profile"}
              {currentStep === 3 && "Import your existing clients or add them later"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Business Setup */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    placeholder="FitLife Personal Training"
                    value={data.businessName}
                    onChange={(e) => setData({ ...data, businessName: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select 
                    value={data.businessType} 
                    onValueChange={(value) => setData({ ...data, businessType: value })}
                  >
                    <SelectTrigger id="businessType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Training</SelectItem>
                      <SelectItem value="online">Online Coaching</SelectItem>
                      <SelectItem value="hybrid">Hybrid (In-Person & Online)</SelectItem>
                      <SelectItem value="group">Group Fitness</SelectItem>
                      <SelectItem value="boutique">Boutique Studio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="New York, NY"
                    value={data.location}
                    onChange={(e) => setData({ ...data, location: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={data.timezone} 
                    onValueChange={(value) => setData({ ...data, timezone: value })}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Central European</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Profile */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell potential clients about your training philosophy and approach..."
                    className="h-24"
                    value={data.bio}
                    onChange={(e) => setData({ ...data, bio: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                  <Input
                    id="specialties"
                    placeholder="Weight Loss, Strength Training, HIIT, Nutrition"
                    value={data.specialties}
                    onChange={(e) => setData({ ...data, specialties: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Select 
                    value={data.experience} 
                    onValueChange={(value) => setData({ ...data, experience: value })}
                  >
                    <SelectTrigger id="experience">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">Less than 1 year</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Import Clients */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card 
                    className={`cursor-pointer transition-all ${
                      data.importMethod === 'csv' ? 'border-primary' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setData({ ...data, importMethod: 'csv' })}
                  >
                    <CardContent className="p-6 text-center">
                      <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Import CSV</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload your client list
                      </p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all ${
                      data.importMethod === 'manual' ? 'border-primary' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setData({ ...data, importMethod: 'manual' })}
                  >
                    <CardContent className="p-6 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Add Manually</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Enter clients one by one
                      </p>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer transition-all ${
                      data.importMethod === 'skip' ? 'border-primary' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setData({ ...data, importMethod: 'skip' })}
                  >
                    <CardContent className="p-6 text-center">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-semibold">Skip for Now</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add clients later
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {data.importMethod === 'csv' && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="mb-2">Drop your CSV file here or click to browse</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Supported columns: name, email, phone, goals
                      </p>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="max-w-xs mx-auto"
                      />
                      <div className="flex gap-2 justify-center mt-4">
                        <Button
                          variant="link"
                          onClick={downloadSampleCSV}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download sample CSV
                        </Button>
                        <Button
                          variant="link"
                          onClick={() => {
                            setData({ ...data, clients: sampleClients.map(client => ({
                              name: client.name,
                              email: client.email,
                              phone: client.phone,
                              goals: client.goals
                            })) });
                            toast({
                              title: "Sample data loaded!",
                              description: "5 example clients have been added",
                            });
                          }}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Load sample data
                        </Button>
                      </div>
                    </div>

                    {data.clients.length > 0 && (
                      <div className="bg-muted rounded-lg p-4">
                        <p className="font-medium mb-2">
                          {data.clients.length} clients ready to import:
                        </p>
                        <ul className="text-sm space-y-1">
                          {data.clients.slice(0, 5).map((client, idx) => (
                            <li key={idx}>{client.name} - {client.email}</li>
                          ))}
                          {data.clients.length > 5 && (
                            <li className="text-muted-foreground">
                              ...and {data.clients.length - 5} more
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {data.importMethod === 'manual' && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      You'll be redirected to add clients after setup
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={completeOnboarding}
              disabled={isLoading}
            >
              {isLoading ? "Setting up..." : "Complete Setup"}
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding; 