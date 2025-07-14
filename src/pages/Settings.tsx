import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  DollarSign,
  Calendar,
  Smartphone,
  Mail,
  Shield,
  Download,
  Upload,
  Trash2,
  Save,
  Camera,
  CreditCard,
  Sparkles,
  RefreshCw,
  Clock,
  Loader2,
  Share2,
  Database,
  Plus,
} from "lucide-react";

import { SubscriptionManager } from "@/components/SubscriptionManager";
import { BackupManager } from "@/components/BackupManager";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { userProfileService } from "@/lib/firebaseService";
import { UserProfile, OperatingHours, Certification, Pricing, Package } from "@/lib/types";

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  const [notifications, setNotifications] = useState({
    emailReminders: true,
    smsReminders: false,
    paymentAlerts: true,
    newClientWelcome: true,
    weeklyReports: false,
  });

  const [businessInfo, setBusinessInfo] = useState({
    businessName: "FitTrainer Pro",
    trainerName: "Alex Johnson",
    email: "alex@fittrainerpro.com",
    phone: "(555) 123-4567",
    website: "www.fittrainerpro.com",
    address: "123 Fitness St, Gym City, GC 12345",
    bio: "Certified personal trainer with 5+ years of experience helping clients achieve their fitness goals.",
  });

  const [pricing, setPricing] = useState<Pricing>({
    personalTraining: 75,
    consultation: 50,
    assessment: 60,
    packageDiscount: 10,
    currency: "USD",
    taxRate: 8.5,
    packages: [
      { id: "1", name: "4-Session Package", sessions: 4, price: 270, discount: 10 },
      { id: "2", name: "8-Session Package", sessions: 8, price: 540, discount: 10 },
      { id: "3", name: "12-Session Package", sessions: 12, price: 810, discount: 15 },
    ],
  });

  const { user, userProfile, updateUserProfile } = useAuth();
  
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>([
    { day: "Monday", isOpen: true, startTime: "09:00", endTime: "17:00" },
    { day: "Tuesday", isOpen: true, startTime: "09:00", endTime: "17:00" },
    { day: "Wednesday", isOpen: true, startTime: "09:00", endTime: "17:00" },
    { day: "Thursday", isOpen: true, startTime: "09:00", endTime: "17:00" },
    { day: "Friday", isOpen: true, startTime: "09:00", endTime: "17:00" },
    { day: "Saturday", isOpen: true, startTime: "09:00", endTime: "14:00" },
    { day: "Sunday", isOpen: false, startTime: "09:00", endTime: "17:00" },
  ]);
  const [socialMedia, setSocialMedia] = useState({
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
  });

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [showAddCertification, setShowAddCertification] = useState(false);
  const [newCertification, setNewCertification] = useState({
    name: "",
    issuingOrganization: "",
    issueDate: "",
    expirationDate: "",
    credentialId: "",
    notes: "",
  });

  // Handle tab changes from URL parameters
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  // Manual refresh profile function
  const refreshProfile = async () => {
    if (!user?.uid) return;
    
    setRefreshing(true);
    try {
      const profile = await userProfileService.getUserProfile(user.uid);
      
      if (profile) {
        setProfileForm({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          bio: profile.bio || "",
        });
        setProfile(profile);
        setOperatingHours(profile.operatingHours || [
          { day: "Monday", isOpen: true, startTime: "09:00", endTime: "17:00" },
          { day: "Tuesday", isOpen: true, startTime: "09:00", endTime: "17:00" },
          { day: "Wednesday", isOpen: true, startTime: "09:00", endTime: "17:00" },
          { day: "Thursday", isOpen: true, startTime: "09:00", endTime: "17:00" },
          { day: "Friday", isOpen: true, startTime: "09:00", endTime: "17:00" },
          { day: "Saturday", isOpen: true, startTime: "09:00", endTime: "14:00" },
          { day: "Sunday", isOpen: false, startTime: "09:00", endTime: "17:00" },
        ]);
        // Load existing social media if it exists
        if (profile.socialMedia) {
          setSocialMedia({
            instagram: profile.socialMedia.instagram || "",
            facebook: profile.socialMedia.facebook || "",
            tiktok: profile.socialMedia.tiktok || "",
            youtube: profile.socialMedia.youtube || "",
          });
        }
        toast({
          title: "Profile Refreshed",
          description: "Your profile has been refreshed successfully.",
        });
      } else {
        toast({
          title: "No Profile Found",
          description: "No profile found. Please try saving your information.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Update form when userProfile loads
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        bio: userProfile.bio || "",
      });
      setProfile(userProfile);
      
      // Load existing operating hours if they exist
      if (userProfile.operatingHours && userProfile.operatingHours.length > 0) {
        setOperatingHours(userProfile.operatingHours);
      }
      
      // Load existing social media if it exists
      if (userProfile.socialMedia) {
        setSocialMedia({
          instagram: userProfile.socialMedia.instagram || "",
          facebook: userProfile.socialMedia.facebook || "",
          tiktok: userProfile.socialMedia.tiktok || "",
          youtube: userProfile.socialMedia.youtube || "",
        });
      }

      // Load existing certifications if they exist
      if (userProfile.certifications) {
        setCertifications(userProfile.certifications);
      }

      // Load existing pricing if it exists
      if (userProfile.pricing) {
        setPricing(userProfile.pricing);
      }
      
      setProfileLoading(false);
    } else if (user?.email) {
      // If no profile but we have user, at least set the email
      setProfileForm(prev => ({
        ...prev,
        email: user.email || "",
      }));
      // Wait a bit more for profile to load
      setTimeout(() => setProfileLoading(false), 2000);
    }
  }, [userProfile, user]);

  const handleSaveProfile = async () => {
    if (!user?.uid) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to save changes.",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name and last name are required.",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number format (optional but if provided, should be valid)
    if (profileForm.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(profileForm.phone.replace(/[\s\-\(\)]/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      // Create the updated profile with all form data and operating hours
      const updatedProfile = {
        // Preserve existing fields first
        ...profile,
        // Override with new data
        id: user.uid,
        email: user.email || profileForm.email,
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        displayName: `${profileForm.firstName.trim()} ${profileForm.lastName.trim()}`.trim(),
        phone: profileForm.phone.trim(),
        bio: profileForm.bio.trim(),
        createdAt: profile?.createdAt || new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        operatingHours: operatingHours,
        socialMedia: socialMedia,
        certifications: certifications,
        pricing: pricing,
      };

      await userProfileService.updateUserProfile(user.uid, updatedProfile);
      
      // Update local state
      setProfile(updatedProfile);
      
      toast({
        title: "Profile Updated",
        description: "Your profile and business settings have been saved successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOperatingHoursChange = (day: string, field: keyof OperatingHours, value: any) => {
    setOperatingHours(prev => 
      prev.map(hour => 
        hour.day === day 
          ? { ...hour, [field]: value }
          : hour
      )
    );
  };

  // Certification management functions
  const getCertificationStatus = (expirationDate: string): "active" | "expired" | "expiring-soon" => {
    const today = new Date();
    const expiration = new Date(expirationDate);
    const daysUntilExpiration = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiration < 0) return "expired";
    if (daysUntilExpiration <= 30) return "expiring-soon";
    return "active";
  };

  const addCertification = () => {
    if (!newCertification.name || !newCertification.issuingOrganization || !newCertification.issueDate || !newCertification.expirationDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const certification: Certification = {
      id: Date.now().toString(),
      name: newCertification.name,
      issuingOrganization: newCertification.issuingOrganization,
      issueDate: newCertification.issueDate,
      expirationDate: newCertification.expirationDate,
      credentialId: newCertification.credentialId || undefined,
      notes: newCertification.notes || undefined,
      status: getCertificationStatus(newCertification.expirationDate),
    };

    setCertifications(prev => [...prev, certification]);
    setNewCertification({
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expirationDate: "",
      credentialId: "",
      notes: "",
    });
    setShowAddCertification(false);
    
    toast({
      title: "Certification Added",
      description: "Your certification has been added successfully.",
    });
  };

  const deleteCertification = (id: string) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      setCertifications(prev => prev.filter(cert => cert.id !== id));
      toast({
        title: "Certification Deleted",
        description: "The certification has been removed.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pricing management functions
  const handlePricingChange = (field: keyof Pricing, value: any) => {
    setPricing(prev => ({ ...prev, [field]: value }));
  };

  const handlePackageChange = (packageId: string, field: keyof Package, value: any) => {
    setPricing(prev => ({
      ...prev,
      packages: prev.packages.map(pkg => 
        pkg.id === packageId ? { ...pkg, [field]: value } : pkg
      )
    }));
  };

  const addPackage = () => {
    const newPackage: Package = {
      id: Date.now().toString(),
      name: `New Package`,
      sessions: 1,
      price: 0,
      discount: 0,
    };
    setPricing(prev => ({
      ...prev,
      packages: [...prev.packages, newPackage]
    }));
  };

  const deletePackage = (packageId: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      setPricing(prev => ({
        ...prev,
        packages: prev.packages.filter(pkg => pkg.id !== packageId)
      }));
      toast({
        title: "Package Deleted",
        description: "The package has been removed.",
      });
    }
  };

  const calculatePackagePrice = (sessions: number, basePrice: number, discount: number) => {
    const totalBeforeDiscount = sessions * basePrice;
    const discountAmount = (totalBeforeDiscount * discount) / 100;
    return totalBeforeDiscount - discountAmount;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account, business settings, and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshProfile}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              Profile
            </TabsTrigger>
            <TabsTrigger value="business" className="text-xs sm:text-sm">
              Business
            </TabsTrigger>
            <TabsTrigger value="pricing" className="text-xs sm:text-sm">
              Pricing
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-xs sm:text-sm">
              Billing
            </TabsTrigger>
            <TabsTrigger value="referrals" className="text-xs sm:text-sm">
              Referrals
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">
              Security
            </TabsTrigger>
            <TabsTrigger value="backup" className="text-xs sm:text-sm">
              Backup
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="text-lg">AJ</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a professional photo for your profile
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                    <Button size="sm" variant="ghost">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Personal Details */}
              {profileLoading ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <div className="h-10 bg-muted animate-pulse rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <div className="h-10 bg-muted animate-pulse rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <div className="h-10 bg-muted animate-pulse rounded-md" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <div className="h-10 bg-muted animate-pulse rounded-md" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name *</Label>
                    <Input 
                      id="first-name" 
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                      aria-describedby="first-name-error"
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name *</Label>
                    <Input 
                      id="last-name" 
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                      aria-describedby="last-name-error"
                      aria-required="true"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      disabled
                      title="Email cannot be changed"
                      aria-describedby="email-disabled"
                    />
                    <p id="email-disabled" className="text-xs text-muted-foreground">
                      Email address cannot be changed
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                      type="tel"
                      aria-describedby="phone-help"
                    />
                    <p id="phone-help" className="text-xs text-muted-foreground">
                      Optional - Include area code
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  placeholder="Tell clients about your experience, certifications, and training philosophy..."
                  aria-describedby="bio-help"
                  maxLength={500}
                />
                <p id="bio-help" className="text-xs text-muted-foreground">
                  {profileForm.bio.length}/500 characters
                </p>
              </div>

              {/* Certifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Certifications & Qualifications</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAddCertification(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {certifications.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <div className="text-muted-foreground mb-2">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No certifications added yet</p>
                        <p className="text-xs text-muted-foreground">Add your professional certifications and qualifications</p>
                      </div>
                    </div>
                  ) : (
                    certifications.map((certification) => (
                      <div key={certification.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{certification.name}</h4>
                            <Badge 
                              variant={
                                certification.status === "active" ? "default" :
                                certification.status === "expiring-soon" ? "secondary" : "destructive"
                              }
                            >
                              {certification.status === "active" ? "Active" :
                               certification.status === "expiring-soon" ? "Expiring Soon" : "Expired"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {certification.issuingOrganization}
                          </p>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>Issued: {formatDate(certification.issueDate)}</p>
                            <p>Expires: {formatDate(certification.expirationDate)}</p>
                            {certification.credentialId && (
                              <p>ID: {certification.credentialId}</p>
                            )}
                            {certification.notes && (
                              <p className="mt-2 italic">"{certification.notes}"</p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCertification(certification.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Certification Modal */}
                {showAddCertification && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Add Certification</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAddCertification(false)}
                        >
                          ×
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cert-name">Certification Name *</Label>
                          <Input
                            id="cert-name"
                            value={newCertification.name}
                            onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., NASM Certified Personal Trainer"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cert-org">Issuing Organization *</Label>
                          <Input
                            id="cert-org"
                            value={newCertification.issuingOrganization}
                            onChange={(e) => setNewCertification(prev => ({ ...prev, issuingOrganization: e.target.value }))}
                            placeholder="e.g., National Academy of Sports Medicine"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cert-issue">Issue Date *</Label>
                            <Input
                              id="cert-issue"
                              type="date"
                              value={newCertification.issueDate}
                              onChange={(e) => setNewCertification(prev => ({ ...prev, issueDate: e.target.value }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cert-expire">Expiration Date *</Label>
                            <Input
                              id="cert-expire"
                              type="date"
                              value={newCertification.expirationDate}
                              onChange={(e) => setNewCertification(prev => ({ ...prev, expirationDate: e.target.value }))}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cert-id">Credential ID (Optional)</Label>
                          <Input
                            id="cert-id"
                            value={newCertification.credentialId}
                            onChange={(e) => setNewCertification(prev => ({ ...prev, credentialId: e.target.value }))}
                            placeholder="e.g., NASM-CPT-123456"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cert-notes">Notes (Optional)</Label>
                          <Textarea
                            id="cert-notes"
                            value={newCertification.notes}
                            onChange={(e) => setNewCertification(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Additional notes about this certification..."
                            rows={3}
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-6">
                        <Button
                          variant="outline"
                          onClick={() => setShowAddCertification(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={addCertification}
                          className="flex-1"
                        >
                          Add Certification
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Business Information
              </CardTitle>
              <CardDescription>
                Configure your business details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    defaultValue={businessInfo.businessName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue={businessInfo.website} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  defaultValue={businessInfo.address}
                  rows={3}
                  placeholder="Full business address including city, state, and zip code"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                <h3 className="font-medium">Operating Hours</h3>
                  <Button 
                    size="sm" 
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save Hours"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {operatingHours.map((hour) => (
                    <div key={hour.day} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-20">
                        <span className="text-sm font-medium">{hour.day}</span>
                      </div>
                      <Switch 
                        checked={hour.isOpen}
                        onCheckedChange={(checked) => 
                          handleOperatingHoursChange(hour.day, 'isOpen', checked)
                        }
                        aria-label={`Toggle ${hour.day} operating hours`}
                      />
                      <Input 
                        className="w-20" 
                        value={hour.startTime}
                        type="time"
                        onChange={(e) => 
                          handleOperatingHoursChange(hour.day, 'startTime', e.target.value)
                        }
                        disabled={!hour.isOpen}
                        aria-label={`${hour.day} start time`}
                      />
                      <span className="text-muted-foreground text-sm">to</span>
                      <Input
                        className="w-20"
                        value={hour.endTime}
                        type="time"
                        onChange={(e) => 
                          handleOperatingHoursChange(hour.day, 'endTime', e.target.value)
                        }
                        disabled={!hour.isOpen}
                        aria-label={`${hour.day} end time`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input 
                      id="instagram" 
                      placeholder="@yourusername"
                      value={socialMedia.instagram}
                      onChange={(e) => setSocialMedia(prev => ({ ...prev, instagram: e.target.value }))}
                      aria-describedby="instagram-help"
                    />
                    <p id="instagram-help" className="text-xs text-muted-foreground">
                      Your Instagram username or profile URL
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input 
                      id="facebook" 
                      placeholder="facebook.com/yourpage"
                      value={socialMedia.facebook}
                      onChange={(e) => setSocialMedia(prev => ({ ...prev, facebook: e.target.value }))}
                      aria-describedby="facebook-help"
                    />
                    <p id="facebook-help" className="text-xs text-muted-foreground">
                      Your Facebook page URL
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok">TikTok</Label>
                    <Input 
                      id="tiktok" 
                      placeholder="@yourusername"
                      value={socialMedia.tiktok}
                      onChange={(e) => setSocialMedia(prev => ({ ...prev, tiktok: e.target.value }))}
                      aria-describedby="tiktok-help"
                    />
                    <p id="tiktok-help" className="text-xs text-muted-foreground">
                      Your TikTok username
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input 
                      id="youtube" 
                      placeholder="youtube.com/yourchannel"
                      value={socialMedia.youtube}
                      onChange={(e) => setSocialMedia(prev => ({ ...prev, youtube: e.target.value }))}
                      aria-describedby="youtube-help"
                    />
                    <p id="youtube-help" className="text-xs text-muted-foreground">
                      Your YouTube channel URL
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing & Rates
              </CardTitle>
              <CardDescription>
                Set your service rates and payment preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="personal-training">
                    Personal Training (per session)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="personal-training"
                      type="number"
                      min="0"
                      step="0.01"
                      value={pricing.personalTraining}
                      onChange={(e) => handlePricingChange('personalTraining', parseFloat(e.target.value) || 0)}
                      className="pl-8"
                      aria-describedby="personal-training-help"
                    />
                  </div>
                  <p id="personal-training-help" className="text-xs text-muted-foreground">
                    Set your rate for individual training sessions
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultation">Consultation</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="consultation"
                      type="number"
                      min="0"
                      step="0.01"
                      value={pricing.consultation}
                      onChange={(e) => handlePricingChange('consultation', parseFloat(e.target.value) || 0)}
                      className="pl-8"
                      aria-describedby="consultation-help"
                    />
                  </div>
                  <p id="consultation-help" className="text-xs text-muted-foreground">
                    Set your rate for initial consultations
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assessment">Fitness Assessment</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="assessment"
                      type="number"
                      min="0"
                      step="0.01"
                      value={pricing.assessment}
                      onChange={(e) => handlePricingChange('assessment', parseFloat(e.target.value) || 0)}
                      className="pl-8"
                      aria-describedby="assessment-help"
                    />
                  </div>
                  <p id="assessment-help" className="text-xs text-muted-foreground">
                    Set your rate for fitness assessments
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="package-discount">Package Discount (%)</Label>
                  <div className="relative">
                    <Input
                      id="package-discount"
                      type="number"
                      min="0"
                      max="100"
                      value={pricing.packageDiscount}
                      onChange={(e) => handlePricingChange('packageDiscount', parseFloat(e.target.value) || 0)}
                      className="pr-8"
                      aria-describedby="package-discount-help"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  </div>
                  <p id="package-discount-help" className="text-xs text-muted-foreground">
                    Default discount applied to packages
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={pricing.currency}
                    onValueChange={(value) => handlePricingChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <div className="relative">
                    <Input
                      id="tax-rate"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={pricing.taxRate}
                      onChange={(e) => handlePricingChange('taxRate', parseFloat(e.target.value) || 0)}
                      className="pr-8"
                      aria-describedby="tax-rate-help"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      %
                    </span>
                  </div>
                  <p id="tax-rate-help" className="text-xs text-muted-foreground">
                    Tax rate applied to all services
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Package Pricing</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={addPackage}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Package
                  </Button>
                </div>
                <div className="space-y-3">
                  {pricing.packages.map((pkg) => (
                    <div key={pkg.id} className="p-4 border rounded-lg bg-card">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Input
                            value={pkg.name}
                            onChange={(e) => handlePackageChange(pkg.id, 'name', e.target.value)}
                            className="w-48"
                            placeholder="Package name"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePackage(pkg.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Sessions</Label>
                          <Input
                            type="number"
                            min="1"
                            value={pkg.sessions}
                            onChange={(e) => handlePackageChange(pkg.id, 'sessions', parseInt(e.target.value) || 1)}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Price ($)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={pkg.price}
                            onChange={(e) => handlePackageChange(pkg.id, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Discount (%)</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={pkg.discount}
                            onChange={(e) => handlePackageChange(pkg.id, 'discount', parseFloat(e.target.value) || 0)}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Total</Label>
                          <div className="p-2 bg-muted rounded text-sm font-medium">
                            ${pkg.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {pkg.sessions} sessions × ${pricing.personalTraining} = ${(pkg.sessions * pricing.personalTraining).toFixed(2)} 
                        {pkg.discount > 0 && ` - ${pkg.discount}% = $${pkg.price.toFixed(2)}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Pricing
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <SubscriptionManager />
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Referral Program
              </CardTitle>
              <CardDescription>
                Coming soon - Track referrals and earn rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Referral Program</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Track referrals, manage rewards, and grow your business through word-of-mouth marketing.
                </p>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Email Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get email notifications for upcoming sessions
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        emailReminders: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">SMS Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text messages for session reminders
                    </p>
                  </div>
                  <Switch
                    checked={notifications.smsReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        smsReminders: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Payment Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when payments are received or overdue
                    </p>
                  </div>
                  <Switch
                    checked={notifications.paymentAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        paymentAlerts: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">New Client Welcome</Label>
                    <p className="text-sm text-muted-foreground">
                      Send welcome emails to new clients automatically
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newClientWelcome}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        newClientWelcome: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly business summary reports
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        weeklyReports: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Client Notification Templates</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Session Reminder</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Template Editor",
                            description: "Template editing feature coming soon.",
                          });
                        }}
                      >
                        Edit Template
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hi {"{client_name}"}, this is a reminder for your training
                      session tomorrow at {"{time}"}. See you then!
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Payment Reminder</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Template Editor",
                            description: "Template editing feature coming soon.",
                          });
                        }}
                      >
                        Edit Template
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Hi {"{client_name}"}, your payment of ${"{amount}"} is now
                      due. Please submit payment at your earliest convenience.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Privacy
              </CardTitle>
              <CardDescription>
                Manage your account security and data preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Password & Authentication</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Password Update",
                        description: "Password update feature coming soon.",
                      });
                    }}
                  >
                    Update Password
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Data & Privacy</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-medium text-blue-800 mb-2">Backup & Recovery</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Export your data, create automated backups, and restore from previous backups.
                    </p>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      onClick={() => setActiveTab("backup")}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Manage Backups
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-red-600">Danger Zone</h3>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h4 className="font-medium text-red-800 mb-2">
                    Delete Account
                  </h4>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. This
                    action cannot be undone.
                  </p>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                        // Handle account deletion
                        toast({
                          title: "Account Deletion",
                          description: "Account deletion feature coming soon.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <BackupManager onDataChange={() => {
            // Trigger data refresh if needed
            toast({
              title: "Data Updated",
              description: "Your backup data has been updated.",
            });
          }} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
